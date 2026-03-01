"use client";

import { useMemo, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type { AdminTimeEntry } from "@/lib/api/time-entries";
import { approveTimeEntry, rejectTimeEntry } from "@/lib/api/time-entries";
import type { Pagination } from "@/lib/api/admin";
import { formatCurrency } from "../../_components/dashboard-data";
import { DataTable } from "../../_components/data-table";
import { getColumns } from "./columns";
import { TimeEntryFiltersBar } from "./filters-bar";
import { Card, CardContent } from "@/components/ui/card";

interface TimeEntriesClientProps {
  timeEntries: AdminTimeEntry[];
  token: string;
}

function TimeEntriesClient({ timeEntries, token }: TimeEntriesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") ?? "";
  const currentStatus = searchParams.get("status") ?? "all";
  const currentPeriod = searchParams.get("period") ?? "";
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
  const filteredEntries = useMemo(() => {
    let result = timeEntries;

    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      result = result.filter(
        (e) =>
          e.developerName.toLowerCase().includes(q) ||
          e.companyName.toLowerCase().includes(q),
      );
    }

    if (currentStatus && currentStatus !== "all") {
      result = result.filter((e) => e.status === currentStatus);
    }

    if (currentPeriod) {
      result = result.filter((e) => e.period === currentPeriod);
    }

    return result;
  }, [timeEntries, currentSearch, currentStatus, currentPeriod]);

  // Client-side sorting
  const sortedEntries = useMemo(() => {
    if (!currentSortBy) return filteredEntries;

    const sorted = [...filteredEntries];
    const order = currentSortOrder === "desc" ? -1 : 1;

    sorted.sort((a, b) => {
      switch (currentSortBy) {
        case "developerName":
          return order * a.developerName.localeCompare(b.developerName);
        case "companyName":
          return order * a.companyName.localeCompare(b.companyName);
        case "period":
          return order * a.period.localeCompare(b.period);
        case "hours":
          return order * (a.hours - b.hours);
        case "billingAmount":
          return order * (a.billingAmount - b.billingAmount);
        case "status":
          return order * a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return sorted;
  }, [filteredEntries, currentSortBy, currentSortOrder]);

  // Client-side pagination
  const total = sortedEntries.length;
  const totalPages = Math.max(1, Math.ceil(total / currentLimit));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedEntries = sortedEntries.slice(
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

  const handleApprove = async (entry: AdminTimeEntry) => {
    await approveTimeEntry(token, entry.id);
    startTransition(() => {
      router.refresh();
    });
  };

  const handleReject = async (entry: AdminTimeEntry) => {
    await rejectTimeEntry(token, entry.id);
    startTransition(() => {
      router.refresh();
    });
  };

  // Summary stats
  const totalSubmitted = timeEntries.length;
  const pendingReview = timeEntries.filter(
    (e) => e.status === "submitted",
  ).length;

  const now = new Date();
  const currentMonthPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const approvedThisMonth = timeEntries.filter(
    (e) => e.status === "approved" && e.period === currentMonthPeriod,
  );
  const approvedThisMonthTotal = approvedThisMonth.reduce(
    (sum, e) => sum + e.billingAmount,
    0,
  );

  const columns = getColumns({
    onApprove: handleApprove,
    onReject: handleReject,
  });

  return (
    <>
      <div>
        <h1 className="text-lg font-semibold">Timesheets</h1>
        <p className="text-sm text-muted-foreground">
          Review and approve developer time submissions across all engagements.
        </p>
      </div>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Total Submissions
            </p>
            <p className="mt-1 text-2xl font-semibold">{totalSubmitted}</p>
          </CardContent>
        </Card>
        <Card className={pendingReview > 0 ? "border-amber-600/20" : undefined}>
          <CardContent className="p-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Pending Review
            </p>
            <p className="mt-1 text-2xl font-semibold">{pendingReview}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Approved This Month
            </p>
            <p className="mt-1 font-mono text-2xl font-semibold">
              {formatCurrency(approvedThisMonthTotal)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {approvedThisMonth.length} entr{approvedThisMonth.length !== 1 ? "ies" : "y"}
            </p>
          </CardContent>
        </Card>
      </section>

      <TimeEntryFiltersBar />

      <DataTable
        columns={columns}
        data={paginatedEntries}
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
      />
    </>
  );
}

export { TimeEntriesClient };
