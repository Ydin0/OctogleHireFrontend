"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Building2, Clock, MoreHorizontal, Pencil } from "lucide-react";

import type { AdminEngagement } from "@/lib/api/admin";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ── Helpers ─────────────────────────────────────────────────────────────────

const engagementStatusBadgeClass = (status: string) => {
  switch (status) {
    case "active":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-600/20";
    case "pending":
      return "bg-amber-500/10 text-amber-700 border-amber-600/20";
    case "cancelled":
      return "bg-red-500/10 text-red-600 border-red-600/20";
    case "ended":
      return "bg-zinc-500/10 text-zinc-600 border-zinc-600/20";
    default:
      return "bg-zinc-500/10 text-zinc-600 border-zinc-600/20";
  }
};

const engagementStatusLabel: Record<string, string> = {
  active: "Active",
  pending: "Pending",
  cancelled: "Cancelled",
  ended: "Ended",
};

const formatCurrency = (amount: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

// ── Columns ─────────────────────────────────────────────────────────────────

interface GetColumnsOptions {
  onAddTimesheet?: (engagement: AdminEngagement) => void;
  onEdit?: (engagement: AdminEngagement) => void;
  formatDisplay?: (amount: number, fromCurrency: string) => string;
}

export function getColumns(
  options: GetColumnsOptions = {},
): ColumnDef<AdminEngagement>[] {
  return [
    {
      accessorKey: "developerName",
      header: "Developer",
      size: 180,
      cell: ({ row }) => {
        const { developerName, developerRole, developerAvatar } = row.original;
        return (
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="size-8 shrink-0">
              {developerAvatar && (
                <AvatarImage src={developerAvatar} alt={developerName} />
              )}
              <AvatarFallback className="text-[10px]">
                {getInitials(developerName || "D")}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{developerName}</p>
              <p className="truncate text-xs text-muted-foreground">
                {developerRole}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "companyName",
      header: "Company",
      size: 170,
      cell: ({ row }) => {
        const { companyName, companyLogoUrl } = row.original;
        return (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted overflow-hidden">
              {companyLogoUrl ? (
                <Image
                  src={companyLogoUrl}
                  alt={companyName ?? ""}
                  width={28}
                  height={28}
                  className="size-7 object-contain"
                  unoptimized
                />
              ) : (
                <Building2 className="size-3.5 text-muted-foreground" />
              )}
            </div>
            <span className="truncate text-sm">{companyName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "requirementTitle",
      header: "Requirement",
      size: 180,
      cell: ({ getValue }) => (
        <span className="block truncate text-sm text-muted-foreground">
          {(getValue() as string) ?? "-"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 100,
      cell: ({ getValue }) => {
        const status = getValue() as string;
        return (
          <Badge variant="outline" className={engagementStatusBadgeClass(status)}>
            {engagementStatusLabel[status] ?? status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "engagementType",
      header: "Type",
      size: 110,
      cell: ({ getValue }) => (
        <span className="text-sm capitalize text-muted-foreground">
          {(getValue() as string)?.replace(/-/g, " ") ?? "-"}
        </span>
      ),
    },
    {
      id: "billingRate",
      header: "Billing Rate",
      size: 130,
      cell: ({ row }) => {
        const { companyBillingRate, currency } = row.original;
        const fmt = options.formatDisplay ?? formatCurrency;
        return (
          <span className="font-mono text-sm">
            {fmt(companyBillingRate, currency)}/hr
          </span>
        );
      },
    },
    {
      id: "payoutRate",
      header: "Payout Rate",
      size: 130,
      cell: ({ row }) => {
        const { developerPayoutRate, payoutCurrency } = row.original;
        return (
          <span className="font-mono text-sm text-muted-foreground">
            {formatCurrency(developerPayoutRate, payoutCurrency)}/hr
          </span>
        );
      },
    },
    {
      id: "hours",
      header: "Hours/mo",
      size: 90,
      cell: ({ row }) => {
        const cap = row.original.monthlyHoursCap;
        const expected = row.original.monthlyHoursExpected;
        const display = cap ?? expected;
        return (
          <span className="font-mono text-sm">
            {display ? `${display}h` : "-"}
          </span>
        );
      },
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      size: 110,
      cell: ({ getValue }) => {
        const date = getValue() as string | null;
        if (!date) return <span className="text-sm text-muted-foreground">-</span>;
        return (
          <span className="text-sm text-muted-foreground">
            {new Date(date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        );
      },
    },
    {
      id: "timesheet",
      header: "This Month",
      size: 130,
      cell: ({ row }) => {
        const te = row.original.currentMonthTimeEntry;
        if (!te) {
          return (
            <span className="flex items-center gap-1 text-xs text-amber-600">
              <span className="size-1.5 rounded-full bg-amber-500" />
              No submission
            </span>
          );
        }
        if (te.status === "rejected") {
          return (
            <span className="flex items-center gap-1 text-xs text-red-600">
              <span className="size-1.5 rounded-full bg-red-500" />
              Rejected ({te.hours}h)
            </span>
          );
        }
        return (
          <span className="flex items-center gap-1 text-xs text-emerald-600">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            {te.hours}h ({te.status})
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      size: 50,
      cell: ({ row }) => {
        const eng = row.original;
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
                onClick={(e) => {
                  e.stopPropagation();
                  options.onEdit?.(eng);
                }}
              >
                <Pencil className="mr-2 size-3.5" />
                Edit Engagement
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  options.onAddTimesheet?.(eng);
                }}
              >
                <Clock className="mr-2 size-3.5" />
                Add Timesheet
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
