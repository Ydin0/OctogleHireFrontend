"use client";

import { ArrowDown, ArrowUp, Minus } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface KpiCardProps {
  icon: React.ReactNode;
  tint: string;
  label: string;
  /** Pre-formatted value text (currency, percent, integer — caller decides). */
  value: string;
  /** Optional pct change vs previous period. null means "no comparison". */
  pctChange?: number | null;
  /** Tiny line below the value (e.g. "vs last 30 days"). */
  hint?: string;
}

/** Reusable KPI card with a delta arrow. Shared by every KPI row on the
 *  dashboard so the visual treatment of "up X%, down Y%" stays consistent. */
export function KpiCard({
  icon,
  tint,
  label,
  value,
  pctChange,
  hint,
}: KpiCardProps) {
  const dir =
    pctChange === undefined || pctChange === null || pctChange === 0
      ? "flat"
      : pctChange > 0
        ? "up"
        : "down";

  const deltaText =
    pctChange === undefined
      ? null
      : pctChange === null
        ? "new"
        : `${pctChange > 0 ? "+" : ""}${pctChange.toFixed(1)}%`;

  const deltaClass =
    dir === "up"
      ? "text-emerald-600 dark:text-emerald-500"
      : dir === "down"
        ? "text-red-600 dark:text-red-500"
        : "text-muted-foreground";

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${tint}`}
          >
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            <p className="font-mono text-xl font-semibold leading-tight">
              {value}
            </p>
            {(deltaText || hint) && (
              <div className="mt-1 flex items-center gap-1.5">
                {deltaText && (
                  <span
                    className={`inline-flex items-center gap-0.5 text-xs font-medium ${deltaClass}`}
                  >
                    {dir === "up" ? (
                      <ArrowUp className="size-3" />
                    ) : dir === "down" ? (
                      <ArrowDown className="size-3" />
                    ) : (
                      <Minus className="size-3" />
                    )}
                    {deltaText}
                  </span>
                )}
                {hint && (
                  <span className="text-[10px] text-muted-foreground">
                    {hint}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
