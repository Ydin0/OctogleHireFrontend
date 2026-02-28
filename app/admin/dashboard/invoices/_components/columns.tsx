"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Download, Eye, MoreHorizontal } from "lucide-react";

import type { Invoice } from "@/lib/api/invoices";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  type InvoiceStatus,
  invoiceStatusBadgeClass,
  invoiceStatusLabel,
  formatCurrency,
  formatDate,
} from "../../_components/dashboard-data";

interface GetColumnsOptions {
  onMarkPaid?: (invoice: Invoice) => void;
}

export function getColumns(
  options: GetColumnsOptions = {},
): ColumnDef<Invoice>[] {
  return [
    {
      accessorKey: "invoiceNumber",
      header: "Invoice",
      size: 180,
      meta: { sortKey: "invoiceNumber" },
      cell: ({ row }) => {
        const { invoiceNumber, periodStart, periodEnd } = row.original;
        const start = new Date(periodStart).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
        const end = new Date(periodEnd).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
        const period = start === end ? start : `${start} – ${end}`;
        return (
          <div className="min-w-0">
            <p className="text-sm font-medium">{invoiceNumber}</p>
            <p className="text-xs text-muted-foreground">{period}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "companyName",
      header: "Company",
      size: 180,
      meta: { sortKey: "companyName" },
      cell: ({ getValue }) => (
        <span className="block truncate text-sm">
          {(getValue() as string) ?? "-"}
        </span>
      ),
    },
    {
      accessorKey: "total",
      header: "Amount",
      size: 120,
      meta: { sortKey: "total" },
      cell: ({ row }) => (
        <span className="block font-mono text-sm">
          {formatCurrency(row.original.total, row.original.currency)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 110,
      meta: { sortKey: "status" },
      cell: ({ getValue }) => {
        const status = getValue() as InvoiceStatus;
        return (
          <Badge
            variant="outline"
            className={invoiceStatusBadgeClass(status)}
          >
            {invoiceStatusLabel[status] ?? status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "issuedAt",
      header: "Issued",
      size: 100,
      meta: { sortKey: "issuedAt" },
      cell: ({ getValue }) => {
        const date = getValue() as string | null;
        if (!date)
          return <span className="text-sm text-muted-foreground">-</span>;
        return (
          <span className="text-sm text-muted-foreground">
            {formatDate(date)}
          </span>
        );
      },
    },
    {
      accessorKey: "dueDate",
      header: "Due",
      size: 100,
      meta: { sortKey: "dueDate" },
      cell: ({ row }) => {
        const { dueDate, status } = row.original;
        if (!dueDate)
          return <span className="text-sm text-muted-foreground">-</span>;
        const isOverdue = status === "overdue";
        return (
          <span
            className={`text-sm ${isOverdue ? "font-medium text-red-600" : "text-muted-foreground"}`}
          >
            {formatDate(dueDate)}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      size: 50,
      cell: ({ row }) => {
        const invoice = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/admin/dashboard/invoices/${invoice.id}`}>
                  <Eye className="mr-2 size-3.5" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  href={`/api/invoices/${invoice.id}/pdf`}
                  download={`${invoice.invoiceNumber}.pdf`}
                >
                  <Download className="mr-2 size-3.5" />
                  Download PDF
                </a>
              </DropdownMenuItem>
              {invoice.status !== "paid" &&
                invoice.status !== "cancelled" &&
                invoice.status !== "draft" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => options.onMarkPaid?.(invoice)}
                    >
                      Mark as Paid
                    </DropdownMenuItem>
                  </>
                )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
