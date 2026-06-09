"use client";

import { Card, CardContent } from "@/components/ui/card";

interface SourceDonutProps {
  data: { source: string; count: number }[];
}

const PALETTE = [
  "rgb(56 189 248)",   // sky
  "rgb(16 185 129)",   // emerald
  "rgb(245 158 11)",   // amber
  "rgb(139 92 246)",   // violet
  "rgb(244 63 94)",    // rose
  "rgb(20 184 166)",   // teal
  "rgb(99 102 241)",   // indigo
  "rgb(234 179 8)",    // yellow
];

const SIZE = 160;
const RADIUS = 70;
const INNER = 44;

function describeArc(start: number, end: number): string {
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const toXY = (angle: number, r: number) => {
    const a = (angle - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };
  const o1 = toXY(start, RADIUS);
  const o2 = toXY(end, RADIUS);
  const i2 = toXY(end, INNER);
  const i1 = toXY(start, INNER);
  const large = end - start > 180 ? 1 : 0;
  return [
    `M ${o1.x} ${o1.y}`,
    `A ${RADIUS} ${RADIUS} 0 ${large} 1 ${o2.x} ${o2.y}`,
    `L ${i2.x} ${i2.y}`,
    `A ${INNER} ${INNER} 0 ${large} 0 ${i1.x} ${i1.y}`,
    "Z",
  ].join(" ");
}

/** Donut chart for applicant `source` breakdown. The total sits in the
 *  donut hole; the legend on the right lists each source with its share. */
export function SourceDonut({ data }: SourceDonutProps) {
  const total = data.reduce((s, d) => s + d.count, 0);

  let cursor = 0;
  const arcs = data.map((d, i) => {
    const pct = total > 0 ? d.count / total : 0;
    const start = cursor * 360;
    cursor += pct;
    const end = cursor * 360;
    return {
      ...d,
      path: describeArc(start, Math.min(end, 359.99)),
      color: PALETTE[i % PALETTE.length],
      pct,
    };
  });

  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Source breakdown
        </p>
        {total === 0 ? (
          <p className="mt-3 text-xs text-muted-foreground">
            No applicants in this window.
          </p>
        ) : (
          <div className="mt-3 flex items-center gap-4">
            <div className="relative">
              <svg
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                width={SIZE}
                height={SIZE}
                aria-hidden
              >
                {arcs.map((a) => (
                  <path
                    key={a.source}
                    d={a.path}
                    fill={a.color}
                    stroke="white"
                    strokeWidth={1}
                    strokeOpacity={0.4}
                  />
                ))}
              </svg>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-2xl font-semibold">
                  {total}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  applicants
                </span>
              </div>
            </div>
            <ul className="min-w-0 flex-1 space-y-1.5">
              {arcs.map((a) => (
                <li
                  key={a.source}
                  className="flex items-center justify-between gap-2 text-xs"
                >
                  <span className="flex min-w-0 items-center gap-1.5">
                    <span
                      className="block size-2 shrink-0 rounded-full"
                      style={{ background: a.color }}
                    />
                    <span className="truncate capitalize">{a.source}</span>
                  </span>
                  <span className="shrink-0 font-mono text-muted-foreground">
                    {Math.round(a.pct * 100)}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
