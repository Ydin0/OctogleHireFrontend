"use client";

import { useMemo, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatCurrency } from "../../_components/dashboard-data";

interface DataPoint {
  /** YYYY-MM */
  month: string;
  amount: number;
}

interface ChartProps {
  data: DataPoint[];
  displayCurrency: string;
}

// Compact axis labels — $4.2K, $1.1M — so the y-axis never overflows/clips.
function formatCompact(n: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

// Round a max value up to a clean "nice" number for the top gridline.
function niceCeil(value: number): number {
  if (value <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(value)));
  const n = value / pow;
  const niceN = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return niceN * pow;
}

const TICK_COUNT = 4; // horizontal gridlines (excluding baseline)

/**
 * Interactive monthly-revenue bar chart — last 12 months. Backfills missing
 * months with zero so the x-axis is continuous. Hover (or tap) a column to see
 * the exact figure; a header summarises total, average, and month-over-month.
 */
export function InvoiceMonthlyChart({ data, displayCurrency }: ChartProps) {
  const [active, setActive] = useState<number | null>(null);

  const series = useMemo(() => {
    const now = new Date();
    const months: { month: string; amount: number; label: string; full: string }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const match = data.find((p) => p.month === key);
      months.push({
        month: key,
        amount: match?.amount ?? 0,
        label: d.toLocaleDateString("en-US", { month: "short" }),
        full: d.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      });
    }
    return months;
  }, [data]);

  const rawMax = Math.max(0, ...series.map((s) => s.amount));
  const niceMax = niceCeil(rawMax);

  const total = series.reduce((sum, s) => sum + s.amount, 0);
  const monthsWithRevenue = series.filter((s) => s.amount > 0).length;
  const average = monthsWithRevenue > 0 ? total / monthsWithRevenue : 0;

  // Month-over-month: latest vs previous month.
  const latest = series[series.length - 1]?.amount ?? 0;
  const prev = series[series.length - 2]?.amount ?? 0;
  const momPct = prev > 0 ? ((latest - prev) / prev) * 100 : null;

  const ticks = Array.from({ length: TICK_COUNT + 1 }, (_, i) => (niceMax / TICK_COUNT) * i);

  return (
    <div>
      {/* ── Summary header ─────────────────────────────────────────── */}
      <div className="mb-5 flex flex-wrap items-end gap-x-8 gap-y-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Total
          </p>
          <p className="mt-0.5 font-mono text-xl font-semibold">
            {formatCurrency(total, displayCurrency)}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Avg / active month
          </p>
          <p className="mt-0.5 font-mono text-sm font-medium text-muted-foreground">
            {formatCurrency(average, displayCurrency)}
          </p>
        </div>
        {momPct !== null && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              vs last month
            </p>
            <p
              className={cn(
                "mt-0.5 inline-flex items-center gap-1 font-mono text-sm font-medium",
                momPct >= 0 ? "text-emerald-500" : "text-rose-500",
              )}
            >
              {momPct >= 0 ? (
                <TrendingUp className="size-3.5" />
              ) : (
                <TrendingDown className="size-3.5" />
              )}
              {momPct >= 0 ? "+" : ""}
              {momPct.toFixed(1)}%
            </p>
          </div>
        )}
      </div>

      {/* ── Plot ───────────────────────────────────────────────────── */}
      <div className="flex gap-3">
        {/* y-axis labels — own column so they never clip */}
        <div className="relative w-14 shrink-0" style={{ height: 220 }}>
          {ticks.map((t, i) => (
            <span
              key={i}
              className="absolute right-0 -translate-y-1/2 font-mono text-[10px] tabular-nums text-muted-foreground/60"
              style={{ bottom: `${(i / TICK_COUNT) * 100}%` }}
            >
              {formatCompact(t, displayCurrency)}
            </span>
          ))}
        </div>

        {/* bars + gridlines */}
        <div className="relative min-w-0 flex-1" style={{ height: 220 }}>
          {/* gridlines */}
          {ticks.map((t, i) => (
            <div
              key={i}
              className={cn(
                "absolute inset-x-0 border-t",
                i === 0 ? "border-border" : "border-border/40 border-dashed",
              )}
              style={{ bottom: `${(i / TICK_COUNT) * 100}%` }}
            />
          ))}

          {/* columns */}
          <div className="absolute inset-0 flex items-end">
            {series.map((s, i) => {
              const pct = niceMax > 0 ? (s.amount / niceMax) * 100 : 0;
              const isActive = active === i;
              const isLast = i === series.length - 1;
              return (
                <button
                  type="button"
                  key={s.month}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  onClick={() => setActive((cur) => (cur === i ? null : i))}
                  className="group relative flex h-full flex-1 items-end justify-center outline-none"
                  aria-label={`${s.full}: ${formatCurrency(s.amount, displayCurrency)}`}
                >
                  {/* hover column highlight */}
                  <span
                    className={cn(
                      "absolute inset-x-0.5 bottom-0 top-0 rounded-md transition-colors",
                      isActive ? "bg-pulse/8" : "bg-transparent",
                    )}
                  />

                  {/* the bar */}
                  <span
                    className={cn(
                      "relative w-[62%] max-w-9 rounded-t-[3px] transition-[filter,opacity] duration-150",
                      isLast
                        ? "bg-gradient-to-t from-pulse/70 to-pulse"
                        : "bg-gradient-to-t from-pulse/35 to-pulse/65",
                      active !== null && !isActive && "opacity-40",
                    )}
                    style={{ height: `${Math.max(pct, s.amount > 0 ? 1.5 : 0)}%` }}
                  />

                  {/* tooltip */}
                  {isActive && (
                    <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-border bg-popover px-2.5 py-1.5 text-center shadow-md">
                      <p className="font-mono text-xs font-semibold text-foreground">
                        {formatCurrency(s.amount, displayCurrency)}
                      </p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {s.full}
                      </p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* x-axis labels — aligned under the bars column */}
      <div className="mt-2 flex gap-3">
        <div className="w-14 shrink-0" />
        <div className="flex min-w-0 flex-1">
          {series.map((s, i) => (
            <span
              key={s.month}
              className={cn(
                "flex-1 text-center text-[11px] transition-colors",
                active === i ? "font-medium text-foreground" : "text-muted-foreground/70",
              )}
            >
              {s.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
