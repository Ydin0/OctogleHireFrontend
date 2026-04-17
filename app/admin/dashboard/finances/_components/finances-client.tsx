"use client";

import { useMemo } from "react";
import {
  AlertTriangle,
  Banknote,
  CalendarClock,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Handshake,
  LineChart,
  Percent,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";

import type {
  AdminEngagement,
  AdminFinanceSummary,
  RevenueTrendPoint,
} from "@/lib/api/admin";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminCurrency } from "../../_components/admin-currency-context";

interface FinancesClientProps {
  summary: AdminFinanceSummary | null;
  trend: RevenueTrendPoint[];
  engagements: AdminEngagement[];
}

const monthLabel = (key: string) => {
  const [y, m] = key.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString("en-US", { month: "short" });
};

function FinancesClient({ summary, trend, engagements }: FinancesClientProps) {
  const { formatDisplay, displayCurrency } = useAdminCurrency();

  const topEngagements = useMemo(() => {
    return [...engagements]
      .filter((e) => e.status === "active")
      .map((e) => ({
        ...e,
        monthlyValue:
          e.companyBillingRate *
          (e.monthlyHoursExpected ?? e.monthlyHoursCap ?? 0),
        monthlyMargin:
          (e.companyBillingRate - e.developerPayoutRate) *
          (e.monthlyHoursExpected ?? e.monthlyHoursCap ?? 0),
      }))
      .sort((a, b) => b.monthlyValue - a.monthlyValue)
      .slice(0, 6);
  }, [engagements]);

  const trendMax = useMemo(
    () => Math.max(...trend.map((t) => Math.max(t.invoiced, t.paid)), 1),
    [trend],
  );

  if (!summary) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Failed to load finance data.
        </p>
      </div>
    );
  }

  const kpis = [
    {
      label: "Realized Revenue",
      value: formatDisplay(summary.revenue.paid, "USD"),
      hint: `${summary.revenue.invoiceCount} invoices total`,
      icon: DollarSign,
      tone: "emerald" as const,
    },
    {
      label: "Outstanding",
      value: formatDisplay(summary.revenue.outstanding, "USD"),
      hint:
        summary.revenue.overdueCount > 0
          ? `${summary.revenue.overdueCount} overdue · ${formatDisplay(summary.revenue.overdue, "USD")}`
          : "All on schedule",
      icon: Clock,
      tone: summary.revenue.overdueCount > 0 ? "amber" : "muted",
    },
    {
      label: "MRR (Active)",
      value: formatDisplay(summary.engagements.monthlyBilling, "USD"),
      hint: `${summary.engagements.activeCount} active engagements`,
      icon: TrendingUp,
      tone: "blue" as const,
    },
    {
      label: "Predicted Next Month",
      value: formatDisplay(summary.forecast.predictedNextMonthRevenue, "USD"),
      hint: `${summary.engagements.upcomingStartCount} upcoming starts`,
      icon: Sparkles,
      tone: "indigo" as const,
    },
  ];

  const marginCards = [
    {
      label: "Realized Margin",
      value: formatDisplay(summary.margin.realized, "USD"),
      hint: `${summary.margin.realizedPercent.toFixed(1)}% on paid`,
      icon: Wallet,
    },
    {
      label: "Projected Margin / Mo",
      value: formatDisplay(summary.margin.projected, "USD"),
      hint: `${summary.margin.projectedPercent.toFixed(1)}% on active`,
      icon: Percent,
    },
    {
      label: "Annualized Revenue",
      value: formatDisplay(summary.forecast.annualizedRevenue, "USD"),
      hint: "Active × 12 months",
      icon: LineChart,
    },
    {
      label: "Annualized Margin",
      value: formatDisplay(summary.forecast.annualizedMargin, "USD"),
      hint: "Projected gross profit",
      icon: Banknote,
    },
  ];

  const opsCards = [
    {
      label: "Paid Out to Developers",
      value: formatDisplay(summary.payouts.paid, "USD"),
      hint: `${summary.payouts.count} payouts total`,
      icon: CreditCard,
    },
    {
      label: "Payouts Pending",
      value: formatDisplay(summary.payouts.pending, "USD"),
      hint: "Owed to developers",
      icon: Clock,
    },
    {
      label: "Active Engagements",
      value: String(summary.engagements.activeCount),
      hint: `${summary.engagements.pendingCount} pending start`,
      icon: Handshake,
      mono: false,
    },
    {
      label: "Upcoming Starts (30d)",
      value: String(summary.engagements.upcomingStartCount),
      hint: "Next 30 days",
      icon: CalendarClock,
      mono: false,
    },
  ];

  const toneClass = (tone: string) => {
    switch (tone) {
      case "emerald":
        return { bg: "bg-emerald-500/10", text: "text-emerald-600" };
      case "amber":
        return { bg: "bg-amber-500/10", text: "text-amber-600" };
      case "blue":
        return { bg: "bg-blue-500/10", text: "text-blue-600" };
      case "indigo":
        return { bg: "bg-indigo-500/10", text: "text-indigo-600" };
      default:
        return { bg: "bg-muted", text: "text-muted-foreground" };
    }
  };

  const currencyEntries = Object.entries(summary.currencyBreakdown).sort(
    (a, b) => b[1].monthlyBilling - a[1].monthlyBilling,
  );

  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold">Finances</h1>
          <p className="text-sm text-muted-foreground">
            Revenue, margin, and forecast across the platform.
          </p>
        </div>
        <Badge variant="outline" className="w-fit text-[10px] font-mono">
          Display: {displayCurrency}
        </Badge>
      </div>

      {/* Headline KPIs */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const tone = toneClass(kpi.tone);
          return (
            <Card key={kpi.label}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${tone.bg}`}
                  >
                    <kpi.icon className={`size-5 ${tone.text}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {kpi.label}
                    </p>
                    <p className="font-mono text-lg font-semibold">{kpi.value}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {kpi.hint}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Revenue trend */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Revenue Trend</CardTitle>
            <p className="text-xs text-muted-foreground">
              Last 12 months · invoiced vs paid
            </p>
          </div>
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-pulse" /> Invoiced
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-emerald-500" /> Paid
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {trend.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No invoices yet.
            </p>
          ) : (
            <div className="flex h-48 items-end gap-2">
              {trend.map((t) => (
                <div
                  key={t.month}
                  className="group flex flex-1 flex-col items-center gap-1.5"
                >
                  <div className="flex h-full w-full flex-col justify-end gap-0.5">
                    <div
                      className="w-full rounded-t-sm bg-pulse/30 transition-all group-hover:bg-pulse/50"
                      style={{
                        height: `${(t.invoiced / trendMax) * 100}%`,
                        minHeight: t.invoiced > 0 ? 2 : 0,
                      }}
                      title={`Invoiced: ${formatDisplay(t.invoiced, "USD")}`}
                    />
                    <div
                      className="w-full rounded-t-sm bg-emerald-500/70 transition-all group-hover:bg-emerald-500"
                      style={{
                        height: `${(t.paid / trendMax) * 100}%`,
                        minHeight: t.paid > 0 ? 2 : 0,
                      }}
                      title={`Paid: ${formatDisplay(t.paid, "USD")}`}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {monthLabel(t.month)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Margin cards */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {marginCards.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-pulse/10">
                  <kpi.icon className="size-4 text-pulse" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {kpi.label}
                  </p>
                  <p className="font-mono text-base font-semibold">{kpi.value}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {kpi.hint}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Operations */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {opsCards.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <kpi.icon className="size-4 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {kpi.label}
                  </p>
                  <p
                    className={`text-base font-semibold ${kpi.mono === false ? "" : "font-mono"}`}
                  >
                    {kpi.value}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {kpi.hint}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Bottom row: top engagements + currency breakdown */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Top Active Engagements</CardTitle>
            <p className="text-xs text-muted-foreground">
              Highest projected monthly revenue.
            </p>
          </CardHeader>
          <CardContent>
            {topEngagements.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No active engagements.
              </p>
            ) : (
              <div className="space-y-3">
                {topEngagements.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center gap-3 rounded-md border border-border/60 px-3 py-2.5"
                  >
                    {e.companyLogoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={e.companyLogoUrl}
                        alt=""
                        className="size-8 shrink-0 rounded-md object-contain"
                      />
                    ) : (
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground">
                        {(e.companyName ?? "?")[0]?.toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {e.developerName}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {e.companyName} · {e.requirementTitle}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm font-semibold">
                        {formatDisplay(e.monthlyValue, e.currency)}/mo
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        margin {formatDisplay(e.monthlyMargin, e.currency)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">By Currency</CardTitle>
            <p className="text-xs text-muted-foreground">
              Active engagement currency mix.
            </p>
          </CardHeader>
          <CardContent>
            {currencyEntries.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No active engagements.
              </p>
            ) : (
              <div className="space-y-2.5">
                {currencyEntries.map(([cur, vals]) => {
                  const margin = vals.monthlyBilling - vals.monthlyPayout;
                  return (
                    <div
                      key={cur}
                      className="rounded-md border border-border/60 px-3 py-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-semibold uppercase tracking-wider">
                          {cur}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {vals.count} eng.
                        </span>
                      </div>
                      <p className="mt-1 font-mono text-sm font-semibold">
                        {formatDisplay(vals.monthlyBilling, cur)}/mo
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        margin {formatDisplay(margin, cur)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Status banner if overdue */}
      {summary.revenue.overdueCount > 0 && (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="size-5 text-amber-600" />
            <div className="flex-1">
              <p className="text-sm font-medium">
                {summary.revenue.overdueCount} invoice
                {summary.revenue.overdueCount === 1 ? "" : "s"} overdue
              </p>
              <p className="text-xs text-muted-foreground">
                Total {formatDisplay(summary.revenue.overdue, "USD")} past due.
              </p>
            </div>
            <CheckCircle2 className="size-4 text-muted-foreground/40" />
          </CardContent>
        </Card>
      )}
    </>
  );
}

export { FinancesClient };
