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

  // Convert each currency's subtotal to the display currency and sum — this is
  // exactly how the chart is computed, so the KPI cards now agree with it.
  // Falls back to the single mixed-currency number on older backends.
  const sumConverted = (
    breakdown: { currency: string; total: number }[] | undefined,
    fallback: number,
  ) =>
    breakdown && breakdown.length > 0
      ? breakdown.reduce((acc, c) => acc + convert(c.total, c.currency), 0)
      : convert(fallback, displayCurrency);

  const totalRevenueNum = useMemo(
    () => sumConverted(summary.revenueByCurrency, summary.totalRevenue),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [summary.revenueByCurrency, summary.totalRevenue, convert, displayCurrency],
  );
  const totalPaidNum = useMemo(
    () => sumConverted(summary.paidByCurrency, summary.totalPaid),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [summary.paidByCurrency, summary.totalPaid, convert, displayCurrency],
  );
  const totalOutstandingNum = useMemo(
    () => sumConverted(summary.outstandingByCurrency, summary.totalOutstanding),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [summary.outstandingByCurrency, summary.totalOutstanding, convert, displayCurrency],
  );

  const totalRevenue = formatCurrency(totalRevenueNum, displayCurrency);
  const totalPaid = formatCurrency(totalPaidNum, displayCurrency);
  const totalOutstanding = formatCurrency(totalOutstandingNum, displayCurrency);

  // Aging buckets — convert each currency's bucket and sum, matching the cards.
  const agingConverted = useMemo(() => {
    const rows = summary.agingByCurrency;
    if (rows && rows.length > 0) {
      const acc = { current: 0, d1to30: 0, d31to60: 0, d61to90: 0, d90plus: 0 };
      for (const r of rows) {
        acc.current += convert(r.current, r.currency);
        acc.d1to30 += convert(r.d1to30, r.currency);
        acc.d31to60 += convert(r.d31to60, r.currency);
        acc.d61to90 += convert(r.d61to90, r.currency);
        acc.d90plus += convert(r.d90plus, r.currency);
      }
      return acc;
    }
    const b = summary.agingBuckets;
    return {
      current: convert(b.current, displayCurrency),
      d1to30: convert(b.d1to30, displayCurrency),
      d31to60: convert(b.d31to60, displayCurrency),
      d61to90: convert(b.d61to90, displayCurrency),
      d90plus: convert(b.d90plus, displayCurrency),
    };
  }, [summary.agingByCurrency, summary.agingBuckets, convert, displayCurrency]);

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
                  {totalOutstanding} total
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
