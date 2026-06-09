"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Download, Eye, MoreHorizontal, Trash2 } from "lucide-react";

import type { Invoice } from "@/lib/api/invoices";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  onDelete?: (invoice: Invoice) => void;
  formatDisplay?: (amount: number, fromCurrency: string) => string;
}

const stop = (e: React.MouseEvent) => e.stopPropagation();

export function getColumns(
  options: GetColumnsOptions = {},
): ColumnDef<Invoice>[] {
  return [
    // ── Selection ─────────────────────────────────────────────────────────
    {
      id: "select",
      size: 36,
      header: ({ table }) => (
        <div className="flex items-center" onClick={stop}>
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected()
                ? true
                : table.getIsSomePageRowsSelected()
                  ? "indeterminate"
                  : false
            }
            onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center" onClick={stop}>
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(v) => row.toggleSelected(!!v)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
    },
    // ── Invoice + period ──────────────────────────────────────────────────
    {
      accessorKey: "invoiceNumber",
      header: "Invoice",
      size: 170,
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
    // ── Company ──────────────────────────────────────────────────────────
    {
      accessorKey: "companyName",
      header: "Company",
      size: 170,
      meta: { sortKey: "companyName" },
      cell: ({ getValue }) => (
        <span className="block truncate text-sm">
          {(getValue() as string) ?? "-"}
        </span>
      ),
    },
    // ── Developer ─────────────────────────────────────────────────────────
    {
      id: "developer",
      header: "Developer",
      size: 150,
      cell: ({ row }) => {
        const { developerName, developerRole } = row.original;
        if (!developerName)
          return <span className="text-sm text-muted-foreground">—</span>;
        return (
          <div className="min-w-0">
            <p className="truncate text-sm">{developerName}</p>
            {developerRole && (
              <p className="truncate text-xs text-muted-foreground">
                {developerRole}
              </p>
            )}
          </div>
        );
      },
    },
    // ── Amount ────────────────────────────────────────────────────────────
    {
      accessorKey: "total",
      header: "Amount",
      size: 130,
      meta: { sortKey: "total" },
      cell: ({ row }) => (
        <span className="block font-mono text-sm">
          {(options.formatDisplay ?? formatCurrency)(
            row.original.total,
            row.original.currency,
          )}
        </span>
      ),
    },
    // ── Currency (small) ──────────────────────────────────────────────────
    {
      accessorKey: "currency",
      header: "Currency",
      size: 80,
      cell: ({ getValue }) => (
        <span className="text-xs font-mono text-muted-foreground">
          {getValue() as string}
        </span>
      ),
    },
    // ── Effective status ──────────────────────────────────────────────────
    {
      id: "effectiveStatus",
      header: "Status",
      size: 130,
      meta: { sortKey: "status" },
      cell: ({ row }) => {
        const { status, effectiveStatus } = row.original;
        const display = (effectiveStatus ?? status) as InvoiceStatus;
        const isAuto = effectiveStatus && effectiveStatus !== status;
        return (
          <div className="flex items-center gap-1.5">
            <Badge
              variant="outline"
              className={invoiceStatusBadgeClass(display)}
            >
              {invoiceStatusLabel[display] ?? display}
            </Badge>
            {isAuto && (
              <span
                className="text-[9px] uppercase tracking-wider text-muted-foreground"
                title="Auto-detected from due date"
              >
                auto
              </span>
            )}
          </div>
        );
      },
    },
    // ── Issued ────────────────────────────────────────────────────────────
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
    // ── Due ───────────────────────────────────────────────────────────────
    {
      accessorKey: "dueDate",
      header: "Due",
      size: 100,
      meta: { sortKey: "dueDate" },
      cell: ({ row }) => {
        const { dueDate, effectiveStatus } = row.original;
        if (!dueDate)
          return <span className="text-sm text-muted-foreground">-</span>;
        const isOverdue = effectiveStatus === "overdue";
        return (
          <span
            className={`text-sm ${isOverdue ? "font-medium text-red-600" : "text-muted-foreground"}`}
          >
            {formatDate(dueDate)}
          </span>
        );
      },
    },
    // ── Days overdue ──────────────────────────────────────────────────────
    {
      id: "daysOverdue",
      header: "Late",
      size: 70,
      cell: ({ row }) => {
        const { daysOverdue, effectiveStatus } = row.original;
        if (effectiveStatus !== "overdue" || !daysOverdue) {
          return <span className="text-sm text-muted-foreground">—</span>;
        }
        return (
          <span className="font-mono text-sm font-medium text-red-600">
            {daysOverdue}d
          </span>
        );
      },
    },
    // ── Actions ───────────────────────────────────────────────────────────
    {
      id: "actions",
      header: "",
      size: 50,
      cell: ({ row }) => {
        const invoice = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={stop}
              >
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
              {options.onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => options.onDelete?.(invoice)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 size-3.5" />
                    Delete
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
