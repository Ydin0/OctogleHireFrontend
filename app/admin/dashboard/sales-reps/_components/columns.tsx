"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import { Building2, MoreHorizontal } from "lucide-react";

import type { AdminSalesRepApplication } from "@/lib/api/admin-sales-rep";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
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
  type SalesRepApplicationStatus,
  salesRepApplicationStatusBadgeClass,
  salesRepApplicationStatusLabel,
  formatCurrency,
} from "../../_components/dashboard-data";

const getInitials = (name: string | null) => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

interface GetColumnsOptions {
  enableSelection?: boolean;
}

export function getColumns(
  options: GetColumnsOptions = {}
): ColumnDef<AdminSalesRepApplication>[] {
  const cols: ColumnDef<AdminSalesRepApplication>[] = [];

  if (options.enableSelection) {
    cols.push({
      id: "select",
      size: 40,
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
    });
  }

  cols.push(
    {
      accessorKey: "fullName",
      header: "Sales Rep",
      size: 220,
      meta: { sortKey: "fullName" },
      cell: ({ row }) => {
        const { fullName, email, profilePhotoPath } = row.original;
        return (
          <div className="flex items-center gap-3 min-w-0">
            <Avatar size="sm" className="shrink-0">
              {profilePhotoPath && (
                <AvatarImage src={profilePhotoPath} alt={fullName ?? ""} />
              )}
              <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {fullName ?? "Unknown"}
              </p>
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "salesRoleTitle",
      header: "Role",
      size: 200,
      meta: { sortKey: "salesRoleTitle" },
      cell: ({ getValue }) => (
        <span className="block truncate text-sm">
          {(getValue() as string) ?? "-"}
        </span>
      ),
    },
    {
      id: "location",
      header: "Location",
      size: 160,
      cell: ({ row }) => {
        const { locationCity, locationState } = row.original;
        const parts = [locationCity, locationState].filter(Boolean);
        return (
          <span className="block truncate text-sm text-muted-foreground">
            {parts.length > 0 ? parts.join(", ") : "-"}
          </span>
        );
      },
    },
    {
      accessorKey: "yearsOfExperience",
      header: "Exp",
      size: 60,
      meta: { sortKey: "yearsOfExperience" },
      cell: ({ getValue }) => {
        const years = getValue() as number | null;
        return (
          <span className="font-mono text-sm">
            {years != null ? `${years}yr` : "-"}
          </span>
        );
      },
    },
    {
      id: "salary",
      header: "OTE / Mo",
      size: 110,
      cell: ({ row }) => {
        const { salaryAmount, salaryCurrency } = row.original;
        if (salaryAmount == null || !salaryCurrency) {
          return <span className="text-sm text-muted-foreground">-</span>;
        }
        const sym =
          ({
            USD: "$",
            GBP: "£",
            EUR: "€",
            AED: "د.إ",
            INR: "₹",
          } as Record<string, string>)[salaryCurrency] ?? salaryCurrency;
        const compact =
          salaryAmount >= 1000
            ? `${sym}${Math.round(salaryAmount / 1000)}k`
            : `${sym}${salaryAmount}`;
        return (
          <span
            className="truncate font-mono text-sm"
            title={formatCurrency(salaryAmount, salaryCurrency)}
          >
            {compact}
          </span>
        );
      },
    },
    {
      accessorKey: "salesTools",
      header: "Tools",
      size: 200,
      cell: ({ getValue }) => {
        const tools = (getValue() as string[] | null) ?? [];
        return (
          <div className="flex flex-wrap gap-1">
            {tools.slice(0, 2).map((tool) => (
              <Badge key={tool} variant="outline" className="text-[10px]">
                {tool}
              </Badge>
            ))}
            {tools.length > 2 && (
              <span className="text-[10px] text-muted-foreground">
                +{tools.length - 2}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 160,
      meta: { sortKey: "status" },
      cell: ({ getValue }) => {
        const status = getValue() as SalesRepApplicationStatus;
        return (
          <Badge
            variant="outline"
            className={salesRepApplicationStatusBadgeClass(status)}
          >
            {salesRepApplicationStatusLabel[status] ?? status}
          </Badge>
        );
      },
    },
    {
      id: "source",
      header: "Source",
      size: 140,
      cell: ({ row }) => {
        const { source, agencyName, agencyId, agencyLogo } = row.original;
        if (
          source === "agency" ||
          source === "agency_referral" ||
          source === "agency_manual"
        ) {
          const href = agencyId
            ? `/admin/dashboard/agencies/${agencyId}`
            : undefined;
          const badge = (
            <Badge
              variant="outline"
              className="gap-1.5 border-blue-500/15 bg-blue-500/8 text-blue-500 text-[10px]"
            >
              {agencyLogo ? (
                <Image
                  src={agencyLogo}
                  alt={agencyName ?? ""}
                  width={14}
                  height={14}
                  className="size-3.5 rounded-full object-contain"
                  unoptimized
                />
              ) : (
                <Building2 className="size-3" />
              )}
              {agencyName ?? "Agency"}
            </Badge>
          );
          return href ? (
            <Link href={href} onClick={(e) => e.stopPropagation()}>
              {badge}
            </Link>
          ) : (
            badge
          );
        }
        return (
          <span className="text-xs text-muted-foreground capitalize">
            {source?.replace(/_/g, " ") ?? "Direct"}
          </span>
        );
      },
    },
    {
      accessorKey: "isLive",
      header: "Live",
      size: 50,
      cell: ({ getValue }) => {
        const live = getValue() as boolean;
        return live ? (
          <span className="inline-block size-2.5 rounded-full bg-emerald-500" />
        ) : (
          <span className="inline-block size-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        );
      },
    },
    {
      accessorKey: "submittedAt",
      header: "Submitted",
      size: 100,
      meta: { sortKey: "submittedAt" },
      cell: ({ getValue }) => {
        const date = getValue() as string | null;
        if (!date)
          return <span className="text-sm text-muted-foreground">-</span>;
        return (
          <span className="text-sm text-muted-foreground">
            {new Date(date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      size: 50,
      cell: ({ row }) => {
        const app = row.original;
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
                <Link href={`/admin/dashboard/sales-reps/${app.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/admin/dashboard/sales-reps/${app.id}#status`}>
                  Change Status
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }
  );

  return cols;
}
