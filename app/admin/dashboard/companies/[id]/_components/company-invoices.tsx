"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { ArrowRight, Loader2 } from "lucide-react";

import type { Invoice, InvoiceSummary } from "@/lib/api/invoices";
import {
  fetchInvoicesByCompany,
  fetchCompanyInvoiceSummary,
} from "@/lib/api/invoices";
import {
  invoiceStatusBadgeClass,
  invoiceStatusLabel,
  formatCurrency,
  type InvoiceStatus,
} from "../../../_components/dashboard-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CompanyInvoicesProps {
  companyId: string;
}

function CompanyInvoices({ companyId }: CompanyInvoicesProps) {
  const { getToken } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [summary, setSummary] = useState<InvoiceSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const token = await getToken();
    const [invData, sumData] = await Promise.all([
      fetchInvoicesByCompany(token, companyId),
      fetchCompanyInvoiceSummary(token, companyId),
    ]);
    setInvoices(invData ?? []);
    setSummary(sumData);
    setLoading(false);
  }, [getToken, companyId]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (invoices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-4 text-center text-sm text-muted-foreground">
            No invoices for this company yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  const recentInvoices = invoices
    .sort(
      (a, b) =>
        new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime(),
    )
    .slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Invoices</CardTitle>
        <Link
          href={`/admin/dashboard/invoices?company=${companyId}`}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          View All
          <ArrowRight className="size-3" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary stats */}
        {summary && (
          <div className="flex items-center gap-4 rounded-lg border border-border/70 p-3">
            <div className="flex-1 text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Total Billed
              </p>
              <p className="font-mono text-sm font-semibold">
                {formatCurrency(summary.totalRevenue)}
              </p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Paid
              </p>
              <p className="font-mono text-sm font-semibold text-emerald-600">
                {formatCurrency(summary.totalPaid)}
              </p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Outstanding
              </p>
              <p className="font-mono text-sm font-semibold text-amber-600">
                {formatCurrency(summary.totalOutstanding)}
              </p>
            </div>
          </div>
        )}

        {/* Recent invoices list */}
        <div className="space-y-2">
          {recentInvoices.map((inv) => {
            const period = new Date(inv.periodStart).toLocaleDateString(
              "en-US",
              { month: "short", year: "numeric" },
            );
            return (
              <Link
                key={inv.id}
                href={`/admin/dashboard/invoices/${inv.id}`}
                className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2.5 transition-colors hover:border-pulse/30"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium">{inv.invoiceNumber}</p>
                  <p className="text-xs text-muted-foreground">{period}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">
                    {formatCurrency(inv.total, inv.currency)}
                  </span>
                  <Badge
                    variant="outline"
                    className={invoiceStatusBadgeClass(inv.status as InvoiceStatus)}
                  >
                    {invoiceStatusLabel[inv.status as InvoiceStatus] ?? inv.status}
                  </Badge>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export { CompanyInvoices };
