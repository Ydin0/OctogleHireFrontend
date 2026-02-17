import { Banknote, Filter, Wallet } from "lucide-react";

import {
  formatCurrency,
  invoiceStatusBadgeClass,
  invoiceStatusLabel,
  invoices,
} from "../_components/dashboard-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const totalDue = invoices
  .filter((invoice) => invoice.status !== "paid")
  .reduce((sum, invoice) => sum + invoice.amount, 0);

const overdueAmount = invoices
  .filter((invoice) => invoice.status === "overdue")
  .reduce((sum, invoice) => sum + invoice.amount, 0);

const InvoicesPage = () => {
  return (
    <>
      <Card className="border-pulse/30 bg-gradient-to-br from-card to-pulse/5">
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>
            Manage pending, overdue, and paid invoices for your offshore team.
          </CardDescription>
        </CardHeader>
      </Card>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-mono uppercase tracking-[0.08em]">
              Total due
            </CardDescription>
            <CardTitle>{formatCurrency(totalDue)}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Across all open developer invoices.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-mono uppercase tracking-[0.08em]">
              Overdue
            </CardDescription>
            <CardTitle>{formatCurrency(overdueAmount)}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Requires immediate payment action.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-mono uppercase tracking-[0.08em]">
              Next payout
            </CardDescription>
            <CardTitle>Feb 20, 2026</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Scheduled transfer in 6 days.
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Invoice Table</CardTitle>
              <CardDescription>
                Track status, due dates, and payment actions by developer.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2">
                <Filter className="size-4" />
                Filter
              </Button>
              <Button className="gap-2 bg-pulse text-pulse-foreground hover:bg-pulse/90">
                <Wallet className="size-4" />
                Batch Pay
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[840px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="pb-3 font-medium">Invoice</th>
                <th className="pb-3 font-medium">Developer</th>
                <th className="pb-3 font-medium">Project</th>
                <th className="pb-3 font-medium">Issued</th>
                <th className="pb-3 font-medium">Due</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-border/60">
                  <td className="py-3 font-medium">{invoice.id}</td>
                  <td className="py-3">{invoice.developerName}</td>
                  <td className="py-3 text-muted-foreground">{invoice.project}</td>
                  <td className="py-3 text-muted-foreground">{invoice.issuedOn}</td>
                  <td className="py-3 text-muted-foreground">{invoice.dueOn}</td>
                  <td className="py-3 font-medium">{formatCurrency(invoice.amount)}</td>
                  <td className="py-3">
                    <Badge
                      variant="outline"
                      className={invoiceStatusBadgeClass(invoice.status)}
                    >
                      {invoiceStatusLabel[invoice.status]}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <Button size="sm" variant="outline" className="gap-1.5">
                      <Banknote className="size-3.5" />
                      Pay
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </>
  );
};

export default InvoicesPage;
