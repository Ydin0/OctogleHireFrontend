"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Clock, Hourglass } from "lucide-react";

import type {
  DeveloperEngagement,
  DeveloperTimeEntry,
} from "@/lib/api/developer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SubmitHoursDialog } from "./submit-hours-dialog";

interface EngagementsClientProps {
  engagements: DeveloperEngagement[];
  timeEntries: DeveloperTimeEntry[];
}

const statusBadgeClass = (status: string) => {
  switch (status) {
    case "active":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-600/20";
    case "submitted":
      return "bg-amber-500/10 text-amber-700 border-amber-600/20";
    case "approved":
      return "bg-blue-500/10 text-blue-600 border-blue-600/20";
    case "rejected":
      return "bg-red-500/10 text-red-600 border-red-600/20";
    default:
      return "bg-zinc-500/10 text-zinc-600 border-zinc-600/20";
  }
};

const statusLabel: Record<string, string> = {
  active: "Active",
  pending: "Pending",
  ended: "Ended",
  submitted: "Submitted",
  approved: "Approved",
  rejected: "Rejected",
};

const formatCurrency = (amount: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);

function EngagementsClient({
  engagements,
  timeEntries,
}: EngagementsClientProps) {
  const router = useRouter();
  const [submitEngagement, setSubmitEngagement] =
    useState<DeveloperEngagement | null>(null);

  const activeEngagements = engagements.filter((e) => e.status === "active");

  const now = new Date();
  const currentPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const thisMonthEntries = timeEntries.filter(
    (e) => e.period === currentPeriod,
  );
  const thisMonthHours = thisMonthEntries.reduce((sum, e) => sum + e.hours, 0);
  const pendingEntries = timeEntries.filter((e) => e.status === "submitted");

  return (
    <>
      {/* Summary Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-mono uppercase tracking-wider">
              Active Engagements
            </CardDescription>
            <CardTitle className="text-2xl">{activeEngagements.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {activeEngagements.length > 0
              ? `${activeEngagements.length} active client project${activeEngagements.length !== 1 ? "s" : ""}`
              : "No active client projects yet."}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-mono uppercase tracking-wider">
              Hours This Month
            </CardDescription>
            <CardTitle className="font-mono text-2xl">{thisMonthHours}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {thisMonthEntries.length} submission{thisMonthEntries.length !== 1 ? "s" : ""} for{" "}
            {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-mono uppercase tracking-wider">
              Pending Approvals
            </CardDescription>
            <CardTitle className="text-2xl">{pendingEntries.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {pendingEntries.length > 0
              ? "Awaiting admin review."
              : "All submissions reviewed."}
          </CardContent>
        </Card>
      </section>

      {/* Engagements List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Briefcase className="size-4" />
            Active Engagements
          </CardTitle>
          <CardDescription>
            Your current client projects and billing details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeEngagements.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No active engagements yet. Once a company accepts your match, it will appear here.
            </p>
          ) : (
            activeEngagements.map((eng) => (
              <div
                key={eng.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{eng.companyName}</p>
                    <Badge
                      variant="outline"
                      className={statusBadgeClass(eng.status)}
                    >
                      {statusLabel[eng.status] ?? eng.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {eng.requirementTitle}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    <span className="font-mono">
                      {formatCurrency(eng.developerPayoutRate, eng.currency)}
                    </span>
                    /hr &middot; {eng.engagementType}
                  </p>
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
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Time Entry History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Hourglass className="size-4" />
            Time Entry History
          </CardTitle>
          <CardDescription>
            Your submitted hours and approval status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {timeEntries.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No time entries yet. Submit hours for an active engagement to get started.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="pb-2 pr-4 font-medium">Period</th>
                    <th className="pb-2 pr-4 font-medium">Company</th>
                    <th className="pb-2 pr-4 font-medium">Role</th>
                    <th className="pb-2 pr-4 font-medium text-right">Hours</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {timeEntries.map((entry) => (
                    <tr key={entry.id}>
                      <td className="py-2 pr-4 font-mono text-xs">
                        {entry.period}
                      </td>
                      <td className="py-2 pr-4">{entry.companyName}</td>
                      <td className="py-2 pr-4 text-muted-foreground">
                        {entry.requirementTitle}
                      </td>
                      <td className="py-2 pr-4 text-right font-mono">
                        {entry.hours}
                      </td>
                      <td className="py-2">
                        <Badge
                          variant="outline"
                          className={statusBadgeClass(entry.status)}
                        >
                          {statusLabel[entry.status] ?? entry.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

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

export { EngagementsClient };
