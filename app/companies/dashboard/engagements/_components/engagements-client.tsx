"use client";

import { Briefcase, Users, DollarSign, AlertCircle } from "lucide-react";

import type { CompanyEngagement } from "@/lib/api/companies";
import { Card, CardContent } from "@/components/ui/card";
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
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold">Engagements</h1>
          <p className="text-sm text-muted-foreground">
            All developer engagements and billing details.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {([
          { label: "Active Engagements", value: String(activeEngagements.length), icon: Briefcase, highlight: false, mono: false },
          { label: "Active Developers", value: String(uniqueDevIds.size), icon: Users, highlight: false, mono: false },
          { label: "Predicted Monthly Bill", value: formatCurrency(predictedBill), icon: DollarSign, highlight: false, mono: true },
          { label: "Pending Requests", value: String(pendingRequestCount), icon: AlertCircle, highlight: pendingRequestCount > 0, mono: false },
        ] as const).map((kpi) => (
          <Card key={kpi.label} className={kpi.highlight ? "border-amber-500/40 bg-amber-500/5" : ""}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`flex size-8 items-center justify-center rounded-full ${kpi.highlight ? "bg-amber-500/15" : "bg-accent"}`}>
                  <kpi.icon className={`size-4 ${kpi.highlight ? "text-amber-600" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{kpi.label}</p>
                  <p className={`text-lg font-semibold ${kpi.mono ? "font-mono" : ""} ${kpi.highlight ? "text-amber-600" : ""}`}>{kpi.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Engagements List */}
      <Card>
        <CardContent className="space-y-3 pt-6">
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
