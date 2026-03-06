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
        {([
          { label: "Active Engagements", value: String(activeEngagements.length), icon: Briefcase, highlight: false, mono: false },
          { label: "Active Developers", value: String(uniqueDevIds.size), icon: Users, highlight: false, mono: false },
          { label: "Predicted Monthly Bill", value: formatCurrency(predictedBill), icon: DollarSign, highlight: false, mono: true },
          { label: "Pending Requests", value: String(pendingRequestCount), icon: AlertCircle, highlight: pendingRequestCount > 0, mono: false },
        ] as const).map((kpi) => (
          <Card
            key={kpi.label}
            className={`py-4 gap-3 ${kpi.highlight ? "border-amber-500/40 bg-amber-500/5" : ""}`}
          >
            <CardHeader className="pb-2">
              <CardDescription className="text-[10px] font-mono uppercase tracking-wider">
                {kpi.label}
              </CardDescription>
              <CardTitle className={`text-2xl ${kpi.mono ? "font-mono" : ""} ${kpi.highlight ? "text-amber-600" : ""}`}>
                {kpi.value}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`flex size-8 items-center justify-center rounded-full ${kpi.highlight ? "bg-amber-500/15" : "bg-pulse/10"}`}>
                <kpi.icon className={`size-4 ${kpi.highlight ? "text-amber-600" : "text-pulse"}`} />
              </div>
            </CardContent>
          </Card>
        ))}
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
