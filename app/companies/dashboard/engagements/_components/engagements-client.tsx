"use client";

import { Briefcase, DollarSign, Users } from "lucide-react";

import type { CompanyEngagement } from "@/lib/api/companies";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface EngagementsClientProps {
  engagements: CompanyEngagement[];
}

const statusBadgeClass = (status: string) => {
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

const statusLabel: Record<string, string> = {
  active: "Active",
  pending: "Pending",
  ended: "Ended",
};

const formatCurrency = (amount: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

function computeMonthlyBill(engagements: CompanyEngagement[]): number {
  return engagements
    .filter((e) => e.status === "active")
    .reduce((sum, e) => {
      const hours =
        e.engagementType === "full-time"
          ? 160
          : e.engagementType === "part-time"
            ? 80
            : 0;
      return sum + e.companyBillingRate * hours;
    }, 0);
}

function EngagementsClient({ engagements }: EngagementsClientProps) {
  const activeEngagements = engagements.filter((e) => e.status === "active");
  const uniqueDevIds = new Set(activeEngagements.map((e) => e.developerId));
  const predictedBill = computeMonthlyBill(engagements);

  return (
    <>
      {/* KPI Cards */}
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
            Based on full-time (160hr) and part-time (80hr) rates.
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
            All developer engagements and billing details.
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
              <div
                key={eng.id}
                className="flex items-center justify-between gap-3 rounded-md border p-3"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Avatar className="size-9 shrink-0">
                    {eng.developerAvatar && (
                      <AvatarImage src={eng.developerAvatar} alt={eng.developerName} />
                    )}
                    <AvatarFallback className="text-xs">
                      {getInitials(eng.developerName || "D")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">{eng.developerName}</p>
                      <Badge
                        variant="outline"
                        className={statusBadgeClass(eng.status)}
                      >
                        {statusLabel[eng.status] ?? eng.status}
                      </Badge>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {eng.developerRole}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {eng.requirementTitle}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-mono text-sm">
                    {formatCurrency(eng.companyBillingRate, eng.currency)}/hr
                  </p>
                  <p className="text-xs text-muted-foreground">{eng.engagementType}</p>
                  {eng.startDate && (
                    <p className="text-xs text-muted-foreground">
                      Since {new Date(eng.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </>
  );
}

export { EngagementsClient };
