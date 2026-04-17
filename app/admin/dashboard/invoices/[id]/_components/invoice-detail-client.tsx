"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import {
  ArrowLeft,
  Check,
  Download,
  Eye,
  FileText,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { use } from "react";
import { toast } from "sonner";

import type { Invoice, InvoiceLineItem } from "@/lib/api/invoices";
import {
  addInvoiceLineItem,
  deleteInvoice,
  deleteInvoiceLineItem,
  fetchInvoice,
  sendInvoiceToCompany,
  updateInvoice,
  updateInvoiceLineItem,
} from "@/lib/api/invoices";
import {
  invoiceStatusBadgeClass,
  invoiceStatusLabel,
  formatDate,
  formatCurrency,
  type InvoiceStatus,
} from "../../../_components/dashboard-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const allInvoiceStatuses: InvoiceStatus[] = [
  "draft",
  "sent",
  "paid",
  "overdue",
  "cancelled",
];

const isoToDate = (s: string | null | undefined): Date | undefined => {
  if (!s) return undefined;
  const d = new Date(s);
  if (Number.isNaN(d.getTime()) || d.getFullYear() < 2000) return undefined;
  return d;
};

const dateToIso = (d: Date | undefined): string | null =>
  d ? d.toISOString().split("T")[0]! : null;

interface DraftLineItem {
  id?: string;
  description: string;
  developerName: string;
  developerRole: string;
  hourlyRate: string;
  hoursWorked: string;
  amount: string;
  isCustom: boolean;
}

const lineItemToDraft = (li: InvoiceLineItem): DraftLineItem => ({
  id: li.id,
  description: li.description ?? "",
  developerName: li.developerName ?? "",
  developerRole: li.developerRole ?? "",
  hourlyRate: String(li.hourlyRate),
  hoursWorked: String(li.hoursWorked),
  amount: String(li.amount),
  isCustom: !li.developerName,
});

const computeAmount = (rate: string, hours: string): string => {
  const r = Number(rate || 0);
  const h = Number(hours || 0);
  return (r * h).toFixed(2);
};

