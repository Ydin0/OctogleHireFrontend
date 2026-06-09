"use client";

import { formatCurrency } from "../../_components/dashboard-data";

interface AgingBuckets {
  current: number;
  d1to30: number;
  d31to60: number;
  d61to90: number;
  d90plus: number;
}

interface AgingBarProps {
  buckets: AgingBuckets;
  displayCurrency: string;
}

/**
 * A 5-segment horizontal stacked bar showing how much outstanding revenue
 * sits in each aging bucket. Hand-rolled SVG — no chart-library dependency.
 */
export function InvoiceAgingBar({ buckets, displayCurrency }: AgingBarProps) {
  const total =
    buckets.current +
    buckets.d1to30 +
    buckets.d31to60 +
    buckets.d61to90 +
    buckets.d90plus;

  const segments = [
    { key: "current", label: "Current", amount: buckets.current, color: "bg-emerald-500" },
    { key: "d1to30", label: "1–30", amount: buckets.d1to30, color: "bg-amber-400" },
    { key: "d31to60", label: "31–60", amount: buckets.d31to60, color: "bg-orange-500" },
    { key: "d61to90", label: "61–90", amount: buckets.d61to90, color: "bg-rose-500" },
    { key: "d90plus", label: "90+", amount: buckets.d90plus, color: "bg-red-700" },
  ];

  return (
    <div className="space-y-2">
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
        {total > 0 ? (
          segments.map((s) => {
            const pct = (s.amount / total) * 100;
            if (pct === 0) return null;
            return (
              <div
                key={s.key}
                className={s.color}
                style={{ width: `${pct}%` }}
                title={`${s.label}: ${formatCurrency(s.amount, displayCurrency)}`}
              />
            );
          })
        ) : (
          <div className="w-full" />
        )}
      </div>
      <div className="grid grid-cols-5 gap-2 text-[10px]">
        {segments.map((s) => (
          <div key={s.key} className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span
                className={`block size-2 rounded-full ${s.color}`}
                aria-hidden
              />
              <span className="uppercase tracking-wider text-muted-foreground">
                {s.label}
              </span>
            </div>
            <p className="font-mono">
              {formatCurrency(s.amount, displayCurrency)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
