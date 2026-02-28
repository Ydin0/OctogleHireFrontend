"use client";

import { useMemo, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type { Invoice, InvoiceSummary } from "@/lib/api/invoices";
import { updateInvoiceStatus } from "@/lib/api/invoices";
import type { Pagination } from "@/lib/api/admin";
import { DataTable } from "../../_components/data-table";
import { getColumns } from "./columns";
import { InvoiceFiltersBar } from "./filters-bar";
import { InvoiceSummaryCards } from "./invoice-summary-cards";

interface InvoicesClientProps {
  invoices: Invoice[];
  summary: InvoiceSummary;
  token: string;
}

function InvoicesClient({ invoices, summary, token }: InvoicesClientProps) {
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
    await updateInvoiceStatus(token, invoice.id, "paid");
    startTransition(() => {
      router.refresh();
    });
  };

  const columns = getColumns({ onMarkPaid: handleMarkPaid });

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
    </>
  );
}

export { InvoicesClient };
