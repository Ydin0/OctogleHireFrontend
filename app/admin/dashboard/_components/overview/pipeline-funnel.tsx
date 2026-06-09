"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  applicationStatusBadgeClass,
  applicationStatusLabel,
  PIPELINE_STAGES,
} from "../dashboard-data";

interface PipelineFunnelProps {
  snapshot: Record<string, number>;
}

/**
 * Vertical funnel — current applicant count at each pipeline stage. Honours
 * the category filter through the server-side snapshot. The bar widths are
 * relative to the largest stage so it reads like a funnel narrowing toward
 * the bottom.
 */
export function PipelineFunnel({ snapshot }: PipelineFunnelProps) {
  const stages = [...PIPELINE_STAGES, "rejected" as const];
  const rows = stages.map((stage) => ({
    stage,
    count: snapshot[stage] ?? 0,
  }));
  const max = Math.max(1, ...rows.map((r) => r.count));
  const total = rows.reduce((s, r) => s + r.count, 0);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Pipeline (current)
            </p>
            <p className="text-sm font-medium">{total} applicants</p>
          </div>
        </div>
        <div className="space-y-2">
          {rows.map(({ stage, count }) => {
            const pct = (count / max) * 100;
            const share = total > 0 ? (count / total) * 100 : 0;
            return (
              <div key={stage}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {applicationStatusLabel[stage] ?? stage}
                  </span>
                  <span className="font-mono text-foreground">
                    {count}
                    <span className="ml-1 text-[10px] text-muted-foreground">
                      ({share.toFixed(0)}%)
                    </span>
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${stageBarClass(stage)}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

/** Map status → bar fill. Pulls from the existing badge class names so the
 *  funnel matches the colour treatment used on every applicant table. */
function stageBarClass(stage: string): string {
  const klass = applicationStatusBadgeClass(stage as never);
  // The badge class is `bg-XXX/10 text-XXX-XXX border-...`; we just want a
  // solid fill, so swap `/10` for nothing and drop the rest.
  const m = klass.match(/bg-([\w-]+?)\/10/);
  return m ? `bg-${m[1]}` : "bg-foreground/40";
}
