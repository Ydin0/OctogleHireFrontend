"use client";

import { Briefcase, Users, DollarSign, AlertCircle } from "lucide-react";

import type { CompanyEngagement } from "@/lib/api/companies";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EngagementRow } from "./engagement-row";

interface EngagementsClientProps {
  engagements: CompanyEngagement[];
  token: string;
}

const formatCurrency = (amount: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);

function computeMonthlyBill(engagements: CompanyEngagement[]): number {
  return engagements
    .filter((e) => e.status === "active")
    .reduce((sum, e) => {
      const hours = e.monthlyHoursCap ?? e.monthlyHoursExpected ?? 0;
      return sum + e.companyBillingRate * hours;
    }, 0);
}

function EngagementsClient({ engagements, token }: EngagementsClientProps) {
  const activeEngagements = engagements.filter((e) => e.status === "active");
  const uniqueDevIds = new Set(activeEngagements.map((e) => e.developerId));
  const predictedBill = computeMonthlyBill(engagements);
  const pendingRequestCount = engagements.filter(
    (e) => e.pendingChangeRequests > 0,
  ).length;

  return (
    <>
      {/* KPI Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-mono uppercase tracking-wider">
              Active Engagements
            </CardDescription>
            <CardTitle className="text-2xl">{activeEngagements.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {activeEngagements.length > 0
              ? `${activeEngagements.length} active engagement${activeEngagements.length !== 1 ? "s" : ""}`
              : "No active engagements yet."}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-mono uppercase tracking-wider">
              Active Developers
            </CardDescription>
            <CardTitle className="text-2xl">{uniqueDevIds.size}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {uniqueDevIds.size > 0
              ? `${uniqueDevIds.size} developer${uniqueDevIds.size !== 1 ? "s" : ""} currently working`
              : "No developers assigned yet."}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-mono uppercase tracking-wider">
              Predicted Monthly Bill
            </CardDescription>
            <CardTitle className="font-mono text-2xl">
              {formatCurrency(predictedBill)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Based on effective monthly hours and billing rates.
          </CardContent>
        </Card>

        <Card className={pendingRequestCount > 0 ? "border-amber-600/20" : undefined}>
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-mono uppercase tracking-wider">
              Pending Requests
            </CardDescription>
            <CardTitle className="text-2xl">{pendingRequestCount}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {pendingRequestCount > 0
              ? `${pendingRequestCount} engagement${pendingRequestCount !== 1 ? "s" : ""} with pending requests`
              : "No pending change requests."}
          </CardContent>
        </Card>
      </section>

      {/* Engagements List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Briefcase className="size-4" />
            Engagements
          </CardTitle>
          <CardDescription>
            All developer engagements and billing details. Click to expand.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {engagements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <Briefcase className="size-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-sm font-semibold">No engagements yet</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Engagements will appear here once developers are hired through your requirements.
              </p>
            </div>
          ) : (
            engagements.map((eng) => (
              <EngagementRow key={eng.id} engagement={eng} token={token} />
            ))
          )}
        </CardContent>
      </Card>
    </>
  );
}

export { EngagementsClient };
