"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Check, MoreHorizontal, X } from "lucide-react";

import type { AdminTimeEntry } from "@/lib/api/time-entries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  type TimeEntryStatus,
  timeEntryStatusBadgeClass,
  timeEntryStatusLabel,
  formatCurrency,
} from "../../_components/dashboard-data";

interface GetColumnsOptions {
  onApprove?: (entry: AdminTimeEntry) => void;
  onReject?: (entry: AdminTimeEntry) => void;
}

export function getColumns(
  options: GetColumnsOptions = {},
): ColumnDef<AdminTimeEntry>[] {
  return [
    {
      accessorKey: "developerName",
      header: "Developer",
      size: 160,
      meta: { sortKey: "developerName" },
      cell: ({ row }) => {
        const { developerName, developerRole } = row.original;
        return (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{developerName}</p>
            <p className="truncate text-xs text-muted-foreground">
              {developerRole}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "companyName",
      header: "Company",
      size: 150,
      meta: { sortKey: "companyName" },
      cell: ({ getValue }) => (
        <span className="block truncate text-sm">
          {(getValue() as string) ?? "-"}
        </span>
      ),
    },
    {
      accessorKey: "requirementTitle",
      header: "Role",
      size: 160,
      cell: ({ getValue }) => (
        <span className="block truncate text-sm text-muted-foreground">
          {(getValue() as string) ?? "-"}
        </span>
      ),
    },
    {
      accessorKey: "period",
      header: "Period",
      size: 100,
      meta: { sortKey: "period" },
      cell: ({ getValue }) => (
        <span className="block font-mono text-sm">
          {getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "hours",
      header: "Hours",
      size: 80,
      meta: { sortKey: "hours" },
      cell: ({ getValue }) => (
        <span className="block text-right font-mono text-sm">
          {getValue() as number}
        </span>
      ),
    },
    {
      accessorKey: "billingAmount",
      header: "Billing Amount",
      size: 130,
      meta: { sortKey: "billingAmount" },
      cell: ({ row }) => (
        <span className="block text-right font-mono text-sm">
          {formatCurrency(row.original.billingAmount)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 110,
      meta: { sortKey: "status" },
      cell: ({ getValue }) => {
        const status = getValue() as TimeEntryStatus;
        return (
          <Badge
            variant="outline"
            className={timeEntryStatusBadgeClass(status)}
          >
            {timeEntryStatusLabel[status] ?? status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "",
      size: 50,
      cell: ({ row }) => {
        const entry = row.original;
        if (entry.status !== "submitted") return null;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => options.onApprove?.(entry)}
              >
                <Check className="mr-2 size-3.5" />
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => options.onReject?.(entry)}
                className="text-red-600 focus:text-red-600"
              >
                <X className="mr-2 size-3.5" />
                Reject
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
