"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import type { AdminTimeEntry } from "@/lib/api/time-entries";
import { approveTimeEntry, rejectTimeEntry, deleteTimeEntry } from "@/lib/api/time-entries";
import type { AdminEngagement, Pagination } from "@/lib/api/admin";
import { createAdminTimeEntry } from "@/lib/api/admin";
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
import { useAdminCurrency } from "../../_components/admin-currency-context";
import { TimeEntryFiltersBar } from "./filters-bar";
import { Card, CardContent } from "@/components/ui/card";

interface TimeEntriesClientProps {
  timeEntries: AdminTimeEntry[];
  engagements: AdminEngagement[];
  token: string;
  isSuperAdmin?: boolean;
}

const currentMonthKey = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

function TimeEntriesClient({ timeEntries, engagements, token, isSuperAdmin }: TimeEntriesClientProps) {
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

  // Add Timesheet dialog
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
    period: currentMonthKey(),
    hours: "",
    description: "",
  });

  const selectedEng = activeEngagements.find(
    (e) => e.id === createForm.engagementId,
  );

  const onPickEngagement = (id: string) => {
    const eng = activeEngagements.find((e) => e.id === id);
    setCreateForm((f) => ({
      ...f,
      engagementId: id,
      hours: eng?.monthlyHoursExpected ? String(eng.monthlyHoursExpected) : f.hours,
    }));
  };

  const previewBilling = selectedEng
    ? Number(createForm.hours || 0) * selectedEng.companyBillingRate
    : 0;

  const handleCreate = async () => {
    if (!createForm.engagementId || !createForm.hours || !createForm.period) {
      toast.error("Engagement, period and hours are required");
      return;
    }
    setCreateSubmitting(true);
    const result = await createAdminTimeEntry(token, {
      engagementId: createForm.engagementId,
      period: createForm.period,
      hours: Number(createForm.hours),
      description: createForm.description || undefined,
    });
    if (result.success) {
      toast.success("Timesheet submitted — invoice generates after approvals");
      setCreateOpen(false);
      setCreateForm({
        engagementId: "",
        period: currentMonthKey(),
        hours: "",
        description: "",
      });
      startTransition(() => {
        router.refresh();
      });
    } else {
      toast.error(result.error ?? "Failed to create timesheet");
    }
    setCreateSubmitting(false);
  };

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
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold">Timesheets</h1>
          <p className="text-sm text-muted-foreground">
            Review and approve developer time submissions across all engagements.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-1.5">
          <Plus className="size-4" />
          Add Timesheet
        </Button>
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

      {/* Add Timesheet Dialog */}
      <Dialog
        open={createOpen}
        onOpenChange={(open) => {
          if (!open && !createSubmitting) setCreateOpen(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Timesheet</DialogTitle>
            <DialogDescription>
              Submit hours for an engagement. The timesheet enters{" "}
              <strong>submitted</strong> status; an invoice is auto-generated
              once both admin and company approve.
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
              {selectedEng && (
                <p className="text-[10px] text-muted-foreground">
                  Billing rate{" "}
                  <span className="font-mono">
                    {formatCurrency(
                      selectedEng.companyBillingRate,
                      selectedEng.currency,
                    )}
                    /hr
                  </span>{" "}
                  · expected {selectedEng.monthlyHoursExpected ?? "—"}h/mo
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

            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Textarea
                rows={2}
                placeholder="Notes about this timesheet…"
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>

            {selectedEng && Number(createForm.hours) > 0 && (
              <div className="rounded-md border border-pulse/20 bg-pulse/5 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Billing amount (after approval)
                  </p>
                  <p className="font-mono text-base font-semibold">
                    {formatCurrency(previewBilling, selectedEng.currency)}
                  </p>
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
                  Submitting…
                </>
              ) : (
                "Submit Timesheet"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
