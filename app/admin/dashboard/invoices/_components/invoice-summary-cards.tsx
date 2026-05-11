"use client";

import { useMemo } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
} from "lucide-react";

import type { Invoice, InvoiceSummary } from "@/lib/api/invoices";
import { Card, CardContent } from "@/components/ui/card";
import { useAdminCurrency } from "../../_components/admin-currency-context";
import { formatCurrency } from "../../_components/dashboard-data";

interface InvoiceSummaryCardsProps {
  invoices: Invoice[];
  summary: InvoiceSummary;
}

function InvoiceSummaryCards({ invoices, summary }: InvoiceSummaryCardsProps) {
  const { displayCurrency, convert } = useAdminCurrency();

  const totals = useMemo(() => {
    let revenue = 0;
    let paid = 0;
    let outstanding = 0;
    for (const inv of invoices) {
      const amount = convert(inv.total, inv.currency);
      revenue += amount;
      if (inv.status === "paid") paid += amount;
      if (inv.status === "sent" || inv.status === "overdue") {
        outstanding += amount;
      }
    }
    return { revenue, paid, outstanding };
  }, [invoices, convert]);

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
            <DollarSign className="size-5 text-blue-600" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Total Revenue
            </p>
            <p className="font-mono text-lg font-semibold">
              {formatCurrency(totals.revenue, displayCurrency)}
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
              Paid
            </p>
            <p className="font-mono text-lg font-semibold">
              {formatCurrency(totals.paid, displayCurrency)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className={totals.outstanding > 0 ? "border-amber-600/20" : undefined}>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
            <Clock className="size-5 text-amber-600" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Outstanding
            </p>
            <p className="font-mono text-lg font-semibold">
              {formatCurrency(totals.outstanding, displayCurrency)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className={summary.overdueCount > 0 ? "border-red-600/20" : undefined}>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex size-10 items-center justify-center rounded-lg bg-red-500/10">
            <AlertTriangle className="size-5 text-red-600" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Overdue
            </p>
            <p className={`font-mono text-lg font-semibold ${summary.overdueCount > 0 ? "text-red-600" : ""}`}>
              {summary.overdueCount}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export { InvoiceSummaryCards };
