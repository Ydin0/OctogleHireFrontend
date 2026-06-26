"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Loader2,
  Pause,
  Play,
  Plus,
  Repeat,
  Trash2,
  Zap,
} from "lucide-react";

import {
  type RecurringInvoice,
  type InvoiceLineItemInput,
  fetchRecurringInvoices,
  createRecurringInvoice,
  updateRecurringInvoice,
  deleteRecurringInvoice,
  setRecurringInvoiceStatus,
  generateRecurringInvoiceNow,
} from "@/lib/api/invoices";
import { formatCurrency } from "../../_components/dashboard-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CompanyOption {
  id: string;
  name: string;
  logoUrl: string | null;
}

const FREQUENCIES = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "annual", label: "Annual" },
];

const isoToDate = (s: string | undefined | null) =>
  s ? new Date(s + "T00:00:00") : undefined;
const dateToIso = (d: Date | undefined) =>
  d ? d.toISOString().slice(0, 10) : "";

type LineRow = { description: string; amount: string };

const blankForm = () => ({
  companyId: "",
  title: "",
  description: "",
  currency: "USD",
  frequency: "monthly",
  dayOfMonth: "1",
  startDate: dateToIso(new Date()),
  endDate: "",
  taxRate: "0",
  dueInDays: "14",
  autoSend: false,
  lines: [{ description: "", amount: "" }] as LineRow[],
});

