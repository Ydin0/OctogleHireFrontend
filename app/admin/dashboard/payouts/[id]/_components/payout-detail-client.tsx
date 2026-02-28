"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { ArrowLeft, Clock, DollarSign, Loader2, TrendingUp, Wallet } from "lucide-react";
import { use } from "react";

import type { Payout } from "@/lib/api/payouts";
import { fetchPayout } from "@/lib/api/payouts";
import {
  payoutStatusBadgeClass,
  payoutStatusLabel,
  formatCurrency,
  formatDate,
  type PayoutStatus,
} from "../../../_components/dashboard-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PayoutActions } from "./payout-actions";

function getMarginColorClass(marginPercent: number): string {
  if (marginPercent >= 25) return "text-emerald-600";
  if (marginPercent >= 20) return "text-amber-600";
  return "text-red-600";
}

const PayoutDetailClient = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = use(params);
  const { getToken } = useAuth();
  const [payout, setPayout] = useState<Payout | null>(null);
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const t = await getToken();
    setToken(t ?? "");
    const data = await fetchPayout(t, id);
    setPayout(data);
    setLoading(false);
  }, [getToken, id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!payout) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          Payout not found.
        </CardContent>
      </Card>
    );
  }

  const totalBilled = payout.lineItems.reduce(
    (sum, li) => sum + li.billingAmount,
    0,
  );
  const totalMargin = totalBilled - payout.total;
  const marginPercent = totalBilled > 0 ? (totalMargin / totalBilled) * 100 : 0;
  const totalHours = payout.lineItems.reduce(
    (sum, li) => sum + li.hoursWorked,
    0,
  );

  return (
    <>
      {/* Back navigation */}
      <Link
        href="/admin/dashboard/payouts"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Payouts
      </Link>

      {/* Header Card */}
      <Card>
        <CardContent className="p-6 lg:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-pulse/10">
                <Wallet className="size-7 text-pulse" />
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold">
                  {payout.payoutNumber}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {payout.developerName} &middot; {payout.developerRole}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <Badge
                    variant="outline"
                    className={payoutStatusBadgeClass(payout.status)}
                  >
                    {payoutStatusLabel[payout.status]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(payout.periodStart)} – {formatDate(payout.periodEnd)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
              <DollarSign className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Payout Amount
              </p>
              <p className="font-mono text-lg font-semibold">
                {formatCurrency(payout.total, payout.currency)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-zinc-500/10">
              <DollarSign className="size-5 text-zinc-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Billed Amount
              </p>
              <p className="font-mono text-lg font-semibold">
                {formatCurrency(totalBilled, payout.currency)}
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
                Margin
              </p>
              <p className={`font-mono text-lg font-semibold ${getMarginColorClass(marginPercent)}`}>
                {formatCurrency(totalMargin, payout.currency)}{" "}
                <span className="text-sm">({marginPercent.toFixed(1)}%)</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Clock className="size-5 text-amber-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Hours Worked
              </p>
              <p className="font-mono text-lg font-semibold">{totalHours}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left column — Line Items with Margin Breakdown */}
        <div className="xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Line Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs text-muted-foreground">
                        Company
                      </TableHead>
                      <TableHead className="text-xs text-muted-foreground">
                        Requirement
                      </TableHead>
                      <TableHead className="text-right text-xs text-muted-foreground">
                        Hours
                      </TableHead>
                      <TableHead className="text-right text-xs text-muted-foreground">
                        Dev Rate
                      </TableHead>
                      <TableHead className="text-right text-xs text-muted-foreground">
                        Payout
                      </TableHead>
                      <TableHead className="text-right text-xs text-muted-foreground">
                        Bill Rate
                      </TableHead>
                      <TableHead className="text-right text-xs text-muted-foreground">
                        Billed
                      </TableHead>
                      <TableHead className="text-right text-xs text-muted-foreground">
                        Margin
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payout.lineItems.map((item) => {
                      const itemMarginPercent =
                        item.billingAmount > 0
                          ? (item.margin / item.billingAmount) * 100
                          : 0;
                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            <p className="text-sm font-medium">
                              {item.companyName}
                            </p>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-muted-foreground">
                              {item.requirementTitle}
                            </p>
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm">
                            {item.hoursWorked}
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm">
                            {formatCurrency(item.developerPayoutRate, payout.currency)}/hr
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm">
                            {formatCurrency(item.payoutAmount, payout.currency)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm">
                            {formatCurrency(item.companyBillingRate, payout.currency)}/hr
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm">
                            {formatCurrency(item.billingAmount, payout.currency)}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={`font-mono text-sm font-medium ${getMarginColorClass(itemMarginPercent)}`}>
                              {formatCurrency(item.margin, payout.currency)}{" "}
                              <span className="text-xs">
                                ({itemMarginPercent.toFixed(1)}%)
                              </span>
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {/* Totals */}
                    <TableRow className="border-t-2">
                      <TableCell
                        colSpan={4}
                        className="text-right text-sm text-muted-foreground"
                      >
                        Subtotal
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm font-medium">
                        {formatCurrency(payout.subtotal, payout.currency)}
                      </TableCell>
                      <TableCell />
                      <TableCell className="text-right font-mono text-sm font-medium">
                        {formatCurrency(totalBilled, payout.currency)}
                      </TableCell>
                      <TableCell className={`text-right font-mono text-sm font-medium ${getMarginColorClass(marginPercent)}`}>
                        {formatCurrency(totalMargin, payout.currency)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-right text-sm text-muted-foreground"
                      >
                        Tax ({payout.taxRate}%)
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {formatCurrency(payout.taxAmount, payout.currency)}
                      </TableCell>
                      <TableCell colSpan={3} />
                    </TableRow>
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-right text-sm font-semibold"
                      >
                        Total Payout
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm font-semibold">
                        {formatCurrency(payout.total, payout.currency)}
                      </TableCell>
                      <TableCell />
                      <TableCell className="text-right font-mono text-sm font-semibold">
                        {formatCurrency(totalBilled, payout.currency)}
                      </TableCell>
                      <TableCell className={`text-right font-mono text-sm font-semibold ${getMarginColorClass(marginPercent)}`}>
                        {formatCurrency(totalMargin, payout.currency)}{" "}
                        <span className="text-xs font-medium">
                          ({marginPercent.toFixed(1)}%)
                        </span>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column — Actions */}
        <div>
          <PayoutActions
            payout={payout}
            token={token}
            onStatusChange={(updated) => setPayout(updated)}
          />
        </div>
      </div>
    </>
  );
};

export { PayoutDetailClient };
