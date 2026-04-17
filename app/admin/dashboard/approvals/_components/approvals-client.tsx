"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CalendarClock,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Loader2,
  UserCheck,
  X,
} from "lucide-react";

import {
  adminApproveMatch,
  adminConfirmEngagementStart,
  adminRejectMatch,
  type AdminPendingApproval,
  type AdminUpcomingStart,
} from "@/lib/api/admin";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "../../_components/dashboard-data";
import { useAdminCurrency } from "../../_components/admin-currency-context";

interface ApprovalsClientProps {
  pending: AdminPendingApproval[];
  upcoming: AdminUpcomingStart[];
  token: string;
}

type Tab = "pending" | "upcoming";

const formatDate = (iso: string | null) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const daysUntil = (iso: string | null) => {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
};

function ApprovalsClient({ pending, upcoming, token }: ApprovalsClientProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [tab, setTab] = useState<Tab>(
    pending.length > 0 ? "pending" : "upcoming",
  );

  // Approve dialog
  const [approveTarget, setApproveTarget] = useState<AdminPendingApproval | null>(
    null,
  );
  const [approveForm, setApproveForm] = useState({
    engagementType: "full-time",
    monthlyHoursExpected: "160",
    companyBillingRate: "",
    developerPayoutRate: "",
    currency: "USD",
    startDate: undefined as Date | undefined,
  });
  const [approveSubmitting, setApproveSubmitting] = useState(false);

  const openApproveDialog = (m: AdminPendingApproval) => {
    const type = m.engagementType || "full-time";
    setApproveForm({
      engagementType: type,
      monthlyHoursExpected:
        type === "full-time" ? "160" : type === "part-time" ? "80" : "",
      companyBillingRate: String(m.proposedHourlyRate),
      developerPayoutRate: String(m.proposedHourlyRate),
      currency: m.currency,
      startDate: undefined,
    });
    setApproveTarget(m);
  };

  const onTypeChange = (type: string) => {
    setApproveForm((f) => ({
      ...f,
      engagementType: type,
      monthlyHoursExpected:
        type === "full-time" ? "160" : type === "part-time" ? "80" : "",
    }));
  };

  // Reject dialog
  const [rejectTarget, setRejectTarget] = useState<AdminPendingApproval | null>(
    null,
  );
  const [rejectReason, setRejectReason] = useState("");
  const [rejectSubmitting, setRejectSubmitting] = useState(false);

  // Confirm-start (per row)
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  let formatDisplay: ((amount: number, from: string) => string) | undefined;
  try {
    const ctx = useAdminCurrency();
    formatDisplay = ctx.formatDisplay;
  } catch {}

  const fmtMoney = (amount: number, currency: string) =>
    formatDisplay
      ? formatDisplay(amount, currency)
      : `${currency} ${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const refresh = () =>
    startTransition(() => {
      router.refresh();
    });

  const handleApprove = async () => {
    if (!approveTarget) return;
    if (!approveForm.companyBillingRate) {
      toast.error("Billing rate is required");
      return;
    }
    setApproveSubmitting(true);
    const result = await adminApproveMatch(token, approveTarget.id, {
      startDate: approveForm.startDate?.toISOString(),
      engagementType: approveForm.engagementType,
      monthlyHoursExpected: approveForm.monthlyHoursExpected
        ? Number(approveForm.monthlyHoursExpected)
        : null,
      companyBillingRate: Number(approveForm.companyBillingRate),
      developerPayoutRate: approveForm.developerPayoutRate
        ? Number(approveForm.developerPayoutRate)
        : undefined,
      currency: approveForm.currency,
    });
    if (result.success) {
      toast.success(
        approveForm.startDate && approveForm.startDate.getTime() > Date.now()
          ? "Engagement scheduled — confirm on the start date"
          : "Engagement created and active",
      );
      setApproveTarget(null);
      refresh();
    } else {
      toast.error(result.error ?? "Failed to approve");
    }
    setApproveSubmitting(false);
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    setRejectSubmitting(true);
    const result = await adminRejectMatch(
      token,
      rejectTarget.id,
      rejectReason || undefined,
    );
    if (result.success) {
      toast.success("Match rejected");
      setRejectTarget(null);
      setRejectReason("");
      refresh();
    } else {
      toast.error(result.error ?? "Failed to reject");
    }
    setRejectSubmitting(false);
  };

  const handleConfirmStart = async (id: string) => {
    setConfirmingId(id);
    const result = await adminConfirmEngagementStart(token, id);
    if (result.success) {
      toast.success("Engagement confirmed and live");
      refresh();
    } else {
      toast.error(result.error ?? "Failed to confirm");
    }
    setConfirmingId(null);
  };

  const monthlyValue = (e: AdminUpcomingStart) =>
    e.companyBillingRate * (e.monthlyHoursExpected ?? 0);

  const sortedUpcoming = useMemo(
    () =>
      [...upcoming].sort((a, b) => {
        const sa = a.startDate ? new Date(a.startDate).getTime() : Infinity;
        const sb = b.startDate ? new Date(b.startDate).getTime() : Infinity;
        return sa - sb;
      }),
    [upcoming],
  );

  return (
    <>
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold">Approvals</h1>
        <p className="text-sm text-muted-foreground">
          Approve developers on behalf of companies and confirm upcoming
          engagement starts.
        </p>
      </div>

      {/* KPIs */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Card
          className={pending.length > 0 ? "border-pulse/40 bg-pulse/5" : ""}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-pulse/10">
                <ClipboardCheck className="size-5 text-pulse" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Awaiting Approval
                </p>
                <p className="text-lg font-semibold">{pending.length}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Devs accepted, company hasn’t confirmed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
                <CalendarClock className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Upcoming Starts
                </p>
                <p className="text-lg font-semibold">{upcoming.length}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Next 60 days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <CheckCircle2 className="size-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Pending Confirmation
                </p>
                <p className="text-lg font-semibold">
                  {upcoming.filter((u) => u.status === "pending").length}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Need a final ✓ before going live
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setTab("pending")}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
            tab === "pending"
              ? "border-pulse/40 bg-pulse/10 text-pulse"
              : "border-border text-muted-foreground hover:border-pulse/25 hover:text-foreground"
          }`}
        >
          Awaiting Approval ({pending.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("upcoming")}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
            tab === "upcoming"
              ? "border-pulse/40 bg-pulse/10 text-pulse"
              : "border-border text-muted-foreground hover:border-pulse/25 hover:text-foreground"
          }`}
        >
          Upcoming Starts ({upcoming.length})
        </button>
      </div>

      {/* Pending approvals */}
      {tab === "pending" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Matches Awaiting Company Approval
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Developer has accepted. You can approve on the company’s behalf to
              create the engagement immediately.
            </p>
          </CardHeader>
          <CardContent>
            {pending.length === 0 ? (
              <div className="py-12 text-center">
                <UserCheck className="mx-auto mb-3 size-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  No matches awaiting approval right now.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pending.map((m) => (
                  <div
                    key={m.id}
                    className="flex flex-col gap-3 rounded-md border border-border/60 p-3 sm:flex-row sm:items-center"
                  >
                    <Avatar size="default" className="shrink-0">
                      {m.developerAvatar && (
                        <AvatarImage
                          src={m.developerAvatar}
                          alt={m.developerName}
                        />
                      )}
                      <AvatarFallback>
                        {(m.developerName || "?")
                          .split(" ")
                          .map((p) => p[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium">{m.developerName}</p>
                        <Badge
                          variant="outline"
                          className="text-[10px] capitalize"
                        >
                          {m.status.replace(/_/g, " ")}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {m.developerRole || "—"}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {m.companyName || "Unknown company"}
                        </span>{" "}
                        · {m.requirementTitle}
                      </p>
                    </div>

                    <div className="flex flex-col items-start gap-0.5 sm:items-end">
                      <p className="font-mono text-sm font-semibold">
                        {fmtMoney(m.proposedHourlyRate, m.currency)}/hr
                      </p>
                      <p className="text-[10px] capitalize text-muted-foreground">
                        {m.engagementType.replace(/-/g, " ")}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {m.respondedAt
                          ? `Accepted ${formatDate(m.respondedAt)}`
                          : `Proposed ${formatDate(m.proposedAt)}`}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setRejectTarget(m)}
                      >
                        <X className="mr-1 size-3.5" />
                        Reject
                      </Button>
                      <Button size="sm" onClick={() => openApproveDialog(m)}>
                        <Check className="mr-1 size-3.5" />
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Upcoming starts */}
      {tab === "upcoming" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming Engagement Starts</CardTitle>
            <p className="text-xs text-muted-foreground">
              Engagements scheduled to start in the next 60 days. Confirm pending
              ones to mark them live on the start date.
            </p>
          </CardHeader>
          <CardContent>
            {sortedUpcoming.length === 0 ? (
              <div className="py-12 text-center">
                <CalendarClock className="mx-auto mb-3 size-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  No engagements with upcoming start dates.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedUpcoming.map((e) => {
                  const days = daysUntil(e.startDate);
                  const isPending = e.status === "pending";
                  return (
                    <div
                      key={e.id}
                      className="flex flex-col gap-3 rounded-md border border-border/60 p-3 sm:flex-row sm:items-center"
                    >
                      <Avatar size="default" className="shrink-0">
                        {e.developerAvatar && (
                          <AvatarImage
                            src={e.developerAvatar}
                            alt={e.developerName}
                          />
                        )}
                        <AvatarFallback>
                          {(e.developerName || "?")
                            .split(" ")
                            .map((p) => p[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium">
                            {e.developerName}
                          </p>
                          <Badge
                            variant="outline"
                            className={`text-[10px] capitalize ${
                              isPending
                                ? "border-amber-500/40 bg-amber-500/10 text-amber-600"
                                : "border-emerald-500/40 bg-emerald-500/10 text-emerald-600"
                            }`}
                          >
                            {e.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {e.developerRole || "—"}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">
                            {e.companyName}
                          </span>{" "}
                          · {e.requirementTitle}
                        </p>
                      </div>

                      <div className="flex flex-col items-start gap-0.5 sm:items-end">
                        <div className="flex items-center gap-1.5 text-sm font-medium">
                          <Clock className="size-3.5 text-muted-foreground" />
                          <span>{formatDate(e.startDate)}</span>
                        </div>
                        {days !== null && (
                          <p className="text-[10px] text-muted-foreground">
                            {days === 0 ? "Today" : `in ${days}d`}
                          </p>
                        )}
                        <p className="font-mono text-xs text-muted-foreground">
                          {fmtMoney(monthlyValue(e), e.currency)}/mo
                        </p>
                      </div>

                      <div className="shrink-0">
                        {isPending ? (
                          <Button
                            size="sm"
                            onClick={() => handleConfirmStart(e.id)}
                            disabled={confirmingId === e.id}
                          >
                            {confirmingId === e.id ? (
                              <>
                                <Loader2 className="mr-1 size-3.5 animate-spin" />
                                Confirming…
                              </>
                            ) : (
                              <>
                                <Check className="mr-1 size-3.5" />
                                Confirm Start
                              </>
                            )}
                          </Button>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600"
                          >
                            Live
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Approve dialog */}
      <Dialog
        open={!!approveTarget}
        onOpenChange={(open) => {
          if (!open) {
            setApproveTarget(null);
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Approve developer</DialogTitle>
            <DialogDescription>
              Confirm <strong>{approveTarget?.developerName}</strong> for{" "}
              <strong>{approveTarget?.companyName}</strong>. Set the actual
              arrangement — these values define the engagement.
            </DialogDescription>
          </DialogHeader>

          {approveTarget && (
            <div className="space-y-4">
              <div className="rounded-md border bg-muted/30 p-3 text-xs">
                <p className="text-muted-foreground">
                  Role:{" "}
                  <span className="font-medium text-foreground">
                    {approveTarget.requirementTitle}
                  </span>
                </p>
                <p className="text-muted-foreground">
                  Proposed:{" "}
                  <span className="font-mono font-medium text-foreground">
                    {formatCurrency(
                      approveTarget.proposedHourlyRate,
                      approveTarget.currency,
                    )}
                    /hr · {approveTarget.engagementType.replace(/-/g, " ")}
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Engagement Type</Label>
                  <Select
                    value={approveForm.engagementType}
                    onValueChange={onTypeChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time (160h)</SelectItem>
                      <SelectItem value="part-time">Part-time (80h)</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Monthly Hours</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="e.g. 80"
                    value={approveForm.monthlyHoursExpected}
                    onChange={(e) =>
                      setApproveForm((f) => ({
                        ...f,
                        monthlyHoursExpected: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Billing Rate (/hr)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={approveForm.companyBillingRate}
                    onChange={(e) =>
                      setApproveForm((f) => ({
                        ...f,
                        companyBillingRate: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select
                    value={approveForm.currency}
                    onValueChange={(v) =>
                      setApproveForm((f) => ({ ...f, currency: v }))
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

              <div className="space-y-2">
                <Label>Developer Payout Rate (/hr)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={approveForm.developerPayoutRate}
                  onChange={(e) =>
                    setApproveForm((f) => ({
                      ...f,
                      developerPayoutRate: e.target.value,
                    }))
                  }
                />
                <p className="text-[10px] text-muted-foreground">
                  What you pay the developer per hour. Defaults to the proposed
                  rate.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Start date (optional)</Label>
                <DatePicker
                  value={approveForm.startDate}
                  onChange={(d) =>
                    setApproveForm((f) => ({ ...f, startDate: d ?? undefined }))
                  }
                />
                <p className="text-[10px] text-muted-foreground">
                  Leave blank to start immediately. Future dates create a{" "}
                  <span className="font-mono">pending</span> engagement to
                  confirm on the start date.
                </p>
              </div>

              {approveForm.companyBillingRate && approveForm.monthlyHoursExpected && (
                <div className="rounded-md border border-pulse/20 bg-pulse/5 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Predicted monthly bill
                    </p>
                    <p className="font-mono text-base font-semibold">
                      {formatCurrency(
                        Number(approveForm.companyBillingRate) *
                          Number(approveForm.monthlyHoursExpected),
                        approveForm.currency,
                      )}
                    </p>
                  </div>
                  {approveForm.developerPayoutRate && (
                    <div className="mt-1 flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        Predicted monthly margin
                      </p>
                      <p className="font-mono text-xs">
                        {formatCurrency(
                          (Number(approveForm.companyBillingRate) -
                            Number(approveForm.developerPayoutRate)) *
                            Number(approveForm.monthlyHoursExpected),
                          approveForm.currency,
                        )}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setApproveTarget(null)}
              disabled={approveSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={approveSubmitting || !approveForm.companyBillingRate}
            >
              {approveSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Approving…
                </>
              ) : (
                "Confirm Approval"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject dialog */}
      <Dialog
        open={!!rejectTarget}
        onOpenChange={(open) => {
          if (!open) {
            setRejectTarget(null);
            setRejectReason("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject match</DialogTitle>
            <DialogDescription>
              Reject <strong>{rejectTarget?.developerName}</strong> for{" "}
              <strong>{rejectTarget?.companyName}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label>Reason (optional)</Label>
            <Textarea
              rows={3}
              placeholder="Internal note for the team…"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectTarget(null)}
              disabled={rejectSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={rejectSubmitting}
            >
              {rejectSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Rejecting…
                </>
              ) : (
                "Confirm Rejection"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export { ApprovalsClient };