export function RecurringClient({
  token,
  companies,
}: {
  token: string;
  companies: CompanyOption[];
}) {
  const router = useRouter();
  const [items, setItems] = useState<RecurringInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(blankForm());

  const [reloadKey, setReloadKey] = useState(0);
  const load = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await fetchRecurringInvoices(token);
      if (!cancelled) {
        setItems(data);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, reloadKey]);

  const openCreate = () => {
    setEditingId(null);
    setForm(blankForm());
    setOpen(true);
  };

  const lineTotal = form.lines.reduce((s, l) => s + (Number(l.amount) || 0), 0);

  const submit = async () => {
    if (!form.companyId || !form.title.trim()) {
      toast.error("Company and title are required");
      return;
    }
    const lineItems: InvoiceLineItemInput[] = form.lines
      .filter((l) => l.description.trim() || Number(l.amount) > 0)
      .map((l) => ({ description: l.description.trim(), amount: Number(l.amount) || 0 }));
    if (lineItems.length === 0) {
      toast.error("Add at least one line item");
      return;
    }
    setSubmitting(true);
    const payload = {
      companyId: form.companyId,
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      currency: form.currency,
      frequency: form.frequency,
      dayOfMonth: Number(form.dayOfMonth) || 1,
      startDate: form.startDate,
      endDate: form.endDate || null,
      taxRate: Number(form.taxRate) || 0,
      dueInDays: Number(form.dueInDays) || 14,
      autoSend: form.autoSend,
      lineItems,
    };
    const result = editingId
      ? await updateRecurringInvoice(token, editingId, payload)
      : await createRecurringInvoice(token, payload);
    setSubmitting(false);
    if (result === true || (typeof result === "object" && result.success)) {
      toast.success(editingId ? "Retainer updated" : "Retainer created");
      setOpen(false);
      load();
    } else {
      toast.error(
        typeof result === "object" && "error" in result ? result.error : "Failed",
      );
    }
  };

  const onPause = async (r: RecurringInvoice) => {
    setBusyId(r.id);
    const ok = await setRecurringInvoiceStatus(
      token,
      r.id,
      r.status === "active" ? "pause" : "resume",
    );
    setBusyId(null);
    if (ok) load();
    else toast.error("Failed to update status");
  };

  const onDelete = async (r: RecurringInvoice) => {
    if (!confirm(`Delete the "${r.title}" retainer? This won't delete invoices already generated.`)) return;
    setBusyId(r.id);
    const ok = await deleteRecurringInvoice(token, r.id);
    setBusyId(null);
    if (ok) {
      toast.success("Retainer deleted");
      load();
    } else toast.error("Failed to delete");
  };

  const onGenerateNow = async (r: RecurringInvoice) => {
    setBusyId(r.id);
    const res = await generateRecurringInvoiceNow(token, r.id);
    setBusyId(null);
    if ("error" in res) {
      toast.error(res.error);
      return;
    }
    if (res.created) {
      toast.success("Invoice generated — see the Invoices tab");
      router.refresh();
    } else {
      toast.message(res.message ?? "Already generated this period");
    }
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Monthly retainers (hosting, maintenance, social media…) auto-generate
          invoices that appear in the Invoices tab.
        </p>
        <Button onClick={openCreate} className="gap-1.5">
          <Plus className="size-4" />
          New retainer
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <Repeat className="size-6 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium">No recurring retainers yet</p>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            Set up a monthly retainer for a client and we&apos;ll raise the
            invoice automatically each period.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {items.map((r) => (
            <div
              key={r.id}
              className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4"
            >
              <div className="min-w-[200px] flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{r.title}</span>
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider",
                      r.status === "active"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                        : "border-border bg-muted/50 text-muted-foreground",
                    )}
                  >
                    {r.status}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {r.companyName} · {r.frequency} · day {r.dayOfMonth}
                  {r.lastGeneratedPeriod ? ` · last ${r.lastGeneratedPeriod}` : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-semibold">
                  {formatCurrency(r.subtotal, r.currency)}
                  <span className="text-[10px] font-normal text-muted-foreground">
                    {" "}
                    /{r.frequency === "monthly" ? "mo" : r.frequency === "quarterly" ? "qtr" : "yr"}
                  </span>
                </p>
                {r.autoSend && (
                  <p className="text-[10px] text-pulse">auto-send</p>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5"
                  disabled={busyId === r.id || r.status !== "active"}
                  onClick={() => onGenerateNow(r)}
                >
                  {busyId === r.id ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Zap className="size-3.5" />
                  )}
                  Generate now
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="size-8"
                  disabled={busyId === r.id}
                  onClick={() => onPause(r)}
                  title={r.status === "active" ? "Pause" : "Resume"}
                >
                  {r.status === "active" ? (
                    <Pause className="size-3.5" />
                  ) : (
                    <Play className="size-3.5" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="size-8 text-muted-foreground hover:text-red-600"
                  disabled={busyId === r.id}
                  onClick={() => onDelete(r)}
                  title="Delete"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / edit dialog */}
      <Dialog open={open} onOpenChange={(o) => !o && !submitting && setOpen(false)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit retainer" : "New recurring retainer"}</DialogTitle>
            <DialogDescription>
              Auto-generates a draft invoice each period. Turn on auto-send to
              email it to the client automatically.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[65vh] space-y-4 overflow-y-auto pr-1">
            <div className="space-y-2">
              <Label>Client</Label>
              <Select
                value={form.companyId}
                onValueChange={(v) => setForm((f) => ({ ...f, companyId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select company…" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {companies.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                placeholder="e.g. Hosting & maintenance retainer"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select
                  value={form.currency}
                  onValueChange={(v) => setForm((f) => ({ ...f, currency: v }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["USD", "GBP", "EUR", "AED"].map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select
                  value={form.frequency}
                  onValueChange={(v) => setForm((f) => ({ ...f, frequency: v }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {FREQUENCIES.map((fr) => (
                      <SelectItem key={fr.value} value={fr.value}>{fr.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Issue day</Label>
                <Input
                  type="number"
                  min="1"
                  max="28"
                  value={form.dayOfMonth}
                  onChange={(e) => setForm((f) => ({ ...f, dayOfMonth: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Start date</Label>
                <DatePicker
                  value={isoToDate(form.startDate)}
                  onChange={(d) => setForm((f) => ({ ...f, startDate: dateToIso(d) }))}
                />
              </div>
              <div className="space-y-2">
                <Label>End date <span className="text-muted-foreground">· optional</span></Label>
                <DatePicker
                  value={isoToDate(form.endDate)}
                  onChange={(d) => setForm((f) => ({ ...f, endDate: dateToIso(d) }))}
                />
              </div>
            </div>

            {/* Line items */}
            <div className="space-y-2">
              <Label>Line items</Label>
              <div className="space-y-2">
                {form.lines.map((line, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      placeholder="Description (e.g. Hosting)"
                      value={line.description}
                      onChange={(e) =>
                        setForm((f) => {
                          const lines = [...f.lines];
                          lines[i] = { ...lines[i], description: e.target.value };
                          return { ...f, lines };
                        })
                      }
                    />
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="w-28 font-mono"
                      value={line.amount}
                      onChange={(e) =>
                        setForm((f) => {
                          const lines = [...f.lines];
                          lines[i] = { ...lines[i], amount: e.target.value };
                          return { ...f, lines };
                        })
                      }
                    />
                    {form.lines.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 shrink-0 text-muted-foreground"
                        onClick={() =>
                          setForm((f) => ({
                            ...f,
                            lines: f.lines.filter((_, idx) => idx !== i),
                          }))
                        }
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() =>
                  setForm((f) => ({ ...f, lines: [...f.lines, { description: "", amount: "" }] }))
                }
              >
                <Plus className="size-3.5" /> Add line
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Tax rate (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={form.taxRate}
                  onChange={(e) => setForm((f) => ({ ...f, taxRate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Due in (days)</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.dueInDays}
                  onChange={(e) => setForm((f) => ({ ...f, dueInDays: e.target.value }))}
                />
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2.5 text-sm">
              <input
                type="checkbox"
                className="size-4 accent-[var(--pulse)]"
                checked={form.autoSend}
                onChange={(e) => setForm((f) => ({ ...f, autoSend: e.target.checked }))}
              />
              Auto-send the invoice to the client when generated
            </label>

            {lineTotal > 0 && (
              <div className="rounded-md border border-pulse/20 bg-pulse/5 p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Per-period total</span>
                  <span className="font-mono font-semibold">
                    {formatCurrency(lineTotal, form.currency)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={submitting}>
              {submitting ? (
                <><Loader2 className="mr-2 size-4 animate-spin" />Saving…</>
              ) : editingId ? "Save changes" : "Create retainer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
