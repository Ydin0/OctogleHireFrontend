"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "sonner";
import type { AdminTimeEntry } from "@/lib/api/time-entries";
import { approveTimeEntry, rejectTimeEntry, deleteTimeEntry } from "@/lib/api/time-entries";
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
import { useAdminCurrency } from "../../_components/admin-currency-context";
import { TimeEntryFiltersBar } from "./filters-bar";
import { Card, CardContent } from "@/components/ui/card";

interface TimeEntriesClientProps {
  timeEntries: AdminTimeEntry[];
  token: string;
  isSuperAdmin?: boolean;
}

function TimeEntriesClient({ timeEntries, token, isSuperAdmin }: TimeEntriesClientProps) {
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
    try {
      await approveTimeEntry(token, entry.id);
      toast.success("Time entry approved");
      startTransition(() => {
        router.refresh();
      });
    } catch {
      toast.error("Failed to approve time entry");
    }
  };

  const handleReject = async (entry: AdminTimeEntry) => {
    try {
      await rejectTimeEntry(token, entry.id);
      toast.success("Time entry rejected");
      startTransition(() => {
        router.refresh();
      });
    } catch {
      toast.error("Failed to reject time entry");
    }
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

  const [deleteTarget, setDeleteTarget] = useState<AdminTimeEntry | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const ok = await deleteTimeEntry(token, deleteTarget.id);
    if (ok) {
      toast.success("Time entry deleted");
      setDeleteTarget(null);
      startTransition(() => { router.refresh(); });
    } else {
      toast.error("Failed to delete time entry");
    }
    setDeleting(false);
  };

  const { formatDisplay } = useAdminCurrency();
  const columns = getColumns({
    onApprove: handleApprove,
    onReject: handleReject,
    onDelete: isSuperAdmin ? (e) => setDeleteTarget(e) : undefined,
    formatDisplay,
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
              {formatDisplay(approvedThisMonthTotal, "USD")}
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

      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Time Entry</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this time entry for{" "}
              <strong>{deleteTarget?.developerName}</strong> ({deleteTarget?.period},{" "}
              {deleteTarget?.hours} hours)? This action cannot be undone.
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

export { TimeEntriesClient };
