"use client";

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
const PAD_RIGHT = 12;
const PAD_TOP = 12;
const PAD_BOTTOM = 32;
const LEGEND_HEIGHT = 28;

const COLORS = {
  applied: "rgb(56 189 248)",   // sky-400
  approved: "rgb(16 185 129)",  // emerald-500
  rejected: "rgb(239 68 68)",   // red-500
};

function formatBucketLabel(
  bucket: string,
  granularity: "day" | "week" | "month",
): string {
  const d = new Date(bucket + "T00:00:00Z");
  if (granularity === "month") {
    return d.toLocaleDateString("en-US", { month: "short" });
  }
  if (granularity === "week") {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  return d.toLocaleDateString("en-US", { day: "numeric" });
}

/**
 * Stacked SVG bar chart — applicants over time, three series per bucket
 * (applied as the base, approved and rejected stacked on top). Bars stay
 * tall enough to read even on sparse weeks; x-axis labels adapt to the
 * server-chosen granularity. No chart library — pure SVG.
 */
export function ApplicantsTrendChart({
  data,
  granularity,
}: ApplicantsTrendChartProps) {
  const innerW = CHART_WIDTH - PAD_LEFT - PAD_RIGHT;
  const innerH = CHART_HEIGHT - PAD_TOP - PAD_BOTTOM;
  const slot = innerW / Math.max(1, data.length);
  const barW = Math.max(2, slot * 0.62);

  const max = Math.max(
    1,
    ...data.map((d) => d.applied + d.approved + d.rejected),
  );

  // We only render at most ~12 x-axis labels so things don't get crowded.
  const labelStep = Math.max(1, Math.ceil(data.length / 12));

  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Applicants over time
            </p>
            <p className="text-sm font-medium">
              {data.reduce((s, d) => s + d.applied, 0)} applied ·{" "}
              {data.reduce((s, d) => s + d.approved, 0)} approved ·{" "}
              {data.reduce((s, d) => s + d.rejected, 0)} rejected
            </p>
          </div>
          <Legend />
        </div>
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT + LEGEND_HEIGHT}`}
            className="w-full min-w-[640px]"
            role="img"
            aria-label="Applicants over time, stacked by status"
          >
            {/* baseline */}
            <line
              x1={PAD_LEFT}
              x2={CHART_WIDTH - PAD_RIGHT}
              y1={PAD_TOP + innerH}
              y2={PAD_TOP + innerH}
              stroke="currentColor"
              strokeOpacity={0.15}
            />
            {/* gridlines + y labels (50% and 100%) */}
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
                  x={PAD_LEFT - 6}
                  y={PAD_TOP + innerH * (1 - t) + 3}
                  textAnchor="end"
                  fontSize={9}
                  fill="currentColor"
                  fillOpacity={0.5}
                  fontFamily="ui-monospace, monospace"
                >
                  {Math.round(max * t)}
                </text>
              </g>
            ))}
            {/* stacked bars */}
            {data.map((d, i) => {
              const x = PAD_LEFT + slot * i + (slot - barW) / 2;
              const total = d.applied + d.approved + d.rejected;
              const hApplied = (d.applied / max) * innerH;
              const hApproved = (d.approved / max) * innerH;
              const hRejected = (d.rejected / max) * innerH;
              let y = PAD_TOP + innerH;
              const segApplied = { y: y - hApplied, h: hApplied };
              y -= hApplied;
              const segApproved = { y: y - hApproved, h: hApproved };
              y -= hApproved;
              const segRejected = { y: y - hRejected, h: hRejected };
              return (
                <g key={d.bucket}>
                  {hApplied > 0 && (
                    <rect
                      x={x}
                      y={segApplied.y}
                      width={barW}
                      height={hApplied}
                      fill={COLORS.applied}
                      rx={1.5}
                    >
                      <title>
                        {d.bucket}: {d.applied} applied
                      </title>
                    </rect>
                  )}
                  {hApproved > 0 && (
                    <rect
                      x={x}
                      y={segApproved.y}
                      width={barW}
                      height={hApproved}
                      fill={COLORS.approved}
                      rx={1.5}
                    >
                      <title>
                        {d.bucket}: {d.approved} approved
                      </title>
                    </rect>
                  )}
                  {hRejected > 0 && (
                    <rect
                      x={x}
                      y={segRejected.y}
                      width={barW}
                      height={hRejected}
                      fill={COLORS.rejected}
                      rx={1.5}
                    >
                      <title>
                        {d.bucket}: {d.rejected} rejected
                      </title>
                    </rect>
                  )}
                  {total === 0 && (
                    <rect
                      x={x}
                      y={PAD_TOP + innerH - 1}
                      width={barW}
                      height={1}
                      fill="currentColor"
                      fillOpacity={0.1}
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
                  y={CHART_HEIGHT - 8}
                  textAnchor="middle"
                  fontSize={9}
                  fill="currentColor"
                  fillOpacity={0.5}
                >
                  {formatBucketLabel(d.bucket, granularity)}
                </text>
              );
            })}
          </svg>
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
            style={{ background: COLORS[k] }}
          />
          <span className="uppercase tracking-wider text-muted-foreground">
            {k}
          </span>
        </div>
      ))}
    </div>
  );
}
