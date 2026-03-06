"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Building2, Clock, Download } from "lucide-react";

import type {
  DeveloperEngagement,
  DeveloperOpportunity,
  DeveloperPayout,
  DeveloperPayoutSummary,
  DeveloperTimeEntry,
} from "@/lib/api/developer";
import { respondToDeveloperOpportunity } from "@/lib/api/developer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SubmitHoursDialog } from "../engagements/_components/submit-hours-dialog";
import {
  formatCurrency,
  formatDate,
  payoutStatusBadgeClass,
  payoutStatusLabel,
  type PayoutStatus,
  timeEntryStatusBadgeClass,
  timeEntryStatusLabel,
  type TimeEntryStatus,
} from "@/app/admin/dashboard/_components/dashboard-data";

const engagementStatusBadgeClass = (status: string) => {
  switch (status) {
    case "active":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-600/20";
    case "pending":
      return "bg-amber-500/10 text-amber-700 border-amber-600/20";
    case "ended":
      return "bg-zinc-500/10 text-zinc-600 border-zinc-600/20";
    default:
      return "bg-zinc-500/10 text-zinc-600 border-zinc-600/20";
  }
};

export function OverviewClient({
  engagements,
  opportunities,
  payouts,
  summary,
  timeEntries,
}: {
  engagements: DeveloperEngagement[];
  opportunities: DeveloperOpportunity[];
  payouts: DeveloperPayout[];
  summary: DeveloperPayoutSummary;
  timeEntries: DeveloperTimeEntry[];
}) {
  const router = useRouter();
  const { getToken } = useAuth();
  const [submitEngagement, setSubmitEngagement] =
    useState<DeveloperEngagement | null>(null);
  const [respondingId, setRespondingId] = useState<string | null>(null);

  const activeEngagements = engagements.filter((e) => e.status === "active");
  const pendingOpportunities = opportunities.filter(
    (o) => o.status === "proposed",
  );
  const pendingPayouts = payouts.filter((p) => p.status === "pending");
  const paidPayouts = payouts.filter((p) => p.status === "paid");
  const recentPayouts = [...payouts]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);
  const recentTimeEntries = [...timeEntries]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  const uniqueCompanies = new Set(
    activeEngagements.map((e) => e.companyId),
  ).size;

  const handleRespond = async (
    matchId: string,
    action: "accepted" | "declined",
  ) => {
    setRespondingId(matchId);
    try {
      const token = await getToken();
      await respondToDeveloperOpportunity(token, matchId, action);
      router.refresh();
    } catch {
      // router.refresh will show current state
    } finally {
      setRespondingId(null);
    }
  };

  return (
    <>
      {/* KPI Summary Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Active Engagements
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {activeEngagements.length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {uniqueCompanies} {uniqueCompanies === 1 ? "company" : "companies"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Pending Opportunities
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {pendingOpportunities.length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Awaiting your response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Pending Payouts
            </p>
            <p className="mt-1 font-mono text-2xl font-semibold">
              {formatCurrency(summary.totalPending)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {pendingPayouts.length} pending{" "}
              {pendingPayouts.length === 1 ? "payout" : "payouts"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Total Earned
            </p>
            <p className="mt-1 font-mono text-2xl font-semibold">
              {formatCurrency(summary.totalPaidOut)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Across {paidPayouts.length} paid{" "}
              {paidPayouts.length === 1 ? "payout" : "payouts"}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Active Engagements */}
      <section>
        <h2 className="text-lg font-semibold">Active Engagements</h2>
        <div className="mt-3 space-y-3">
          {activeEngagements.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No active engagements yet.
            </p>
          ) : (
            activeEngagements.map((eng) => (
              <Card key={eng.id}>
                <CardContent className="flex items-center justify-between pt-6">
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    {eng.companyLogoUrl ? (
                      <Image
                        src={eng.companyLogoUrl}
                        alt={eng.companyName}
                        width={32}
                        height={32}
                        unoptimized
                        className="size-8 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                        <Building2 className="size-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{eng.companyName}</p>
                      <Badge
                        variant="outline"
                        className={engagementStatusBadgeClass(eng.status)}
                      >
                        {eng.status.charAt(0).toUpperCase() + eng.status.slice(1)}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {eng.engagementType}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {eng.requirementTitle}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      <span className="font-mono">
                        {formatCurrency(eng.developerPayoutRate, eng.currency)}/hr
                      </span>
                      {eng.startDate && (
                        <> &middot; Started {formatDate(eng.startDate)}</>
                      )}
                    </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                    onClick={() => setSubmitEngagement(eng)}
                  >
                    <Clock className="mr-1.5 size-3.5" />
                    Submit Hours
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* Two-column: Opportunities | Recent Payouts */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Opportunities Awaiting Response */}
        <div>
          <h2 className="text-lg font-semibold">
            Opportunities Awaiting Response
          </h2>
          <div className="mt-3 space-y-3">
            {pendingOpportunities.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No pending opportunities.
              </p>
            ) : (
              pendingOpportunities.map((opp) => (
                <Card key={opp.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 flex-1 items-start gap-3">
                        {opp.companyLogoUrl ? (
                          <Image
                            src={opp.companyLogoUrl}
                            alt={opp.companyName}
                            width={32}
                            height={32}
                            unoptimized
                            className="size-8 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                            <Building2 className="size-4 text-muted-foreground" />
                          </div>
                        )}
                        <div className="min-w-0">
                        <p className="font-medium">{opp.companyName}</p>
                        <p className="text-sm text-muted-foreground">
                          {opp.requirementTitle}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {opp.engagementType} &middot; Posted{" "}
                          {formatDate(opp.proposedAt)}
                        </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={respondingId === opp.id}
                          onClick={() => handleRespond(opp.id, "declined")}
                        >
                          Decline
                        </Button>
                        <Button
                          size="sm"
                          disabled={respondingId === opp.id}
                          onClick={() => handleRespond(opp.id, "accepted")}
                        >
                          Accept
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Recent Payouts */}
        <div>
          <h2 className="text-lg font-semibold">Recent Payouts</h2>
          <div className="mt-3 space-y-3">
            {recentPayouts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No payouts yet.</p>
            ) : (
              <>
                {recentPayouts.map((payout) => (
                  <Card key={payout.id}>
                    <CardContent className="flex items-center justify-between pt-6">
                      <div>
                        <p className="text-sm font-medium">
                          {payout.payoutNumber}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(payout.periodStart)} &mdash;{" "}
                          {formatDate(payout.periodEnd)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className={payoutStatusBadgeClass(
                            payout.status as PayoutStatus,
                          )}
                        >
                          {payoutStatusLabel[payout.status as PayoutStatus] ??
                            payout.status}
                        </Badge>
                        <p className="font-mono text-sm font-semibold">
                          {formatCurrency(payout.total, payout.currency)}
                        </p>
                        <a
                          href={`/api/payouts/${payout.id}/pdf`}
                          className="text-muted-foreground hover:text-foreground"
                          title="Download payslip"
                        >
                          <Download className="size-4" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Link
                  href="/developers/dashboard/earnings"
                  className="inline-block text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
                >
                  View all
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Recent Time Entries */}
      {recentTimeEntries.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold">Recent Time Entries</h2>
          <Card className="mt-3">
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs text-muted-foreground">
                      <th className="pb-2 pr-4 font-medium">Period</th>
                      <th className="pb-2 pr-4 font-medium">Company</th>
                      <th className="pb-2 pr-4 font-medium text-right">
                        Hours
                      </th>
                      <th className="pb-2 pr-4 font-medium">Status</th>
                      <th className="pb-2 font-medium">Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {recentTimeEntries.map((entry) => (
                      <tr key={entry.id}>
                        <td className="py-2 pr-4 font-mono text-xs">
                          {entry.period}
                        </td>
                        <td className="py-2 pr-4">{entry.companyName}</td>
                        <td className="py-2 pr-4 text-right font-mono">
                          {entry.hours}
                        </td>
                        <td className="py-2 pr-4">
                          <Badge
                            variant="outline"
                            className={timeEntryStatusBadgeClass(
                              entry.status as TimeEntryStatus,
                            )}
                          >
                            {timeEntryStatusLabel[
                              entry.status as TimeEntryStatus
                            ] ?? entry.status}
                          </Badge>
                        </td>
                        <td className="py-2 text-xs text-muted-foreground">
                          {formatDate(entry.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Link
                href="/developers/dashboard/engagements"
                className="mt-3 inline-block text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                View all
              </Link>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Submit Hours Dialog */}
      {submitEngagement && (
        <SubmitHoursDialog
          engagement={submitEngagement}
          open={!!submitEngagement}
          onOpenChange={(open) => {
            if (!open) setSubmitEngagement(null);
          }}
          onSubmitted={() => {
            setSubmitEngagement(null);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
