"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import type { Invoice, InvoiceSummary } from "@/lib/api/invoices";
import {
  updateInvoiceStatus,
  deleteInvoice,
  adminCreateInvoice,
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
import { InvoiceSummaryCards } from "./invoice-summary-cards";
import { useAdminCurrency } from "../../_components/admin-currency-context";

interface InvoicesClientProps {
  invoices: Invoice[];
  summary: InvoiceSummary;
  engagements: AdminEngagement[];
  token: string;
  isSuperAdmin?: boolean;
}

const currentPeriod = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

function InvoicesClient({ invoices, summary, engagements, token, isSuperAdmin }: InvoicesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") ?? "";
  const currentStatus = searchParams.get("status") ?? "all";
  const currentSortBy = searchParams.get("sortBy") ?? "";
  const currentSortOrder = searchParams.get("sortOrder") ?? "";
  const currentPage = parseInt(searchParams.get("page") ?? "1", 10);
  const currentLimit = parseInt(searchParams.get("limit") ?? "20", 10);

  const pushParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  // Client-side filtering
  const filteredInvoices = useMemo(() => {
    let result = invoices;

    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      result = result.filter(
        (inv) =>
          inv.companyName.toLowerCase().includes(q) ||
          inv.invoiceNumber.toLowerCase().includes(q),
      );
    }

    if (currentStatus && currentStatus !== "all") {
      result = result.filter((inv) => inv.status === currentStatus);
    }

    return result;
  }, [invoices, currentSearch, currentStatus]);

  // Client-side sorting
  const sortedInvoices = useMemo(() => {
    if (!currentSortBy) return filteredInvoices;

    const sorted = [...filteredInvoices];
    const order = currentSortOrder === "desc" ? -1 : 1;

    sorted.sort((a, b) => {
      switch (currentSortBy) {
        case "invoiceNumber":
          return order * a.invoiceNumber.localeCompare(b.invoiceNumber);
        case "companyName":
          return order * a.companyName.localeCompare(b.companyName);
        case "total":
          return order * (a.total - b.total);
        case "status":
          return order * a.status.localeCompare(b.status);
        case "issuedAt":
          return (
            order *
            (new Date(a.issuedAt).getTime() - new Date(b.issuedAt).getTime())
          );
        case "dueDate":
          return (
            order *
            (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
          );
        default:
          return 0;
      }
    });

    return sorted;
  }, [filteredInvoices, currentSortBy, currentSortOrder]);

  // Client-side pagination
  const total = sortedInvoices.length;
  const totalPages = Math.max(1, Math.ceil(total / currentLimit));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedInvoices = sortedInvoices.slice(
    (safePage - 1) * currentLimit,
    safePage * currentLimit,
  );

  const pagination: Pagination = {
    page: safePage,
    limit: currentLimit,
    total,
    totalPages,
  };

  const handleSortChange = (column: string) => {
    if (currentSortBy === column) {
      if (currentSortOrder === "asc") {
        pushParams({ sortBy: column, sortOrder: "desc" });
      } else {
        pushParams({ sortBy: "", sortOrder: "" });
      }
    } else {
      pushParams({ sortBy: column, sortOrder: "asc" });
    }
  };

  const handleMarkPaid = async (invoice: Invoice) => {
    try {
      await updateInvoiceStatus(token, invoice.id, "paid");
      toast.success("Invoice marked as paid");
      startTransition(() => {
        router.refresh();
      });
    } catch {
      toast.error("Failed to update invoice status");
    }
  };

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<Invoice | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Create-invoice state (super admin)
  const activeEngagements = useMemo(
    () => engagements.filter((e) => e.status === "active" || e.status === "pending"),
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
      toast.success("Invoice created");
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
      startTransition(() => {
        router.refresh();
      });
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
      startTransition(() => { router.refresh(); });
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

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold">Invoices</h1>
          <p className="text-sm text-muted-foreground">
            Track billing, payments, and outstanding invoices for all companies.
          </p>
        </div>
        {isSuperAdmin && (
          <Button onClick={() => setCreateOpen(true)} className="gap-1.5">
            <Plus className="size-4" />
            Create Invoice
          </Button>
        )}
      </div>

      <InvoiceSummaryCards summary={summary} />

      <InvoiceFiltersBar />

      <DataTable
        columns={columns}
        data={paginatedInvoices}
        pagination={pagination}
        onPageChange={(page) => pushParams({ page: String(page) })}
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
          currentSortBy
            ? {
                column: currentSortBy,
                order: currentSortOrder as "asc" | "desc",
              }
            : undefined
        }
        onRowClick={(invoice) =>
          router.push(`/admin/dashboard/invoices/${invoice.id}`)
        }
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
              arrangement. The invoice is created in <strong>sent</strong>{" "}
              status.
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
                  Creating…
                </>
              ) : (
                "Create Invoice"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Invoice</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete invoice{" "}
              <strong>{deleteTarget?.invoiceNumber}</strong> for{" "}
              <strong>{deleteTarget?.companyName}</strong>? This will also remove
              all associated line items. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export { InvoicesClient };
