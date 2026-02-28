"use client";

import { CheckCircle2, Clock, Receipt, TrendingUp } from "lucide-react";

import type { PayoutSummary } from "@/lib/api/payouts";
import { formatCurrency } from "../../_components/dashboard-data";
import { Card, CardContent } from "@/components/ui/card";

interface PayoutSummaryCardsProps {
  summary: PayoutSummary;
}

function PayoutSummaryCards({ summary }: PayoutSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
            <Receipt className="size-5 text-blue-600" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Total Payouts
            </p>
            <p className="font-mono text-lg font-semibold">
              {summary.totalPayouts}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
            <CheckCircle2 className="size-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Total Paid Out
            </p>
            <p className="font-mono text-lg font-semibold">
              {formatCurrency(summary.totalPaidOut)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className={summary.totalPending > 0 ? "border-amber-600/20" : undefined}>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
            <Clock className="size-5 text-amber-600" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Pending
            </p>
            <p className="font-mono text-lg font-semibold">
              {formatCurrency(summary.totalPending)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex size-10 items-center justify-center rounded-lg bg-violet-500/10">
            <TrendingUp className="size-5 text-violet-600" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Avg Margin
            </p>
            <p className="font-mono text-lg font-semibold">
              {summary.averageMarginPercent.toFixed(1)}%
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export { PayoutSummaryCards };
