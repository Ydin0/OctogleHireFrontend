"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  ChevronDown,
  ChevronUp,
  DollarSign,
  Download,
  FileText,
  Loader2,
  Receipt,
} from "lucide-react";

import {
  type CompanyInvoice,
  type CompanyInvoiceSummary,
  fetchCompanyInvoices,
  fetchCompanyInvoiceSummaryData,
} from "@/lib/api/companies";
import {
  formatCurrency,
  formatDate,
  invoiceStatusBadgeClass,
  invoiceStatusLabel,
  type InvoiceStatus,
} from "@/app/admin/dashboard/_components/dashboard-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const InvoicesPage = () => {
  const { getToken } = useAuth();
  const [invoices, setInvoices] = useState<CompanyInvoice[]>([]);
  const [summary, setSummary] = useState<CompanyInvoiceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const token = await getToken();
    const [inv, sum] = await Promise.all([
      fetchCompanyInvoices(token),
      fetchCompanyInvoiceSummaryData(token),
    ]);
    setInvoices(inv);
    setSummary(sum);
    setLoading(false);
  }, [getToken]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return invoices;
    return invoices.filter((inv) => inv.status === statusFilter);
  }, [invoices, statusFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const statusFilters = [
    { label: "All", value: "all", count: invoices.length },
    { label: "Sent", value: "sent", count: invoices.filter((i) => i.status === "sent").length },
    { label: "Paid", value: "paid", count: invoices.filter((i) => i.status === "paid").length },
    { label: "Overdue", value: "overdue", count: invoices.filter((i) => i.status === "overdue").length },
    { label: "Draft", value: "draft", count: invoices.filter((i) => i.status === "draft").length },
  ];

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold">Invoices</h1>
          <p className="text-sm text-muted-foreground">
            Manage pending, overdue, and paid invoices for your offshore team.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-blue-500/10">
                <FileText className="size-4 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Total Invoices
                </p>
                <p className="font-mono text-lg font-semibold">
                  {summary?.totalInvoices ?? 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500/10">
                <DollarSign className="size-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Total Billed
                </p>
                <p className="font-mono text-lg font-semibold">
                  {formatCurrency(summary?.totalBilled ?? 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-amber-500/10">
                <Receipt className="size-4 text-amber-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Outstanding
                </p>
                <p className="font-mono text-lg font-semibold">
                  {formatCurrency(summary?.totalOutstanding ?? 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500/10">
                <DollarSign className="size-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Total Paid
                </p>
                <p className="font-mono text-lg font-semibold">
                  {formatCurrency(summary?.totalPaid ?? 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {statusFilters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setStatusFilter(f.value)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              statusFilter === f.value
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
            }`}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* Invoices List */}
      <Card>
        <CardContent className="pt-6">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <FileText className="size-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-sm font-semibold">No invoices yet</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Invoices will appear here once billing is set up for your active
                engagements.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((inv) => {
                const isOpen = expandedId === inv.id;
                return (
                  <div
                    key={inv.id}
                    className="rounded-lg border border-border/70"
                  >
                    <button
                      type="button"
                      className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-muted/30"
                      onClick={() =>
                        setExpandedId(isOpen ? null : inv.id)
                      }
                    >
                      {isOpen ? (
                        <ChevronUp className="size-4 shrink-0 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                      )}
                      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-6 gap-y-1">
                        <span className="font-mono text-sm font-medium">
                          {inv.invoiceNumber}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(inv.periodStart)} –{" "}
                          {formatDate(inv.periodEnd)}
                        </span>
                        <Badge
                          variant="outline"
                          className={invoiceStatusBadgeClass(
                            inv.status as InvoiceStatus,
                          )}
                        >
                          {invoiceStatusLabel[inv.status as InvoiceStatus] ??
                            inv.status}
                        </Badge>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-mono text-sm font-semibold">
                          {formatCurrency(inv.total, inv.currency)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Due {inv.dueDate ? formatDate(inv.dueDate) : "—"}
                        </p>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="border-t border-border/70 bg-muted/20 p-4">
                        <p className="mb-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                          Line Items
                        </p>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Developer</TableHead>
                              <TableHead>Requirement</TableHead>
                              <TableHead className="text-right">
                                Rate
                              </TableHead>
                              <TableHead className="text-right">
                                Hours
                              </TableHead>
                              <TableHead className="text-right">
                                Amount
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {inv.lineItems.map((li) => (
                              <TableRow key={li.id}>
                                <TableCell>
                                  <p className="text-sm font-medium">
                                    {li.developerName}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {li.developerRole}
                                  </p>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {li.requirementTitle}
                                </TableCell>
                                <TableCell className="text-right font-mono text-sm">
                                  {formatCurrency(li.hourlyRate, inv.currency)}
                                  /hr
                                </TableCell>
                                <TableCell className="text-right font-mono text-sm">
                                  {li.hoursWorked}h
                                </TableCell>
                                <TableCell className="text-right font-mono text-sm font-semibold">
                                  {formatCurrency(li.amount, inv.currency)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
                          <div className="flex items-center gap-3">
                            <p className="text-xs text-muted-foreground">
                              Issued{" "}
                              {inv.issuedAt ? formatDate(inv.issuedAt) : "—"}
                              {inv.paidAt &&
                                ` · Paid ${formatDate(inv.paidAt)}`}
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 gap-1.5 text-xs"
                              asChild
                            >
                              <a
                                href={`/api/invoices/${inv.id}/pdf`}
                                download={`${inv.invoiceNumber}.pdf`}
                              >
                                <Download className="size-3" />
                                Download PDF
                              </a>
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              Subtotal:{" "}
                              <span className="font-mono">
                                {formatCurrency(inv.subtotal, inv.currency)}
                              </span>
                            </p>
                            {inv.taxAmount > 0 && (
                              <p className="text-xs text-muted-foreground">
                                Tax ({inv.taxRate}%):{" "}
                                <span className="font-mono">
                                  {formatCurrency(
                                    inv.taxAmount,
                                    inv.currency,
                                  )}
                                </span>
                              </p>
                            )}
                            <p className="text-sm font-semibold">
                              Total:{" "}
                              <span className="font-mono">
                                {formatCurrency(inv.total, inv.currency)}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default InvoicesPage;
