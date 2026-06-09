"use client";

import { useMemo } from "react";

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

const CHART_WIDTH = 720;
const CHART_HEIGHT = 200;
const PAD_LEFT = 50;
const PAD_RIGHT = 12;
const PAD_TOP = 12;
const PAD_BOTTOM = 28;

/**
 * Hand-rolled SVG bar chart — last 12 months of revenue. We backfill missing
 * months with zero so the x-axis is always continuous and aligned with
 * "today minus 11 months" through "this month".
 */
export function InvoiceMonthlyChart({ data, displayCurrency }: ChartProps) {
  const series = useMemo(() => {
    // Backfill every month in [today - 11 months, today].
    const now = new Date();
    const months: { month: string; amount: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const match = data.find((p) => p.month === month);
      months.push({ month, amount: match?.amount ?? 0 });
    }
    return months;
  }, [data]);

  const max = Math.max(1, ...series.map((s) => s.amount));
  const innerW = CHART_WIDTH - PAD_LEFT - PAD_RIGHT;
  const innerH = CHART_HEIGHT - PAD_TOP - PAD_BOTTOM;
  const slot = innerW / series.length;
  const barW = slot * 0.62;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className="w-full min-w-[640px]"
        role="img"
        aria-label="Monthly revenue, last 12 months"
      >
        {/* y-axis baseline */}
        <line
          x1={PAD_LEFT}
          x2={CHART_WIDTH - PAD_RIGHT}
          y1={PAD_TOP + innerH}
          y2={PAD_TOP + innerH}
          stroke="currentColor"
          strokeOpacity={0.15}
        />
        {/* gridlines + y labels (3 ticks) */}
        {[0.5, 1].map((t) => (
          <g key={t}>
            <line
              x1={PAD_LEFT}
              x2={CHART_WIDTH - PAD_RIGHT}
              y1={PAD_TOP + innerH * (1 - t)}
              y2={PAD_TOP + innerH * (1 - t)}
              stroke="currentColor"
              strokeOpacity={0.08}
              strokeDasharray="3 3"
            />
            <text
              x={PAD_LEFT - 8}
              y={PAD_TOP + innerH * (1 - t) + 3}
              textAnchor="end"
              fontSize={9}
              fill="currentColor"
              fillOpacity={0.5}
              fontFamily="ui-monospace, monospace"
            >
              {formatCurrency(max * t, displayCurrency)}
            </text>
          </g>
        ))}

        {/* bars */}
        {series.map((s, i) => {
          const x = PAD_LEFT + slot * i + (slot - barW) / 2;
          const h = (s.amount / max) * innerH;
          const y = PAD_TOP + (innerH - h);
          const isLast = i === series.length - 1;
          return (
            <g key={s.month}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={Math.max(0, h)}
                fill="currentColor"
                fillOpacity={isLast ? 0.9 : 0.55}
                rx={2}
              >
                <title>
                  {s.month}: {formatCurrency(s.amount, displayCurrency)}
                </title>
              </rect>
            </g>
          );
        })}

        {/* x labels — abbreviated month */}
        {series.map((s, i) => {
          const [y, m] = s.month.split("-");
          const label = new Date(Number(y), Number(m) - 1, 1).toLocaleDateString(
            "en-US",
            { month: "short" },
          );
          return (
            <text
              key={s.month}
              x={PAD_LEFT + slot * i + slot / 2}
              y={CHART_HEIGHT - 8}
              textAnchor="middle"
              fontSize={9}
              fill="currentColor"
              fillOpacity={0.5}
            >
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
