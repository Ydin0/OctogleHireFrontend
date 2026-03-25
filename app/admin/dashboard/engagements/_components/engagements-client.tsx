"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertCircle,
  Briefcase,
  DollarSign,
  Loader2,
  Users,
} from "lucide-react";

import type { AdminEngagement } from "@/lib/api/admin";
import { createAdminTimeEntry } from "@/lib/api/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

// ── Helpers ─────────────────────────────────────────────────────────────────

type StatusFilter = "all" | "active" | "pending" | "ended" | "cancelled";

const formatCurrency = (amount: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);

function computeMonthlyBill(engagements: AdminEngagement[]): number {
  return engagements
    .filter((e) => e.status === "active")
    .reduce((sum, e) => {
      const hours = e.monthlyHoursCap ?? e.monthlyHoursExpected ?? 0;
      return sum + e.companyBillingRate * hours;
    }, 0);
}

function currentPeriod(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

// ── Component ───────────────────────────────────────────────────────────────

interface EngagementsClientProps {
  engagements: AdminEngagement[];
  token: string;
}

function EngagementsClient({ engagements, token }: EngagementsClientProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  // Timesheet dialog
  const [timesheetTarget, setTimesheetTarget] = useState<AdminEngagement | null>(null);
  const [tsHours, setTsHours] = useState("");
  const [tsDescription, setTsDescription] = useState("");
  const [tsPeriod, setTsPeriod] = useState(currentPeriod());
  const [tsSubmitting, setTsSubmitting] = useState(false);

  // Currency display
  let formatDisplay: ((amount: number, from: string) => string) | undefined;
  try {
    const ctx = useAdminCurrency();
    formatDisplay = ctx.formatDisplay;
  } catch {
    // Outside provider — ignore
  }

  // KPIs
  const activeCount = engagements.filter((e) => e.status === "active").length;
  const uniqueDevs = new Set(
    engagements.filter((e) => e.status === "active").map((e) => e.developerId),
  ).size;
  const predictedBill = computeMonthlyBill(engagements);
  const pendingRequests = engagements.filter(
    (e) => e.pendingChangeRequests > 0,
  ).length;

  const kpis = [
    { label: "Active Engagements", value: String(activeCount), icon: Briefcase, highlight: false, mono: false },
    { label: "Active Developers", value: String(uniqueDevs), icon: Users, highlight: false, mono: false },
    { label: "Predicted Monthly Bill", value: formatDisplay ? formatDisplay(predictedBill, "USD") : formatCurrency(predictedBill), icon: DollarSign, highlight: false, mono: true },
    { label: "Pending Requests", value: String(pendingRequests), icon: AlertCircle, highlight: pendingRequests > 0, mono: false },
  ];

  // Status tabs
  const pendingCount = engagements.filter((e) => e.status === "pending").length;
  const endedCount = engagements.filter((e) => e.status === "ended").length;
  const cancelledCount = engagements.filter((e) => e.status === "cancelled").length;

  const statusTabs: { label: string; value: StatusFilter; count: number }[] = [
    { label: "All", value: "all", count: engagements.length },
    { label: "Active", value: "active", count: activeCount },
    { label: "Pending", value: "pending", count: pendingCount },
    { label: "Ended", value: "ended", count: endedCount },
    { label: "Cancelled", value: "cancelled", count: cancelledCount },
  ];

  // Filter + paginate
  const filtered = useMemo(() => {
    const base = statusFilter === "all"
      ? engagements
      : engagements.filter((e) => e.status === statusFilter);
    return base.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [engagements, statusFilter]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const paginatedData = filtered.slice((safePage - 1) * limit, safePage * limit);

  const columns = useMemo(
    () => getColumns({ onAddTimesheet: setTimesheetTarget, formatDisplay }),
    [formatDisplay],
  );

  // Timesheet submission
  const handleTimesheetSubmit = async () => {
    if (!timesheetTarget || !tsHours) return;
    setTsSubmitting(true);

    const result = await createAdminTimeEntry(token, {
      engagementId: timesheetTarget.id,
      period: tsPeriod,
      hours: Number(tsHours),
      description: tsDescription || undefined,
    });

    if (result.success) {
      toast.success("Timesheet created — invoice will be generated");
      setTimesheetTarget(null);
      setTsHours("");
      setTsDescription("");
      setTsPeriod(currentPeriod());
      startTransition(() => {
        router.refresh();
      });
    } else {
      toast.error(result.error ?? "Failed to create timesheet");
    }

    setTsSubmitting(false);
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Engagements</h1>
          <p className="text-sm text-muted-foreground">
            All active engagements across every company on the platform.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Card
            key={kpi.label}
            className={kpi.highlight ? "border-amber-500/40 bg-amber-500/5" : ""}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-8 items-center justify-center rounded-full ${kpi.highlight ? "bg-amber-500/15" : "bg-pulse/10"}`}
                >
                  <kpi.icon
                    className={`size-4 ${kpi.highlight ? "text-amber-600" : "text-pulse"}`}
                  />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {kpi.label}
                  </p>
                  <p
                    className={`text-lg font-semibold ${kpi.mono ? "font-mono" : ""} ${kpi.highlight ? "text-amber-600" : ""}`}
                  >
                    {kpi.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Status Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => {
              setStatusFilter(tab.value);
              setPage(1);
            }}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              statusFilter === tab.value
                ? "border-pulse/40 bg-pulse/10 text-pulse"
                : "border-border text-muted-foreground hover:border-pulse/25 hover:text-foreground"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="mx-auto mb-3 size-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              {engagements.length === 0
                ? "No engagements found."
                : "No engagements match this filter."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <DataTable
          columns={columns}
          data={paginatedData}
          pagination={{ page: safePage, limit, total, totalPages }}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
        />
      )}

      {/* Add Timesheet Dialog */}
      <Dialog
        open={!!timesheetTarget}
        onOpenChange={(open) => {
          if (!open) {
            setTimesheetTarget(null);
            setTsHours("");
            setTsDescription("");
            setTsPeriod(currentPeriod());
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Timesheet</DialogTitle>
            <DialogDescription>
              Manually submit hours for{" "}
              <strong>{timesheetTarget?.developerName}</strong> at{" "}
              <strong>{timesheetTarget?.companyName}</strong>. This will
              generate an invoice for the client.
            </DialogDescription>
          </DialogHeader>

          {timesheetTarget && (
            <div className="space-y-4">
              <div className="rounded-md border p-3 space-y-1">
                <p className="text-xs text-muted-foreground">Engagement Details</p>
                <p className="text-sm font-medium">
                  {timesheetTarget.requirementTitle}
                </p>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>
                    Billing:{" "}
                    <span className="font-mono font-medium text-foreground">
                      {formatCurrency(timesheetTarget.companyBillingRate, timesheetTarget.currency)}/hr
                    </span>
                  </span>
                  <span>
                    Cap:{" "}
                    <span className="font-mono font-medium text-foreground">
                      {timesheetTarget.monthlyHoursCap ?? timesheetTarget.monthlyHoursExpected ?? "—"}h
                    </span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ts-period">Period</Label>
                  <Input
                    id="ts-period"
                    type="month"
                    value={tsPeriod}
                    onChange={(e) => setTsPeriod(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ts-hours">Hours</Label>
                  <Input
                    id="ts-hours"
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="e.g. 160"
                    value={tsHours}
                    onChange={(e) => setTsHours(e.target.value)}
                  />
                </div>
              </div>

              {tsHours && (
                <div className="rounded-md border border-pulse/20 bg-pulse/5 p-3">
                  <p className="text-xs text-muted-foreground">
                    Invoice amount
                  </p>
                  <p className="font-mono text-lg font-semibold">
                    {formatCurrency(
                      Number(tsHours) * timesheetTarget.companyBillingRate,
                      timesheetTarget.currency,
                    )}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="ts-desc">Description (optional)</Label>
                <Textarea
                  id="ts-desc"
                  placeholder="Notes about this timesheet..."
                  value={tsDescription}
                  onChange={(e) => setTsDescription(e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setTimesheetTarget(null)}
              disabled={tsSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleTimesheetSubmit}
              disabled={tsSubmitting || !tsHours || Number(tsHours) <= 0}
            >
              {tsSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit & Generate Invoice"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export { EngagementsClient };
