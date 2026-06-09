"use client";

import { useMemo, useRef, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";

interface BucketPoint {
  bucket: string;
  applied: number;
  approved: number;
  rejected: number;
}

interface ApplicantsTrendChartProps {
  data: BucketPoint[];
  granularity: "day" | "week" | "month";
}

const CHART_WIDTH = 760;
const CHART_HEIGHT = 240;
const PAD_LEFT = 36;
const PAD_RIGHT = 16;
const PAD_TOP = 16;
const PAD_BOTTOM = 32;

const COLORS = {
  applied: { solid: "rgb(56 189 248)", soft: "rgb(56 189 248 / 0.6)" },   // sky-400
  approved: { solid: "rgb(16 185 129)", soft: "rgb(16 185 129 / 0.6)" },  // emerald-500
  rejected: { solid: "rgb(239 68 68)", soft: "rgb(239 68 68 / 0.6)" },    // red-500
} as const;

type SeriesKey = keyof typeof COLORS;

function formatBucketLabel(
  bucket: string,
  granularity: "day" | "week" | "month",
): string {
  const d = new Date(bucket + "T00:00:00Z");
  if (granularity === "month") {
    return d.toLocaleDateString("en-US", { month: "short" });
  }
  return d.toLocaleDateString("en-US", { day: "numeric" });
}

function formatBucketFull(
  bucket: string,
  granularity: "day" | "week" | "month",
): string {
  const d = new Date(bucket + "T00:00:00Z");
  if (granularity === "month") {
    return d.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  }
  if (granularity === "week") {
    return `Week of ${d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    })}`;
  }
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Stacked SVG bar chart — applicants over time.
 * Interactive tooltip follows the cursor, hovered column gets a translucent
 * highlight strip behind it, bars use a vertical gradient so each segment
 * has a soft top edge instead of a hard slab. Pure SVG + a div tooltip.
 */
export function ApplicantsTrendChart({
  data,
  granularity,
}: ApplicantsTrendChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(
    null,
  );

  const innerW = CHART_WIDTH - PAD_LEFT - PAD_RIGHT;
  const innerH = CHART_HEIGHT - PAD_TOP - PAD_BOTTOM;
  const slot = innerW / Math.max(1, data.length);
  const barW = Math.max(2, Math.min(slot * 0.62, 14));

  const max = useMemo(
    () => Math.max(1, ...data.map((d) => d.applied + d.approved + d.rejected)),
    [data],
  );

  // Pick a nice y-axis grid: ~3 ticks, rounded.
  const yTicks = useMemo(() => niceTicks(max, 3), [max]);
  const yMax = yTicks[yTicks.length - 1]!;

  const labelStep = Math.max(1, Math.ceil(data.length / 12));

  const totals = useMemo(() => {
    let a = 0,
      b = 0,
      c = 0;
    for (const d of data) {
      a += d.applied;
      b += d.approved;
      c += d.rejected;
    }
    return { applied: a, approved: b, rejected: c };
  }, [data]);

  // Convert a mouse event's clientX into a column index.
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el || data.length === 0) return;
    const rect = el.getBoundingClientRect();
    const xPx = e.clientX - rect.left;
    // Map container px → svg userspace (the svg fills the container width).
    const xSvg = (xPx / rect.width) * CHART_WIDTH;
    const localX = xSvg - PAD_LEFT;
    if (localX < 0 || localX > innerW) {
      setHoverIdx(null);
      setTooltipPos(null);
      return;
    }
    const idx = Math.min(
      data.length - 1,
      Math.max(0, Math.floor(localX / slot)),
    );
    setHoverIdx(idx);
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const onLeave = () => {
    setHoverIdx(null);
    setTooltipPos(null);
  };

  const hovered = hoverIdx !== null ? data[hoverIdx] : null;

  return (
    <Card className="relative overflow-hidden">
      {/* Subtle radial glow in the top-right corner — gives the card a more
          deliberate, modern feel without being noisy. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 60% at 100% 0%, rgb(56 189 248 / 0.08) 0%, transparent 60%)",
        }}
      />
      <CardContent className="relative space-y-3 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Applicants over time
            </p>
            <p className="text-sm font-medium tabular-nums">
              {totals.applied} applied · {totals.approved} approved ·{" "}
              {totals.rejected} rejected
            </p>
          </div>
          <Legend />
        </div>

        <div
          ref={containerRef}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className="relative w-full overflow-x-auto"
        >
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            className="w-full min-w-[640px]"
            role="img"
            aria-label="Applicants over time, stacked by status"
          >
            <defs>
              {(Object.keys(COLORS) as SeriesKey[]).map((k) => (
                <linearGradient
                  key={k}
                  id={`grad-${k}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={COLORS[k].soft} />
                  <stop offset="100%" stopColor={COLORS[k].solid} />
                </linearGradient>
              ))}
              <linearGradient id="hover-strip" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="currentColor"
                  stopOpacity="0.08"
                />
                <stop
                  offset="100%"
                  stopColor="currentColor"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>

            {/* baseline */}
            <line
              x1={PAD_LEFT}
              x2={CHART_WIDTH - PAD_RIGHT}
              y1={PAD_TOP + innerH}
              y2={PAD_TOP + innerH}
              stroke="currentColor"
              strokeOpacity={0.12}
            />

            {/* y gridlines + labels */}
            {yTicks.map((t) => {
              if (t === 0) return null;
              const y = PAD_TOP + innerH - (t / yMax) * innerH;
              return (
                <g key={t}>
                  <line
                    x1={PAD_LEFT}
                    x2={CHART_WIDTH - PAD_RIGHT}
                    y1={y}
                    y2={y}
                    stroke="currentColor"
                    strokeOpacity={0.06}
                    strokeDasharray="2 4"
                  />
                  <text
                    x={PAD_LEFT - 6}
                    y={y + 3}
                    textAnchor="end"
                    fontSize={9}
                    fill="currentColor"
                    fillOpacity={0.45}
                    fontFamily="ui-monospace, monospace"
                  >
                    {t}
                  </text>
                </g>
              );
            })}

            {/* hover highlight strip — drawn behind the bars */}
            {hoverIdx !== null && (
              <rect
                x={PAD_LEFT + slot * hoverIdx}
                y={PAD_TOP}
                width={slot}
                height={innerH}
                fill="url(#hover-strip)"
                style={{ pointerEvents: "none" }}
              />
            )}

            {/* stacked bars */}
            {data.map((d, i) => {
              const x = PAD_LEFT + slot * i + (slot - barW) / 2;
              const hApplied = (d.applied / yMax) * innerH;
              const hApproved = (d.approved / yMax) * innerH;
              const hRejected = (d.rejected / yMax) * innerH;
              let y = PAD_TOP + innerH;
              const segApplied = { y: y - hApplied, h: hApplied };
              y -= hApplied;
              const segApproved = { y: y - hApproved, h: hApproved };
              y -= hApproved;
              const segRejected = { y: y - hRejected, h: hRejected };
              const isHovered = hoverIdx === i;
              const total = d.applied + d.approved + d.rejected;
              return (
                <g
                  key={d.bucket}
                  opacity={hoverIdx === null || isHovered ? 1 : 0.55}
                  style={{ transition: "opacity 120ms ease" }}
                >
                  {hApplied > 0 && (
                    <rect
                      x={x}
                      y={segApplied.y}
                      width={barW}
                      height={hApplied}
                      fill="url(#grad-applied)"
                      rx={2}
                    />
                  )}
                  {hApproved > 0 && (
                    <rect
                      x={x}
                      y={segApproved.y}
                      width={barW}
                      height={hApproved}
                      fill="url(#grad-approved)"
                      rx={2}
                    />
                  )}
                  {hRejected > 0 && (
                    <rect
                      x={x}
                      y={segRejected.y}
                      width={barW}
                      height={hRejected}
                      fill="url(#grad-rejected)"
                      rx={2}
                    />
                  )}
                  {total === 0 && (
                    <rect
                      x={x}
                      y={PAD_TOP + innerH - 1}
                      width={barW}
                      height={1}
                      fill="currentColor"
                      fillOpacity={0.08}
                    />
                  )}
                </g>
              );
            })}

            {/* x-axis labels */}
            {data.map((d, i) => {
              if (i % labelStep !== 0 && i !== data.length - 1) return null;
              return (
                <text
                  key={d.bucket}
                  x={PAD_LEFT + slot * i + slot / 2}
                  y={CHART_HEIGHT - 10}
                  textAnchor="middle"
                  fontSize={9}
                  fill="currentColor"
                  fillOpacity={hoverIdx === i ? 0.9 : 0.45}
                  fontFamily="ui-monospace, monospace"
                  style={{ transition: "fill-opacity 120ms ease" }}
                >
                  {formatBucketLabel(d.bucket, granularity)}
                </text>
              );
            })}
          </svg>

          {/* Tooltip — floating div for clean styling + blur */}
          {hovered && tooltipPos && (
            <Tooltip
              point={hovered}
              granularity={granularity}
              position={tooltipPos}
              containerWidth={
                containerRef.current?.getBoundingClientRect().width ?? 0
              }
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function Legend() {
  return (
    <div className="flex items-center gap-3 text-[10px]">
      {(["applied", "approved", "rejected"] as const).map((k) => (
        <div key={k} className="flex items-center gap-1.5">
          <span
            className="block size-2 rounded-full"
            style={{ background: COLORS[k].solid }}
          />
          <span className="uppercase tracking-[0.14em] text-muted-foreground">
            {k}
          </span>
        </div>
      ))}
    </div>
  );
}

interface TooltipProps {
  point: BucketPoint;
  granularity: "day" | "week" | "month";
  position: { x: number; y: number };
  containerWidth: number;
}

function Tooltip({
  point,
  granularity,
  position,
  containerWidth,
}: TooltipProps) {
  // Keep the tooltip inside the container — flip to the left side of the
  // cursor when we'd otherwise overflow the right edge.
  const W = 200;
  const offset = 14;
  const flipLeft = position.x + offset + W > containerWidth;
  const left = flipLeft
    ? Math.max(8, position.x - offset - W)
    : position.x + offset;
  const top = Math.max(8, position.y - 12);
  const total = point.applied + point.approved + point.rejected;
  const rows: { key: keyof typeof COLORS; label: string; value: number }[] = [
    { key: "applied", label: "Applied", value: point.applied },
    { key: "approved", label: "Approved", value: point.approved },
    { key: "rejected", label: "Rejected", value: point.rejected },
  ];
  return (
    <div
      className="pointer-events-none absolute z-10 rounded-lg border border-border/60 bg-background/85 px-3 py-2.5 shadow-[0_8px_30px_rgb(0_0_0_/_0.35)] backdrop-blur-md"
      style={{ left, top, width: W }}
    >
      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {formatBucketFull(point.bucket, granularity)}
      </p>
      <ul className="mt-2 space-y-1">
        {rows.map((r) => (
          <li
            key={r.key}
            className="flex items-center justify-between gap-3 text-xs"
          >
            <span className="flex items-center gap-1.5">
              <span
                className="block size-2 rounded-full"
                style={{ background: COLORS[r.key].solid }}
              />
              <span className="text-muted-foreground">{r.label}</span>
            </span>
            <span className="font-mono tabular-nums">{r.value}</span>
          </li>
        ))}
      </ul>
      <div className="mt-1.5 flex items-center justify-between border-t border-border/40 pt-1.5 text-xs">
        <span className="text-muted-foreground">Total</span>
        <span className="font-mono tabular-nums">{total}</span>
      </div>
    </div>
  );
}

/** Pick a small set of "nice" round numbers for the y-axis. We never need
 *  more than ~4 ticks on a chart this size. */
function niceTicks(max: number, target: number): number[] {
  if (max <= 0) return [0, 1];
  const rough = max / target;
  const mag = Math.pow(10, Math.floor(Math.log10(rough)));
  const norm = rough / mag;
  const step =
    norm < 1.5 ? 1 * mag : norm < 3 ? 2 * mag : norm < 7 ? 5 * mag : 10 * mag;
  const top = Math.ceil(max / step) * step;
  const out: number[] = [];
  for (let v = 0; v <= top; v += step) out.push(v);
  return out;
}
