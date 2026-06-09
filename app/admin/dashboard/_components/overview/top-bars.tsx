"use client";

import { Card, CardContent } from "@/components/ui/card";

interface TopBarsProps {
  title: string;
  rows: { name: string; count: number }[];
  /** Optional accent class for the bar fill (e.g. "bg-sky-500"). */
  barClass?: string;
  /** Optional label format hook (e.g. titlecase a category key). */
  formatLabel?: (raw: string) => string;
  /** What to render when no rows are present. */
  emptyText?: string;
}

/** Compact horizontal-bar list — label + count + bar relative to the leader.
 *  Used for Top Stacks, Top Categories, Top Locations. Hand-rolled so all
 *  three widgets look identical without extra dependencies. */
export function TopBars({
  title,
  rows,
  barClass = "bg-foreground/70",
  formatLabel,
  emptyText = "Nothing yet.",
}: TopBarsProps) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
        {rows.length === 0 ? (
          <p className="mt-3 text-xs text-muted-foreground">{emptyText}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {rows.map((r) => {
              const pct = (r.count / max) * 100;
              return (
                <li key={r.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="truncate">
                      {formatLabel ? formatLabel(r.name) : r.name}
                    </span>
                    <span className="font-mono tabular-nums text-muted-foreground">
                      {r.count}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${barClass}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
