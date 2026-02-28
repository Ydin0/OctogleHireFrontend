"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { ArrowLeft, Calendar, DollarSign, Loader2, Receipt } from "lucide-react";
import { use } from "react";

import type { Invoice } from "@/lib/api/invoices";
import { fetchInvoice } from "@/lib/api/invoices";
import {
  invoiceStatusBadgeClass,
  invoiceStatusLabel,
  formatCurrency,
  formatDate,
  type InvoiceStatus,
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
import { InvoiceActions } from "./invoice-actions";

const InvoiceDetailClient = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = use(params);
  const { getToken } = useAuth();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const t = await getToken();
    setToken(t ?? "");
    const data = await fetchInvoice(t, id);
    setInvoice(data);
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

  if (!invoice) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          Invoice not found.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Back navigation */}
      <Link
        href="/admin/dashboard/invoices"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Invoices
      </Link>

      {/* Header Card */}
      <Card>
        <CardContent className="p-6 lg:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-pulse/10">
                <Receipt className="size-7 text-pulse" />
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold">
                  {invoice.invoiceNumber}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {invoice.companyName}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <Badge
                    variant="outline"
                    className={invoiceStatusBadgeClass(invoice.status)}
                  >
                    {invoiceStatusLabel[invoice.status]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Issued {formatDate(invoice.issuedAt)}
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
                Subtotal
              </p>
              <p className="font-mono text-lg font-semibold">
                {formatCurrency(invoice.subtotal, invoice.currency)}
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
                Tax ({invoice.taxRate}%)
              </p>
              <p className="font-mono text-lg font-semibold">
                {formatCurrency(invoice.taxAmount, invoice.currency)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <DollarSign className="size-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Total
              </p>
              <p className="font-mono text-lg font-semibold">
                {formatCurrency(invoice.total, invoice.currency)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Calendar className="size-5 text-amber-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Due Date
              </p>
              <p
                className={`text-lg font-semibold ${invoice.status === "overdue" ? "text-red-600" : ""}`}
              >
                {formatDate(invoice.dueDate)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left column — Line Items */}
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
                        Developer
                      </TableHead>
                      <TableHead className="text-right text-xs text-muted-foreground">
                        Hourly Rate
                      </TableHead>
                      <TableHead className="text-right text-xs text-muted-foreground">
                        Hours
                      </TableHead>
                      <TableHead className="text-right text-xs text-muted-foreground">
                        Amount
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.lineItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium">
                              {item.developerName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {item.developerRole}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {formatCurrency(item.hourlyRate, invoice.currency)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {item.hoursWorked}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {formatCurrency(item.amount, invoice.currency)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* Totals */}
                    <TableRow className="border-t-2">
                      <TableCell
                        colSpan={3}
                        className="text-right text-sm text-muted-foreground"
                      >
                        Subtotal
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm font-medium">
                        {formatCurrency(invoice.subtotal, invoice.currency)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-right text-sm text-muted-foreground"
                      >
                        Tax ({invoice.taxRate}%)
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {formatCurrency(invoice.taxAmount, invoice.currency)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-right text-sm font-semibold"
                      >
                        Total
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm font-semibold">
                        {formatCurrency(invoice.total, invoice.currency)}
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
          <InvoiceActions
            invoice={invoice}
            token={token}
            onStatusChange={(updated) => setInvoice(updated)}
          />
        </div>
      </div>
    </>
  );
};

export { InvoiceDetailClient };
