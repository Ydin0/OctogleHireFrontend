"use client";

import { useMemo, useState, useTransition } from "react";
import type { RowSelectionState } from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "sonner";
import { ChevronDown, FileText, Loader2, Plus, Repeat, Trash2 } from "lucide-react";
import type {
  Invoice,
  InvoiceFilters,
  InvoiceSummary,
  InvoiceLineItemInput,
} from "@/lib/api/invoices";
import {
  updateInvoiceStatus,
  deleteInvoice,
  adminCreateInvoice,
  adminCreateCustomInvoice,
  bulkMarkInvoicesPaid,
  bulkSendInvoices,
  bulkDeleteInvoices,
  bulkEmailInvoices,
} from "@/lib/api/invoices";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { RecurringClient } from "./recurring-client";
import type { AdminEngagement, Pagination } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
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
import { MonthPicker } from "@/components/ui/month-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DataTable } from "../../_components/data-table";
import { formatCurrency } from "../../_components/dashboard-data";
import { getColumns } from "./columns";
import { InvoiceFiltersBar } from "./filters-bar";
import { InvoiceSummarySection } from "./summary-section";
import { InvoiceBulkActionBar } from "./bulk-action-bar";
import { useAdminCurrency } from "../../_components/admin-currency-context";

export interface CompanyOption {
  id: string;
  name: string;
  logoUrl: string | null;
}

interface InvoicesClientProps {
  invoices: Invoice[];
  pagination: Pagination;
  summary: InvoiceSummary;
  engagements: AdminEngagement[];
  companies: CompanyOption[];
  filters: InvoiceFilters;
  token: string;
  isSuperAdmin?: boolean;
}

const currentPeriod = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

