"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { CheckCircle2, Download, Eye, MoreHorizontal } from "lucide-react";

import type { Payout } from "@/lib/api/payouts";
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
  type PayoutStatus,
  payoutStatusBadgeClass,
  payoutStatusLabel,
  formatCurrency,
} from "../../_components/dashboard-data";

interface GetColumnsOptions {
  onMarkPaid?: (payout: Payout) => void;
}

function getMarginColorClass(marginPercent: number): string {
  if (marginPercent >= 25) return "text-emerald-600";
  if (marginPercent >= 20) return "text-amber-600";
  return "text-red-600";
}

export function getColumns(
  options: GetColumnsOptions = {},
): ColumnDef<Payout>[] {
  return [
    {
      accessorKey: "payoutNumber",
      header: "Payout",
      size: 170,
      meta: { sortKey: "payoutNumber" },
      cell: ({ row }) => {
        const { payoutNumber, periodStart, periodEnd } = row.original;
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
            <p className="text-sm font-medium">{payoutNumber}</p>
            <p className="text-xs text-muted-foreground">{period}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "developerName",
      header: "Developer",
      size: 180,
      meta: { sortKey: "developerName" },
      cell: ({ row }) => (
        <div className="min-w-0">
          <p className="truncate text-sm">{row.original.developerName}</p>
          <p className="truncate text-xs text-muted-foreground">
            {row.original.developerRole}
          </p>
        </div>
      ),
    },
    {
      id: "hours",
      header: "Hours",
      size: 70,
      cell: ({ row }) => {
        const totalHours = row.original.lineItems.reduce(
          (sum, li) => sum + li.hoursWorked,
          0,
        );
        return <span className="font-mono text-sm">{totalHours}</span>;
      },
    },
    {
      accessorKey: "total",
      header: "Payout",
      size: 110,
      meta: { sortKey: "total" },
      cell: ({ row }) => (
        <span className="block font-mono text-sm">
          {formatCurrency(row.original.total, row.original.currency)}
        </span>
      ),
    },
    {
      id: "billedAmount",
      header: "Billed",
      size: 110,
      cell: ({ row }) => {
        const billed = row.original.lineItems.reduce(
          (sum, li) => sum + li.billingAmount,
          0,
        );
        return (
          <span className="block font-mono text-sm">
            {formatCurrency(billed, row.original.currency)}
          </span>
        );
      },
    },
    {
      id: "marginPercent",
      header: "Margin",
      size: 80,
      cell: ({ row }) => {
        const billed = row.original.lineItems.reduce(
          (sum, li) => sum + li.billingAmount,
          0,
        );
        const payout = row.original.total;
        const marginPercent = billed > 0 ? ((billed - payout) / billed) * 100 : 0;
        return (
          <span
            className={`block font-mono text-sm font-medium ${getMarginColorClass(marginPercent)}`}
          >
            {marginPercent.toFixed(1)}%
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 110,
      meta: { sortKey: "status" },
      cell: ({ getValue }) => {
        const status = getValue() as PayoutStatus;
        return (
          <Badge
            variant="outline"
            className={payoutStatusBadgeClass(status)}
          >
            {payoutStatusLabel[status] ?? status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "",
      size: 50,
      cell: ({ row }) => {
        const payout = row.original;
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
                <Link href={`/admin/dashboard/payouts/${payout.id}`}>
                  <Eye className="mr-2 size-3.5" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  href={`/api/payouts/${payout.id}/pdf`}
                  download={`${payout.payoutNumber}.pdf`}
                >
                  <Download className="mr-2 size-3.5" />
                  Download PDF
                </a>
              </DropdownMenuItem>
              {payout.status !== "paid" && payout.status !== "cancelled" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => options.onMarkPaid?.(payout)}
                  >
                    <CheckCircle2 className="mr-2 size-3.5" />
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
