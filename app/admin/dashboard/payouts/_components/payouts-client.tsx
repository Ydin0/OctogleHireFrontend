"use client";

import { useMemo, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type { Payout, PayoutSummary } from "@/lib/api/payouts";
import { updatePayoutStatus } from "@/lib/api/payouts";
import type { Pagination } from "@/lib/api/admin";
import { DataTable } from "../../_components/data-table";
import { getColumns } from "./columns";
import { PayoutFiltersBar } from "./filters-bar";
import { PayoutSummaryCards } from "./payout-summary-cards";

interface PayoutsClientProps {
  payouts: Payout[];
  summary: PayoutSummary;
  token: string;
}

function PayoutsClient({ payouts, summary, token }: PayoutsClientProps) {
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

  const filteredPayouts = useMemo(() => {
    let result = payouts;

    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.developerName.toLowerCase().includes(q) ||
          p.payoutNumber.toLowerCase().includes(q),
      );
    }

    if (currentStatus && currentStatus !== "all") {
      result = result.filter((p) => p.status === currentStatus);
    }

    return result;
  }, [payouts, currentSearch, currentStatus]);

  const sortedPayouts = useMemo(() => {
    if (!currentSortBy) return filteredPayouts;

    const sorted = [...filteredPayouts];
    const order = currentSortOrder === "desc" ? -1 : 1;

    sorted.sort((a, b) => {
      switch (currentSortBy) {
        case "payoutNumber":
          return order * a.payoutNumber.localeCompare(b.payoutNumber);
        case "developerName":
          return order * a.developerName.localeCompare(b.developerName);
        case "total":
          return order * (a.total - b.total);
        case "status":
          return order * a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return sorted;
  }, [filteredPayouts, currentSortBy, currentSortOrder]);

  const total = sortedPayouts.length;
  const totalPages = Math.max(1, Math.ceil(total / currentLimit));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedPayouts = sortedPayouts.slice(
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

  const handleMarkPaid = async (payout: Payout) => {
    await updatePayoutStatus(token, payout.id, "paid");
    startTransition(() => {
      router.refresh();
    });
  };

  const columns = getColumns({ onMarkPaid: handleMarkPaid });

  return (
    <>
      <div>
        <h1 className="text-lg font-semibold">Payouts</h1>
        <p className="text-sm text-muted-foreground">
          Track developer payouts, payment status, and profit margins.
        </p>
      </div>

      <PayoutSummaryCards summary={summary} />

      <PayoutFiltersBar />

      <DataTable
        columns={columns}
        data={paginatedPayouts}
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
        onRowClick={(payout) =>
          router.push(`/admin/dashboard/payouts/${payout.id}`)
        }
      />
    </>
  );
}

export { PayoutsClient };