const InvoiceDetailClient = ({
  params,
  isSuperAdmin,
}: {
  params: Promise<{ id: string }>;
  isSuperAdmin?: boolean;
}) => {
  const { id } = use(params);
  const router = useRouter();
  const { getToken } = useAuth();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [pdfRefreshKey, setPdfRefreshKey] = useState(0);

  // Edit state
  const [editing, setEditing] = useState(false);
  const [savingHeader, setSavingHeader] = useState(false);
  const [editForm, setEditForm] = useState({
    dueDate: undefined as Date | undefined,
    taxRate: "0",
    currency: "USD",
    status: "draft" as InvoiceStatus,
    notes: "",
  });
  const [draftLines, setDraftLines] = useState<DraftLineItem[]>([]);

  // Send dialog
  const [sendOpen, setSendOpen] = useState(false);
  const [sending, setSending] = useState(false);

  // Delete state
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    const t = await getToken();
    setToken(t ?? "");
    const data = await fetchInvoice(t, id);
    setInvoice(data);
    if (data) {
      setEditForm({
        dueDate: isoToDate(data.dueDate),
        taxRate: String(data.taxRate),
        currency: data.currency,
        status: data.status,
        notes: data.notes ?? "",
      });
      setDraftLines(data.lineItems.map(lineItemToDraft));
    }
    setLoading(false);
  }, [getToken, id]);

  useEffect(() => {
    load();
  }, [load]);

  const refreshAll = useCallback(async () => {
    await load();
    setPdfRefreshKey((k) => k + 1);
  }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          Invoice not found.
        </CardContent>
      </Card>
    );
  }

  const fmtMoney = (amount: number) =>
    formatCurrency(amount, editing ? editForm.currency : invoice.currency);

  const computedSubtotal = draftLines.reduce(
    (s, l) => s + Number(l.amount || 0),
    0,
  );
  const computedTax = (computedSubtotal * Number(editForm.taxRate || 0)) / 100;
  const computedTotal = computedSubtotal + computedTax;

  const updateDraftLine = (
    idx: number,
    patch: Partial<DraftLineItem>,
  ): void => {
    setDraftLines((prev) => {
      const next = [...prev];
      const merged = { ...next[idx]!, ...patch };
      // Auto-compute amount when rate or hours changes
      if (patch.hourlyRate !== undefined || patch.hoursWorked !== undefined) {
        merged.amount = computeAmount(merged.hourlyRate, merged.hoursWorked);
      }
      next[idx] = merged;
      return next;
    });
  };

  const addCustomLine = () => {
    setDraftLines((prev) => [
      ...prev,
      {
        description: "",
        developerName: "",
        developerRole: "",
        hourlyRate: "0",
        hoursWorked: "1",
        amount: "0",
        isCustom: true,
      },
    ]);
  };

  const removeDraftLine = (idx: number) => {
    setDraftLines((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    setSavingHeader(true);
    try {
      // 1. Patch invoice header
      const headerResult = await updateInvoice(token, invoice.id, {
        dueDate: dateToIso(editForm.dueDate),
        taxRate: Number(editForm.taxRate),
        currency: editForm.currency,
        notes: editForm.notes || null,
        status: editForm.status,
      });
      if (!headerResult.success) {
        toast.error(headerResult.error ?? "Failed to save invoice");
        setSavingHeader(false);
        return;
      }

      // 2. Diff line items: existing → patch; new → add; missing → delete
      const originalIds = new Set(invoice.lineItems.map((li) => li.id));
      const draftIds = new Set(
        draftLines.filter((l) => l.id).map((l) => l.id!),
      );

      // Deletions
      const toDelete = invoice.lineItems.filter((li) => !draftIds.has(li.id));
      for (const li of toDelete) {
        await deleteInvoiceLineItem(token, invoice.id, li.id);
      }

      // Updates + additions
      for (const draft of draftLines) {
        if (draft.id && originalIds.has(draft.id)) {
          // Update existing if changed
          const original = invoice.lineItems.find((li) => li.id === draft.id)!;
          const changed =
            (original.description ?? "") !== draft.description ||
            (original.developerName ?? "") !== draft.developerName ||
            (original.developerRole ?? "") !== draft.developerRole ||
            String(original.hourlyRate) !== draft.hourlyRate ||
            String(original.hoursWorked) !== draft.hoursWorked;
          if (changed) {
            await updateInvoiceLineItem(token, invoice.id, draft.id, {
              description: draft.description || null,
              developerName: draft.developerName || null,
              developerRole: draft.developerRole || null,
              hourlyRate: Number(draft.hourlyRate),
              hoursWorked: Number(draft.hoursWorked),
            });
          }
        } else {
          // New line item
          await addInvoiceLineItem(token, invoice.id, {
            description: draft.description || undefined,
            developerName: draft.developerName || undefined,
            developerRole: draft.developerRole || undefined,
            hourlyRate: Number(draft.hourlyRate),
            hoursWorked: Number(draft.hoursWorked),
          });
        }
      }

      toast.success("Invoice saved");
      setEditing(false);
      await refreshAll();
    } catch {
      toast.error("Failed to save invoice");
    } finally {
      setSavingHeader(false);
    }
  };

  const handleSend = async () => {
    setSending(true);
    const result = await sendInvoiceToCompany(token, invoice.id);
    if (result.success) {
      toast.success(`Invoice sent to ${invoice.companyName}`);
      setSendOpen(false);
      await refreshAll();
    } else {
      toast.error(result.error ?? "Failed to send invoice");
    }
    setSending(false);
  };

  const handleDelete = async () => {
    if (
      !confirm(`Delete invoice ${invoice.invoiceNumber}? This cannot be undone.`)
    )
      return;
    setDeleting(true);
    const ok = await deleteInvoice(token, invoice.id);
    if (ok) {
      toast.success("Invoice deleted");
      router.push("/admin/dashboard/invoices");
    } else {
      toast.error("Failed to delete invoice");
      setDeleting(false);
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditForm({
      dueDate: isoToDate(invoice.dueDate),
      taxRate: String(invoice.taxRate),
      currency: invoice.currency,
      status: invoice.status,
      notes: invoice.notes ?? "",
    });
    setDraftLines(invoice.lineItems.map(lineItemToDraft));
  };

  const pdfUrl = `/api/invoices/${invoice.id}/pdf?t=${pdfRefreshKey}`;
  const pdfDownloadUrl = `/api/invoices/${invoice.id}/pdf?download=1`;

  return (
    <>
      {/* Top bar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/admin/dashboard/invoices"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Invoices
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {!editing ? (
            <>
              <Button variant="outline" onClick={() => setEditing(true)}>
                <Pencil className="mr-1.5 size-4" />
                Edit
              </Button>
              <Button onClick={() => setSendOpen(true)}>
                <Send className="mr-1.5 size-4" />
                Send to Company
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={cancelEdit}
                disabled={savingHeader}
              >
                <X className="mr-1.5 size-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={savingHeader}>
                {savingHeader ? (
                  <>
                    <Loader2 className="mr-1.5 size-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Check className="mr-1.5 size-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Compact header */}
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">{invoice.invoiceNumber}</h1>
                <Badge
                  variant="outline"
                  className={invoiceStatusBadgeClass(invoice.status)}
                >
                  {invoiceStatusLabel[invoice.status]}
                </Badge>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {invoice.companyName} · {invoice.companyEmail || "no email"}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Issued {formatDate(invoice.issuedAt)} · Period{" "}
                {formatDate(invoice.periodStart)} →{" "}
                {formatDate(invoice.periodEnd)}
              </p>
            </div>

            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Total
              </p>
              <p className="font-mono text-2xl font-semibold">
                {formatCurrency(
                  editing ? computedTotal : invoice.total,
                  editing ? editForm.currency : invoice.currency,
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                Due{" "}
                {editing
                  ? formatDate(dateToIso(editForm.dueDate))
                  : formatDate(invoice.dueDate)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two-column: editor on left, PDF preview on right */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        {/* LEFT — Editor */}
        <div className="space-y-4 xl:col-span-3">
          {/* Header fields (edit mode shows controls; otherwise summary) */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {editing ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Status</Label>
                      <Select
                        value={editForm.status}
                        onValueChange={(v) =>
                          setEditForm((f) => ({
                            ...f,
                            status: v as InvoiceStatus,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {allInvoiceStatuses.map((s) => (
                            <SelectItem key={s} value={s}>
                              {invoiceStatusLabel[s]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Currency</Label>
                      <Select
                        value={editForm.currency}
                        onValueChange={(v) =>
                          setEditForm((f) => ({ ...f, currency: v }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="AED">AED</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Due Date</Label>
                      <DatePicker
                        value={editForm.dueDate}
                        onChange={(d) =>
                          setEditForm((f) => ({ ...f, dueDate: d ?? undefined }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Tax Rate (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={editForm.taxRate}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            taxRate: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Notes</Label>
                    <Textarea
                      rows={2}
                      placeholder="Notes shown on the invoice…"
                      value={editForm.notes}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, notes: e.target.value }))
                      }
                    />
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Status
                    </p>
                    <p className="font-medium">
                      {invoiceStatusLabel[invoice.status]}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Currency
                    </p>
                    <p className="font-medium font-mono">{invoice.currency}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Due Date
                    </p>
                    <p className="font-medium">{formatDate(invoice.dueDate)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Tax Rate
                    </p>
                    <p className="font-medium">{invoice.taxRate}%</p>
                  </div>
                  {invoice.notes && (
                    <div className="col-span-2">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Notes
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {invoice.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Line items */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Line Items</CardTitle>
                {editing && (
                  <Button size="sm" variant="outline" onClick={addCustomLine}>
                    <Plus className="mr-1 size-3.5" />
                    Add Line
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {draftLines.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No line items.{" "}
                  {editing && "Click Add Line to create one."}
                </p>
              )}
              {draftLines.map((line, idx) => (
                <div
                  key={line.id ?? `new-${idx}`}
                  className="rounded-md border border-border/60 p-3"
                >
                  {editing ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Description / Title
                          </Label>
                          <Input
                            placeholder={
                              line.developerName
                                ? "Optional extra description"
                                : "e.g. Setup fee"
                            }
                            value={line.description}
                            onChange={(e) =>
                              updateDraftLine(idx, {
                                description: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Developer (optional)
                          </Label>
                          <Input
                            placeholder="Developer name"
                            value={line.developerName}
                            onChange={(e) =>
                              updateDraftLine(idx, {
                                developerName: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Role
                          </Label>
                          <Input
                            placeholder="e.g. Engineer"
                            value={line.developerRole}
                            onChange={(e) =>
                              updateDraftLine(idx, {
                                developerRole: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Rate
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={line.hourlyRate}
                            onChange={(e) =>
                              updateDraftLine(idx, {
                                hourlyRate: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Hours / Qty
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.5"
                            value={line.hoursWorked}
                            onChange={(e) =>
                              updateDraftLine(idx, {
                                hoursWorked: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Amount
                          </Label>
                          <div className="flex h-9 items-center justify-end rounded-md border bg-muted/30 px-3 font-mono text-sm">
                            {formatCurrency(
                              Number(line.amount || 0),
                              editForm.currency,
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:bg-red-500/10 hover:text-red-700"
                          onClick={() => removeDraftLine(idx)}
                        >
                          <Trash2 className="mr-1 size-3.5" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">
                          {line.developerName || line.description || "Line item"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {[
                            line.developerRole,
                            line.developerName ? line.description : null,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-sm font-semibold">
                          {formatCurrency(
                            Number(line.amount || 0),
                            invoice.currency,
                          )}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {line.hoursWorked} ×{" "}
                          {formatCurrency(
                            Number(line.hourlyRate || 0),
                            invoice.currency,
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <Separator className="my-2" />

              {/* Totals */}
              <div className="space-y-1 pr-1 text-right">
                <div className="flex justify-end gap-6 text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="w-32 font-mono">
                    {fmtMoney(
                      editing ? computedSubtotal : invoice.subtotal,
                    )}
                  </span>
                </div>
                <div className="flex justify-end gap-6 text-sm">
                  <span className="text-muted-foreground">
                    Tax ({editing ? editForm.taxRate : invoice.taxRate}%)
                  </span>
                  <span className="w-32 font-mono">
                    {fmtMoney(editing ? computedTax : invoice.taxAmount)}
                  </span>
                </div>
                <div className="flex justify-end gap-6 border-t pt-1 text-sm font-semibold">
                  <span>Total</span>
                  <span className="w-32 font-mono">
                    {fmtMoney(editing ? computedTotal : invoice.total)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger zone */}
          {isSuperAdmin && !editing && (
            <Card>
              <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium">Danger zone</p>
                  <p className="text-xs text-muted-foreground">
                    Permanent — line items will be cascaded.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                  <span className="ml-1.5">Delete Invoice</span>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* RIGHT — PDF preview */}
        <div className="xl:col-span-2">
          <Card className="sticky top-4">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="size-4" />
                  PDF Preview
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setPdfRefreshKey((k) => k + 1)}
                    title="Refresh preview"
                  >
                    <RefreshCw className="size-3.5" />
                  </Button>
                  <Button size="sm" variant="ghost" asChild>
                    <a
                      href={pdfDownloadUrl}
                      download={`${invoice.invoiceNumber}.pdf`}
                      title="Download PDF"
                    >
                      <Download className="size-3.5" />
                    </a>
                  </Button>
                  <Button size="sm" variant="ghost" asChild>
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open in new tab"
                    >
                      <Eye className="size-3.5" />
                    </a>
                  </Button>
                </div>
              </div>
              {editing && (
                <p className="text-[10px] text-amber-600">
                  Preview shows the saved version — save your edits then refresh.
                </p>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <iframe
                key={pdfRefreshKey}
                src={pdfUrl}
                title="Invoice PDF preview"
                className="h-[800px] w-full rounded-b-lg border-0 bg-zinc-100 dark:bg-zinc-900"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Send confirmation dialog */}
      <Dialog
        open={sendOpen}
        onOpenChange={(open) => {
          if (!open && !sending) setSendOpen(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send invoice to {invoice.companyName}?</DialogTitle>
            <DialogDescription>
              An email will be sent to{" "}
              <strong>{invoice.companyEmail || "the company contact"}</strong>{" "}
              with the invoice PDF attached and a link to view in their
              dashboard. The invoice status will move to{" "}
              <strong>Sent</strong> if currently Draft.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 rounded-md border bg-muted/30 p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Invoice</span>
              <span className="font-mono">{invoice.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total</span>
              <span className="font-mono font-semibold">
                {formatCurrency(invoice.total, invoice.currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Due</span>
              <span>{formatDate(invoice.dueDate)}</span>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSendOpen(false)}
              disabled={sending}
            >
              Cancel
            </Button>
            <Button onClick={handleSend} disabled={sending}>
              {sending ? (
                <>
                  <Loader2 className="mr-1.5 size-4 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="mr-1.5 size-4" />
                  Send Invoice
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export { InvoiceDetailClient };
