"use client";

import { useMemo, useState, useTransition } from "react";
import type { RowSelectionState } from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import type {
  Invoice,
  InvoiceFilters,
  InvoiceSummary,
} from "@/lib/api/invoices";
import {
  updateInvoiceStatus,
  deleteInvoice,
  adminCreateInvoice,
  bulkMarkInvoicesPaid,
  bulkSendInvoices,
  bulkDeleteInvoices,
  bulkEmailInvoices,
} from "@/lib/api/invoices";
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
  const selectedIds = useMemo(() => {
    return invoices.filter((_, idx) => rowSelection[idx]).map((i) => i.id);
  }, [invoices, rowSelection]);

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
    const errSuffix =
      result.errors.length > 0 ? ` (${result.errors.length} failed to render)` : "";
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

  const { formatDisplay } = useAdminCurrency();
  const columns = getColumns({
    onMarkPaid: handleMarkPaid,
    onDelete: isSuperAdmin ? (inv) => setDeleteTarget(inv) : undefined,
    formatDisplay,
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
          <Button onClick={() => setCreateOpen(true)} className="gap-1.5">
            <Plus className="size-4" />
            Create Invoice
          </Button>
        )}
      </div>

      <InvoiceSummarySection summary={summary} />

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
        selectedCount={selectedIds.length}
        isSuperAdmin={!!isSuperAdmin}
        onMarkPaid={handleBulkMarkPaid}
        onSend={handleBulkSend}
        onEmail={handleBulkEmail}
        onDelete={handleBulkDelete}
        onClear={clearSelection}
      />

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
