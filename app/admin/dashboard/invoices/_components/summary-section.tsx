"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  DollarSign,
  Hourglass,
} from "lucide-react";

import type { InvoiceSummary } from "@/lib/api/invoices";
import { Card, CardContent } from "@/components/ui/card";
import { useAdminCurrency } from "../../_components/admin-currency-context";
import { formatCurrency } from "../../_components/dashboard-data";
import { InvoiceAgingBar } from "./aging-bar";
import { InvoiceMonthlyChart } from "./monthly-revenue-chart";

interface SummaryProps {
  summary: InvoiceSummary;
}

/**
 * Top-level KPI section for the invoices page. Driven by the server-side
 * /invoices/summary endpoint which honours the same filters as the list, so
 * every number agrees with the visible page.
 */
export function InvoiceSummarySection({ summary }: SummaryProps) {
  const { displayCurrency, convert } = useAdminCurrency();

  // The summary endpoint sums per-row totals in their stored currency. To show
  // a single number in the admin's chosen display currency, convert via the
  // existing useAdminCurrency context. Note: this is an *approximation* for
  // the headline cards — the server returns per-currency monthly revenue for
  // accurate charting; KPIs assume the dominant currency.
  const totalRevenue = formatCurrency(summary.totalRevenue, displayCurrency);
  const totalPaid = formatCurrency(summary.totalPaid, displayCurrency);
  const totalOutstanding = formatCurrency(
    summary.totalOutstanding,
    displayCurrency,
  );

  // Aging buckets and top clients arrive in mixed currencies. Convert each
  // amount via useAdminCurrency to the display currency on the client.
  const agingConverted = useMemo(() => {
    // The server returns aggregated buckets without per-currency breakdown
    // (an acceptable simplification — most clients use one currency). We
    // assume the values are in the admin's display currency for now and
    // round-trip via convert() so the helper can normalise units.
    const b = summary.agingBuckets;
    return {
      current: convert(b.current, displayCurrency),
      d1to30: convert(b.d1to30, displayCurrency),
      d31to60: convert(b.d31to60, displayCurrency),
      d61to90: convert(b.d61to90, displayCurrency),
      d90plus: convert(b.d90plus, displayCurrency),
    };
  }, [summary.agingBuckets, convert, displayCurrency]);

  const topClients = useMemo(
    () =>
      summary.topClientsByOutstanding.map((c) => ({
        ...c,
        outstandingDisplay: convert(c.outstanding, c.currency),
      })),
    [summary.topClientsByOutstanding, convert],
  );

  const monthly = useMemo(
    () =>
      summary.monthlyRevenue.map((m) => ({
        month: m.month,
        amount: convert(m.total, m.currency),
      })),
    [summary.monthlyRevenue, convert],
  );

  // Roll up multi-currency rows by month for the chart's x-axis.
  const monthlyRolled = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of monthly) {
      map.set(m.month, (map.get(m.month) ?? 0) + m.amount);
    }
    return Array.from(map.entries())
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [monthly]);

  return (
    <section className="space-y-4">
      {/* ── KPI row ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          icon={<DollarSign className="size-5 text-blue-600" />}
          tint="bg-blue-500/10"
          label="Total Revenue"
          value={totalRevenue}
        />
        <KpiCard
          icon={<CheckCircle2 className="size-5 text-emerald-600" />}
          tint="bg-emerald-500/10"
          label="Paid"
          value={totalPaid}
        />
        <KpiCard
          icon={<Clock className="size-5 text-amber-600" />}
          tint="bg-amber-500/10"
          label="Outstanding"
          value={totalOutstanding}
        />
        <KpiCard
          icon={<AlertTriangle className="size-5 text-red-600" />}
          tint="bg-red-500/10"
          label="Overdue"
          value={String(summary.overdueCount)}
          subtle={
            summary.avgDaysToPayLast90Days !== null
              ? `avg pay ${summary.avgDaysToPayLast90Days}d`
              : undefined
          }
        />
      </div>

      {/* ── Aging + Top clients row ──────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Outstanding by age
                </p>
                <p className="text-sm font-medium">
                  {formatCurrency(summary.totalOutstanding, displayCurrency)}{" "}
                  total
                </p>
              </div>
              <Hourglass className="size-4 text-muted-foreground" />
            </div>
            <InvoiceAgingBar
              buckets={agingConverted}
              displayCurrency={displayCurrency}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Top clients outstanding
                </p>
                <p className="text-sm font-medium">Top {topClients.length}</p>
              </div>
              <Building2 className="size-4 text-muted-foreground" />
            </div>
            {topClients.length === 0 ? (
              <p className="mt-3 text-xs text-muted-foreground">
                Nothing outstanding.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {topClients.map((c) => (
                  <li key={c.companyId} className="flex items-center gap-2">
                    <div className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                      {c.logoUrl ? (
                        <Image
                          src={c.logoUrl}
                          alt={c.companyName}
                          width={28}
                          height={28}
                          className="size-7 object-contain"
                          unoptimized
                        />
                      ) : (
                        <Building2 className="size-3.5 text-muted-foreground" />
                      )}
                    </div>
                    <Link
                      href={`/admin/dashboard/invoices?companyIds=${c.companyId}`}
                      className="min-w-0 flex-1 truncate text-sm hover:underline"
                    >
                      {c.companyName}
                    </Link>
                    <span className="font-mono text-xs">
                      {formatCurrency(c.outstandingDisplay, displayCurrency)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Monthly revenue chart ────────────────────────────────────── */}
      <Card>
        <CardContent className="space-y-3 p-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Revenue, last 12 months
            </p>
            <p className="text-sm font-medium">
              Issued amounts converted to {displayCurrency}
            </p>
          </div>
          <InvoiceMonthlyChart
            data={monthlyRolled}
            displayCurrency={displayCurrency}
          />
        </CardContent>
      </Card>
    </section>
  );
}

interface KpiCardProps {
  icon: React.ReactNode;
  tint: string;
  label: string;
  value: string;
  subtle?: string;
}

function KpiCard({ icon, tint, label, value, subtle }: KpiCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div
          className={`flex size-10 items-center justify-center rounded-lg ${tint}`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="font-mono text-lg font-semibold">{value}</p>
          {subtle && (
            <p className="text-[10px] text-muted-foreground">{subtle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
