"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "sonner";
import type { Payout, PayoutSummary } from "@/lib/api/payouts";
import { updatePayoutStatus, deletePayout } from "@/lib/api/payouts";
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
import { PayoutFiltersBar } from "./filters-bar";
import { PayoutSummaryCards } from "./payout-summary-cards";
import { useAdminCurrency } from "../../_components/admin-currency-context";

interface PayoutsClientProps {
  payouts: Payout[];
  summary: PayoutSummary;
  token: string;
  isSuperAdmin?: boolean;
}

function PayoutsClient({ payouts, summary, token, isSuperAdmin }: PayoutsClientProps) {
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
    try {
      await updatePayoutStatus(token, payout.id, "paid");
      toast.success("Payout marked as paid");
      startTransition(() => {
        router.refresh();
      });
    } catch {
      toast.error("Failed to update payout status");
    }
  };

  const [deleteTarget, setDeleteTarget] = useState<Payout | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const ok = await deletePayout(token, deleteTarget.id);
    if (ok) {
      toast.success("Payout deleted");
      setDeleteTarget(null);
      startTransition(() => { router.refresh(); });
    } else {
      toast.error("Failed to delete payout");
    }
    setDeleting(false);
  };

  const { formatDisplay } = useAdminCurrency();
  const columns = getColumns({
    onMarkPaid: handleMarkPaid,
    onDelete: isSuperAdmin ? (p) => setDeleteTarget(p) : undefined,
    formatDisplay,
  });

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

      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Payout</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete payout{" "}
              <strong>{deleteTarget?.payoutNumber}</strong> for{" "}
              <strong>{deleteTarget?.developerName}</strong>? This will also remove
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

export { PayoutsClient };