function InvoicesClient({
  invoices,
  pagination,
  summary,
  engagements,
  companies,
  filters,
  token,
  isSuperAdmin,
}: InvoicesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Server drives all filtering / sorting / pagination — we just nudge
  // the URL and let the page server-component refetch.
  const setParam = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Any filter change resets pagination to page 1.
    if (key !== "page") params.delete("page");
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const handleSortChange = (column: string) => {
    const currentSortBy = filters.sortBy ?? "issuedAt";
    const currentSortOrder = filters.sortOrder ?? "desc";
    const params = new URLSearchParams(searchParams.toString());
    if (currentSortBy === column) {
      // toggle direction; remove on second toggle
      if (currentSortOrder === "desc") {
        params.set("sortBy", column);
        params.set("sortOrder", "asc");
      } else {
        params.delete("sortBy");
        params.delete("sortOrder");
      }
    } else {
      params.set("sortBy", column);
      params.set("sortOrder", "desc");
    }
    params.delete("page");
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  // Row selection state for bulk actions.
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const selectedInvoices = useMemo(
    () => invoices.filter((_, idx) => rowSelection[idx]),
    [invoices, rowSelection],
  );
  const selectedIds = useMemo(
    () => selectedInvoices.map((i) => i.id),
    [selectedInvoices],
  );

  const clearSelection = () => setRowSelection({});

  const refreshAndClear = () => {
    clearSelection();
    startTransition(() => {
      router.refresh();
    });
  };

  // Single-row actions
  const handleMarkPaid = async (invoice: Invoice) => {
    try {
      await updateInvoiceStatus(token, invoice.id, "paid");
      toast.success("Invoice marked as paid");
      refreshAndClear();
    } catch {
      toast.error("Failed to update invoice status");
    }
  };

  // Bulk actions
  const handleBulkMarkPaid = async () => {
    const result = await bulkMarkInvoicesPaid(token, selectedIds);
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    toast.success(
      `Marked ${result.updated} paid${result.skipped > 0 ? ` (skipped ${result.skipped} already paid)` : ""}`,
    );
    refreshAndClear();
  };

  const handleBulkSend = async () => {
    const result = await bulkSendInvoices(token, selectedIds);
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    const errSuffix =
      result.errors.length > 0 ? `, ${result.errors.length} failed` : "";
    toast.success(
      `Sent ${result.sent}${result.skipped > 0 ? `, skipped ${result.skipped} non-drafts` : ""}${errSuffix}`,
    );
    refreshAndClear();
  };

  const handleBulkEmail = async (recipientEmail: string, note: string) => {
    const result = await bulkEmailInvoices(
      token,
      selectedIds,
      recipientEmail,
      note || undefined,
    );
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    const failed = result.errors?.length ?? 0;
    const errSuffix = failed > 0 ? ` (${failed} failed to render)` : "";
    toast.success(
      `Emailed ${result.emailed} invoice PDF${result.emailed !== 1 ? "s" : ""} to ${result.recipientEmail}${errSuffix}`,
    );
    refreshAndClear();
  };

  const handleBulkDelete = async () => {
    const result = await bulkDeleteInvoices(token, selectedIds);
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    toast.success(`Deleted ${result.deleted} invoices`);
    refreshAndClear();
  };

  // Delete state (single-row)
  const [deleteTarget, setDeleteTarget] = useState<Invoice | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Create-invoice state (super admin)
  const activeEngagements = useMemo(
    () =>
      engagements.filter(
        (e) => e.status === "active" || e.status === "pending",
      ),
    [engagements],
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createForm, setCreateForm] = useState({
    engagementId: "",
    period: currentPeriod(),
    hours: "",
    hourlyRate: "",
    currency: "USD",
    taxRate: "0",
    dueInDays: "14",
    notes: "",
  });

  const selectedEngagement = activeEngagements.find(
    (e) => e.id === createForm.engagementId,
  );

  const onPickEngagement = (id: string) => {
    const eng = activeEngagements.find((e) => e.id === id);
    setCreateForm((f) => ({
      ...f,
      engagementId: id,
      hourlyRate: eng ? String(eng.companyBillingRate) : "",
      hours: eng?.monthlyHoursExpected
        ? String(eng.monthlyHoursExpected)
        : f.hours,
      currency: eng?.currency ?? f.currency,
    }));
  };

  const subtotal =
    Number(createForm.hours || 0) * Number(createForm.hourlyRate || 0);
  const taxAmount = (subtotal * Number(createForm.taxRate || 0)) / 100;
  const totalAmount = subtotal + taxAmount;

  const handleCreate = async () => {
    if (
      !createForm.engagementId ||
      !createForm.period ||
      !createForm.hours ||
      !createForm.hourlyRate
    ) {
      toast.error("Engagement, period, hours, and rate are required");
      return;
    }
    setCreateSubmitting(true);
    const result = await adminCreateInvoice(token, {
      engagementId: createForm.engagementId,
      period: createForm.period,
      hours: Number(createForm.hours),
      hourlyRate: Number(createForm.hourlyRate),
      currency: createForm.currency,
      taxRate: Number(createForm.taxRate || 0),
      dueInDays: Number(createForm.dueInDays || 14),
      notes: createForm.notes || undefined,
    });
    if (result.success) {
      toast.success("Draft invoice saved");
      setCreateOpen(false);
      setCreateForm({
        engagementId: "",
        period: currentPeriod(),
        hours: "",
        hourlyRate: "",
        currency: "USD",
        taxRate: "0",
        dueInDays: "14",
        notes: "",
      });
      refreshAndClear();
    } else {
      toast.error(result.error);
    }
    setCreateSubmitting(false);
  };

  // Invoices ↔ Recurring tab.
  const [view, setView] = useState<"invoices" | "recurring">("invoices");

  // Custom (free-form) invoice state.
  const [customOpen, setCustomOpen] = useState(false);
  const [customSubmitting, setCustomSubmitting] = useState(false);
  const [customForm, setCustomForm] = useState({
    companyId: "",
    currency: "USD",
    taxRate: "0",
    dueInDays: "14",
    notes: "",
    lines: [{ description: "", amount: "" }] as { description: string; amount: string }[],
  });
  const customSubtotal = customForm.lines.reduce(
    (s, l) => s + (Number(l.amount) || 0),
    0,
  );

  const handleCreateCustom = async () => {
    if (!customForm.companyId) {
      toast.error("Select a company");
      return;
    }
    const lineItems: InvoiceLineItemInput[] = customForm.lines
      .filter((l) => l.description.trim() || Number(l.amount) > 0)
      .map((l) => ({ description: l.description.trim(), amount: Number(l.amount) || 0 }));
    if (lineItems.length === 0) {
      toast.error("Add at least one line item");
      return;
    }
    setCustomSubmitting(true);
    const result = await adminCreateCustomInvoice(token, {
      companyId: customForm.companyId,
      currency: customForm.currency,
      taxRate: Number(customForm.taxRate || 0),
      dueInDays: Number(customForm.dueInDays || 14),
      notes: customForm.notes || undefined,
      lineItems,
    });
    setCustomSubmitting(false);
    if (result.success) {
      toast.success("Custom invoice saved as draft");
      setCustomOpen(false);
      setCustomForm({
        companyId: "",
        currency: "USD",
        taxRate: "0",
        dueInDays: "14",
        notes: "",
        lines: [{ description: "", amount: "" }],
      });
      refreshAndClear();
    } else {
      toast.error(result.error);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const ok = await deleteInvoice(token, deleteTarget.id);
    if (ok) {
      toast.success("Invoice deleted");
      setDeleteTarget(null);
      refreshAndClear();
    } else {
      toast.error("Failed to delete invoice");
    }
    setDeleting(false);
  };

  const { formatDisplay, displayCurrency, setDisplayCurrency } =
    useAdminCurrency();

  // "Native" shows each invoice in the currency it was raised in; otherwise the
  // chosen display currency (which also drives the global converted KPIs/chart).
  const [nativeView, setNativeView] = useState(true);
  const amountFormatter = nativeView
    ? (amount: number, currency: string) => formatCurrency(amount, currency)
    : formatDisplay;

  const columns = getColumns({
    onMarkPaid: handleMarkPaid,
    onDelete: isSuperAdmin ? (inv) => setDeleteTarget(inv) : undefined,
    formatDisplay: amountFormatter,
  });

  // Derive unique developer list from engagements + the visible page so the
  // filter dropdown shows real options.
  const developerOptions = useMemo(() => {
    const map = new Map<string, string>();
    for (const e of engagements) {
      if (e.developerId) map.set(e.developerId, e.developerName);
    }
    for (const i of invoices) {
      if (i.developerId && i.developerName)
        map.set(i.developerId, i.developerName);
    }
    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [engagements, invoices]);

  // Derive currency options from the visible invoices + any common ones.
  const currencyOptions = useMemo(() => {
    const seen = new Set<string>(["USD", "GBP", "EUR", "AED"]);
    for (const i of invoices) seen.add(i.currency);
    return Array.from(seen).sort();
  }, [invoices]);

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold">Invoices</h1>
          <p className="text-sm text-muted-foreground">
            Track billing, payments, and outstanding invoices for all
            companies.
          </p>
        </div>
        {isSuperAdmin && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-1.5">
                <Plus className="size-4" />
                Create
                <ChevronDown className="size-3.5 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setCreateOpen(true)}>
                <FileText className="mr-2 size-3.5" />
                Engagement invoice
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCustomOpen(true)}>
                <FileText className="mr-2 size-3.5" />
                Custom invoice
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setView("recurring")}>
                <Repeat className="mr-2 size-3.5" />
                Recurring retainer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-border">
        {[
          { value: "invoices" as const, label: "Invoices" },
          { value: "recurring" as const, label: "Recurring" },
        ].map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setView(tab.value)}
            className={cn(
              "relative px-4 py-2.5 text-sm font-medium transition-colors",
              view === tab.value
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
            <span
              className={cn(
                "absolute bottom-0 left-0 h-0.5 w-full bg-foreground transition-all duration-300",
                view === tab.value ? "opacity-100" : "opacity-0",
              )}
            />
          </button>
        ))}
      </div>

      {view === "recurring" ? (
        <RecurringClient token={token} companies={companies} />
      ) : (
        <>
          <InvoiceSummarySection
            summary={summary}
            activeMonth={
              filters.periodFrom && filters.periodFrom === filters.periodTo
                ? filters.periodFrom
                : null
            }
            onSelectMonth={(month) => {
              const alreadyFiltered =
                filters.periodFrom === month && filters.periodTo === month;
              const params = new URLSearchParams(searchParams.toString());
              if (alreadyFiltered) {
                params.delete("periodFrom");
                params.delete("periodTo");
              } else {
                params.set("periodFrom", month);
                params.set("periodTo", month);
              }
              params.delete("page");
              startTransition(() => {
                router.push(`?${params.toString()}`);
              });
            }}
          />

          {/* Amount display switcher — Native shows each invoice's own
              currency; the others convert (and drive the KPI/chart currency). */}
          <div className="flex items-center gap-1.5">
            <span className="mr-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Amounts in
            </span>
            {(["native", "USD", "GBP", "EUR", "AED"] as const).map((opt) => {
              const active = opt === "native" ? nativeView : !nativeView && displayCurrency === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    if (opt === "native") setNativeView(true);
                    else {
                      setNativeView(false);
                      setDisplayCurrency(opt);
                    }
                  }}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs font-mono transition-colors",
                    active
                      ? "border-pulse/40 bg-pulse/10 text-pulse"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {opt === "native" ? "Native" : opt}
                </button>
              );
            })}
          </div>

          <InvoiceFiltersBar
            filters={filters}
            companies={companies}
            developers={developerOptions}
            currencies={currencyOptions}
          />

          <DataTable
            columns={columns}
            data={invoices}
            pagination={pagination}
            onPageChange={(page) => setParam("page", String(page))}
            onLimitChange={(limit) => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("limit", String(limit));
              params.delete("page");
              startTransition(() => {
                router.push(`?${params.toString()}`);
              });
            }}
            onSortChange={handleSortChange}
            currentSort={
              filters.sortBy
                ? {
                    column: filters.sortBy,
                    order: (filters.sortOrder ?? "desc") as "asc" | "desc",
                  }
                : undefined
            }
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            onRowClick={(invoice) =>
              router.push(`/admin/dashboard/invoices/${invoice.id}`)
            }
          />

          <InvoiceBulkActionBar
            selectedInvoices={selectedInvoices}
            isSuperAdmin={!!isSuperAdmin}
            onMarkPaid={handleBulkMarkPaid}
            onSend={handleBulkSend}
            onEmail={handleBulkEmail}
            onDelete={handleBulkDelete}
            onClear={clearSelection}
          />
        </>
      )}

      {/* Create Invoice Dialog */}
      <Dialog
        open={createOpen}
        onOpenChange={(open) => {
          if (!open && !createSubmitting) setCreateOpen(false);
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
            <DialogDescription>
              Issue an invoice for a developer engagement on a custom
              arrangement. The invoice is saved as a <strong>draft</strong> so
              you can review it; send it from the invoice detail page when
              ready.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Engagement</Label>
              <Select
                value={createForm.engagementId}
                onValueChange={onPickEngagement}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select developer + company…" />
                </SelectTrigger>
                <SelectContent>
                  {activeEngagements.length === 0 && (
                    <div className="px-3 py-2 text-xs text-muted-foreground">
                      No active engagements.
                    </div>
                  )}
                  {activeEngagements.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.developerName} · {e.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedEngagement && (
                <p className="text-[10px] text-muted-foreground">
                  Default rate{" "}
                  <span className="font-mono">
                    {formatCurrency(
                      selectedEngagement.companyBillingRate,
                      selectedEngagement.currency,
                    )}
                    /hr
                  </span>{" "}
                  · {selectedEngagement.engagementType.replace(/-/g, " ")}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Period</Label>
                <MonthPicker
                  value={createForm.period}
                  onChange={(v) =>
                    setCreateForm((f) => ({ ...f, period: v }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Hours</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="e.g. 80"
                  value={createForm.hours}
                  onChange={(e) =>
                    setCreateForm((f) => ({ ...f, hours: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Hourly Rate</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 18.27"
                  value={createForm.hourlyRate}
                  onChange={(e) =>
                    setCreateForm((f) => ({
                      ...f,
                      hourlyRate: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select
                  value={createForm.currency}
                  onValueChange={(v) =>
                    setCreateForm((f) => ({ ...f, currency: v }))
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
              <div className="space-y-2">
                <Label>Tax Rate (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={createForm.taxRate}
                  onChange={(e) =>
                    setCreateForm((f) => ({ ...f, taxRate: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Due In (days)</Label>
                <Input
                  type="number"
                  min="0"
                  value={createForm.dueInDays}
                  onChange={(e) =>
                    setCreateForm((f) => ({
                      ...f,
                      dueInDays: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea
                rows={2}
                placeholder="Internal note attached to the invoice…"
                value={createForm.notes}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, notes: e.target.value }))
                }
              />
            </div>

            {subtotal > 0 && (
              <div className="rounded-md border border-pulse/20 bg-pulse/5 p-3 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono">
                    {formatCurrency(subtotal, createForm.currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Tax ({createForm.taxRate || 0}%)
                  </span>
                  <span className="font-mono">
                    {formatCurrency(taxAmount, createForm.currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-border/60 pt-1">
                  <span className="text-xs font-medium">Total</span>
                  <span className="font-mono text-base font-semibold">
                    {formatCurrency(totalAmount, createForm.currency)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateOpen(false)}
              disabled={createSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={createSubmitting}>
              {createSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save as Draft"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Custom Invoice Dialog */}
      <Dialog
        open={customOpen}
        onOpenChange={(open) => {
          if (!open && !customSubmitting) setCustomOpen(false);
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Custom invoice</DialogTitle>
            <DialogDescription>
              Raise a free-form invoice for a company — retainers, hosting,
              one-off services. No engagement required. Saved as a{" "}
              <strong>draft</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[65vh] space-y-4 overflow-y-auto pr-1">
            <div className="space-y-2">
              <Label>Company</Label>
              <Select
                value={customForm.companyId}
                onValueChange={(v) =>
                  setCustomForm((f) => ({ ...f, companyId: v }))
                }
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
              <Label>Line items</Label>
              <div className="space-y-2">
                {customForm.lines.map((line, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      placeholder="Description (e.g. Hosting & maintenance — June)"
                      value={line.description}
                      onChange={(e) =>
                        setCustomForm((f) => {
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
                        setCustomForm((f) => {
                          const lines = [...f.lines];
                          lines[i] = { ...lines[i], amount: e.target.value };
                          return { ...f, lines };
                        })
                      }
                    />
                    {customForm.lines.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 shrink-0 text-muted-foreground"
                        onClick={() =>
                          setCustomForm((f) => ({
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
                  setCustomForm((f) => ({
                    ...f,
                    lines: [...f.lines, { description: "", amount: "" }],
                  }))
                }
              >
                <Plus className="size-3.5" /> Add line
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select
                  value={customForm.currency}
                  onValueChange={(v) =>
                    setCustomForm((f) => ({ ...f, currency: v }))
                  }
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
                <Label>Tax (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={customForm.taxRate}
                  onChange={(e) =>
                    setCustomForm((f) => ({ ...f, taxRate: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Due (days)</Label>
                <Input
                  type="number"
                  min="0"
                  value={customForm.dueInDays}
                  onChange={(e) =>
                    setCustomForm((f) => ({ ...f, dueInDays: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea
                rows={2}
                value={customForm.notes}
                onChange={(e) =>
                  setCustomForm((f) => ({ ...f, notes: e.target.value }))
                }
              />
            </div>

            {customSubtotal > 0 && (
              <div className="rounded-md border border-pulse/20 bg-pulse/5 p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono font-semibold">
                    {formatCurrency(customSubtotal, customForm.currency)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCustomOpen(false)}
              disabled={customSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateCustom} disabled={customSubmitting}>
              {customSubmitting ? (
                <><Loader2 className="mr-2 size-4 animate-spin" />Saving…</>
              ) : (
                "Save as Draft"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Invoice</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete invoice{" "}
              <strong>{deleteTarget?.invoiceNumber}</strong> for{" "}
              <strong>{deleteTarget?.companyName}</strong>? This will also
              remove all associated line items. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export { InvoicesClient };
