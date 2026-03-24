"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "sonner";
import type { Invoice, InvoiceSummary } from "@/lib/api/invoices";
import { updateInvoiceStatus, deleteInvoice } from "@/lib/api/invoices";
import type { Pagination } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataTable } from "../../_components/data-table";
import { getColumns } from "./columns";
import { InvoiceFiltersBar } from "./filters-bar";
import { InvoiceSummaryCards } from "./invoice-summary-cards";
import { useAdminCurrency } from "../../_components/admin-currency-context";

interface InvoicesClientProps {
  invoices: Invoice[];
  summary: InvoiceSummary;
  token: string;
  isSuperAdmin?: boolean;
}

function InvoicesClient({ invoices, summary, token, isSuperAdmin }: InvoicesClientProps) {
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
      <div>
        <h1 className="text-lg font-semibold">Invoices</h1>
        <p className="text-sm text-muted-foreground">
          Track billing, payments, and outstanding invoices for all companies.
        </p>
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
