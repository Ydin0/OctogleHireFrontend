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
import { formatCurrency } from "../../_components/dashboard-data";
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
  const { displayCurrency, convert, loading: ratesLoading } = useAdminCurrency();

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

  // Convert + sum: each currency bucket → display currency. This is what
  // makes the sidebar toggle correct for headline KPIs.
  const aggregates = useMemo(() => {
    if (!summary) {
      return {
        revenuePaid: 0,
        revenueOutstanding: 0,
        revenueOverdue: 0,
        revenueThisMonth: 0,
        invoiceCount: 0,
        overdueCount: 0,
        payoutsPaid: 0,
        payoutsPending: 0,
        payoutCount: 0,
        mrr: 0,
        monthlyMargin: 0,
        marginPercent: 0,
        predictedNextMonth: 0,
        annualizedRevenue: 0,
        annualizedMargin: 0,
        realizedMargin: 0,
        realizedMarginPercent: 0,
      };
    }

    let revenuePaid = 0,
      revenueOutstanding = 0,
      revenueOverdue = 0,
      revenueThisMonth = 0,
      invoiceCount = 0,
      overdueCount = 0,
      payoutsPaid = 0,
      payoutsPending = 0,
      payoutCount = 0,
      mrr = 0,
      monthlyPayout = 0,
      predictedNextMonth = 0,
      annualizedRevenue = 0,
      annualizedMargin = 0;

    for (const [cur, b] of Object.entries(summary.invoicesByCurrency)) {
      revenuePaid += convert(b.paid, cur);
      revenueOutstanding += convert(b.outstanding, cur);
      revenueOverdue += convert(b.overdue, cur);
      revenueThisMonth += convert(b.thisMonth, cur);
      invoiceCount += b.invoiceCount;
      overdueCount += b.overdueCount;
    }

    for (const [cur, b] of Object.entries(summary.payoutsByCurrency)) {
      payoutsPaid += convert(b.paid, cur);
      payoutsPending += convert(b.pending, cur);
      payoutCount += b.count;
    }

    for (const [cur, b] of Object.entries(summary.currencyBreakdown)) {
      mrr += convert(b.monthlyBilling, cur);
      monthlyPayout += convert(b.monthlyPayout, cur);
      predictedNextMonth += convert(b.predictedNextMonth, cur);
      annualizedRevenue += convert(b.annualizedRevenue, cur);
      annualizedMargin += convert(b.annualizedMargin, cur);
    }

    const monthlyMargin = mrr - monthlyPayout;
    const marginPercent = mrr > 0 ? (monthlyMargin / mrr) * 100 : 0;
    const realizedMargin = revenuePaid - payoutsPaid;
    const realizedMarginPercent =
      revenuePaid > 0 ? (realizedMargin / revenuePaid) * 100 : 0;

    return {
      revenuePaid,
      revenueOutstanding,
      revenueOverdue,
      revenueThisMonth,
      invoiceCount,
      overdueCount,
      payoutsPaid,
      payoutsPending,
      payoutCount,
      mrr,
      monthlyMargin,
      marginPercent,
      predictedNextMonth,
      annualizedRevenue,
      annualizedMargin,
      realizedMargin,
      realizedMarginPercent,
    };
  }, [summary, convert]);

  const trendMaxNative = useMemo(
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

  const fmtAgg = (amount: number) => formatCurrency(amount, displayCurrency);

  const kpis = [
    {
      label: "Realized Revenue",
      value: fmtAgg(aggregates.revenuePaid),
      hint: `${aggregates.invoiceCount} invoices total`,
      icon: DollarSign,
      tone: "emerald" as const,
    },
    {
      label: "Outstanding",
      value: fmtAgg(aggregates.revenueOutstanding),
      hint:
        aggregates.overdueCount > 0
          ? `${aggregates.overdueCount} overdue · ${fmtAgg(aggregates.revenueOverdue)}`
          : "All on schedule",
      icon: Clock,
      tone: aggregates.overdueCount > 0 ? "amber" : "muted",
    },
    {
      label: "MRR (Active)",
      value: fmtAgg(aggregates.mrr),
      hint: `${summary.engagements.activeCount} active engagements`,
      icon: TrendingUp,
      tone: "blue" as const,
    },
    {
      label: "Predicted Next Month",
      value: fmtAgg(aggregates.predictedNextMonth),
      hint: `${summary.engagements.upcomingStartCount} upcoming starts`,
      icon: Sparkles,
      tone: "indigo" as const,
    },
  ];

  const marginCards = [
    {
      label: "Realized Margin",
      value: fmtAgg(aggregates.realizedMargin),
      hint: `${aggregates.realizedMarginPercent.toFixed(1)}% on paid`,
      icon: Wallet,
    },
    {
      label: "Projected Margin / Mo",
      value: fmtAgg(aggregates.monthlyMargin),
      hint: `${aggregates.marginPercent.toFixed(1)}% on active`,
      icon: Percent,
    },
    {
      label: "Annualized Revenue",
      value: fmtAgg(aggregates.annualizedRevenue),
      hint: "Active × 12 months",
      icon: LineChart,
    },
    {
      label: "Annualized Margin",
      value: fmtAgg(aggregates.annualizedMargin),
      hint: "Projected gross profit",
      icon: Banknote,
    },
  ];

  const opsCards = [
    {
      label: "Paid Out to Developers",
      value: fmtAgg(aggregates.payoutsPaid),
      hint: `${aggregates.payoutCount} payouts total`,
      icon: CreditCard,
    },
    {
      label: "Payouts Pending",
      value: fmtAgg(aggregates.payoutsPending),
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
        <div className="flex items-center gap-2">
          {ratesLoading && (
            <Badge variant="outline" className="text-[10px]">
              Loading rates…
            </Badge>
          )}
          <Badge variant="outline" className="w-fit text-[10px] font-mono">
            Aggregates in {displayCurrency}
          </Badge>
        </div>
      </div>

      {/* Headline KPIs (in displayCurrency) */}
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

      {/* Revenue trend (raw native amounts — chart shows relative shape) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Revenue Trend</CardTitle>
            <p className="text-xs text-muted-foreground">
              Last 12 months · invoiced vs paid (raw totals across currencies)
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
                        height: `${(t.invoiced / trendMaxNative) * 100}%`,
                        minHeight: t.invoiced > 0 ? 2 : 0,
                      }}
                      title={`Invoiced: ${t.invoiced.toLocaleString()}`}
                    />
                    <div
                      className="w-full rounded-t-sm bg-emerald-500/70 transition-all group-hover:bg-emerald-500"
                      style={{
                        height: `${(t.paid / trendMaxNative) * 100}%`,
                        minHeight: t.paid > 0 ? 2 : 0,
                      }}
                      title={`Paid: ${t.paid.toLocaleString()}`}
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

      {/* Margin cards (in displayCurrency) */}
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

      {/* Bottom row: top engagements + currency breakdown (NATIVE currency) */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Top Active Engagements</CardTitle>
            <p className="text-xs text-muted-foreground">
              Highest projected monthly revenue · shown in each engagement&apos;s
              native currency.
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
                      <p className="text-[10px] capitalize text-muted-foreground">
                        {e.engagementType.replace(/-/g, " ")} ·{" "}
                        {e.monthlyHoursExpected ?? e.monthlyHoursCap ?? 0}h/mo
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm font-semibold">
                        {formatCurrency(e.monthlyValue, e.currency)}/mo
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        margin {formatCurrency(e.monthlyMargin, e.currency)}
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
              Active engagement currency mix · native amounts.
            </p>
          </CardHeader>
          <CardContent>
            {currencyEntries.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No active engagements.
              </p>
            ) : (
              <div className="space-y-2.5">
                {currencyEntries.map(([cur, vals]) => (
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
                      {formatCurrency(vals.monthlyBilling, cur)}/mo
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      margin {formatCurrency(vals.monthlyMargin, cur)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Status banner if overdue */}
      {aggregates.overdueCount > 0 && (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="size-5 text-amber-600" />
            <div className="flex-1">
              <p className="text-sm font-medium">
                {aggregates.overdueCount} invoice
                {aggregates.overdueCount === 1 ? "" : "s"} overdue
              </p>
              <p className="text-xs text-muted-foreground">
                Total {fmtAgg(aggregates.revenueOverdue)} past due.
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
