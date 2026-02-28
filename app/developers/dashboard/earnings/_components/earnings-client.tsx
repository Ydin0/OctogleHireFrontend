"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Download } from "lucide-react";

import type { Payout, PayoutSummary } from "@/lib/api/payouts";
import {
  payoutStatusBadgeClass,
  payoutStatusLabel,
  formatCurrency,
  formatDate,
  type PayoutStatus,
} from "@/app/admin/dashboard/_components/dashboard-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EarningsClientProps {
  payouts: Payout[];
  summary: PayoutSummary;
}

function EarningsClient({ payouts, summary }: EarningsClientProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const currentMonth = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const currentMonthPayouts = payouts.filter((p) => {
    const start = new Date(p.periodStart);
    const now = new Date();
    return (
      start.getMonth() === now.getMonth() &&
      start.getFullYear() === now.getFullYear()
    );
  });

  const currentMonthTotal = currentMonthPayouts.reduce(
    (sum, p) => sum + p.total,
    0,
  );

  return (
    <>
      {/* Summary Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Total Earned
            </p>
            <p className="mt-1 font-mono text-2xl font-semibold">
              {formatCurrency(summary.totalPaidOut)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Across {payouts.filter((p) => p.status === "paid").length} paid payouts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              {currentMonth}
            </p>
            <p className="mt-1 font-mono text-2xl font-semibold">
              {formatCurrency(currentMonthTotal)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {currentMonthPayouts.length > 0
                ? `${currentMonthPayouts[0]?.status === "paid" ? "Paid" : payoutStatusLabel[currentMonthPayouts[0]?.status as PayoutStatus]}`
                : "No payout this month yet"}
            </p>
          </CardContent>
        </Card>

        <Card className={summary.totalPending > 0 ? "border-amber-600/20" : undefined}>
          <CardContent className="p-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Pending Payout
            </p>
            <p className="mt-1 font-mono text-2xl font-semibold">
              {formatCurrency(summary.totalPending)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {payouts.filter(
                (p) =>
                  p.status === "pending" ||
                  p.status === "approved" ||
                  p.status === "processing",
              ).length}{" "}
              pending payouts
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Payouts List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payout History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {payouts.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No payouts yet. Payouts appear after your first active engagement.
            </p>
          ) : (
            payouts.map((payout) => {
              const isExpanded = expandedId === payout.id;
              const period = `${new Date(payout.periodStart).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`;

              return (
                <div key={payout.id} className="rounded-md border">
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-accent/50"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : payout.id)
                    }
                  >
                    {isExpanded ? (
                      <ChevronDown className="size-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="size-4 text-muted-foreground" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {payout.payoutNumber}
                        </span>
                        <Badge
                          variant="outline"
                          className={payoutStatusBadgeClass(payout.status)}
                        >
                          {payoutStatusLabel[payout.status]}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{period}</p>
                    </div>
                    <span className="font-mono text-sm font-medium">
                      {formatCurrency(payout.total, payout.currency)}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="border-t bg-muted/30 px-3 pb-3 pt-2">
                      <div className="space-y-2">
                        {payout.lineItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <div>
                              <p className="font-medium">{item.companyName}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.requirementTitle} &middot;{" "}
                                {item.hoursWorked} hrs @{" "}
                                <span className="font-mono">
                                  {formatCurrency(
                                    item.developerPayoutRate,
                                    payout.currency,
                                  )}
                                  /hr
                                </span>
                              </p>
                            </div>
                            <span className="font-mono">
                              {formatCurrency(
                                item.payoutAmount,
                                payout.currency,
                              )}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t pt-2">
                        <div className="text-xs text-muted-foreground">
                          {payout.paidAt
                            ? `Paid ${formatDate(payout.paidAt)}`
                            : `Created ${formatDate(payout.createdAt)}`}
                        </div>
                        {payout.status === "paid" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 gap-1.5 text-xs"
                            asChild
                          >
                            <a
                              href={`/api/payouts/${payout.id}/pdf`}
                              download={`${payout.payoutNumber}.pdf`}
                            >
                              <Download className="size-3" />
                              Payslip
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </>
  );
}

export { EarningsClient };
