"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Building2, MapPin, MoreHorizontal } from "lucide-react";

import type { CompanyProfile } from "@/lib/api/companies";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  type CompanyStatus,
  companyStatusBadgeClass,
  companyStatusLabel,
} from "../../_components/dashboard-data";

interface GetColumnsOptions {
  enableSelection?: boolean;
}

export function getColumns(
  options: GetColumnsOptions = {},
): ColumnDef<CompanyProfile>[] {
  const cols: ColumnDef<CompanyProfile>[] = [];

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
          onCheckedChange={(value) =>
            table.toggleAllPageRowsSelected(!!value)
          }
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
      accessorKey: "companyName",
      header: "Company",
      size: 220,
      meta: { sortKey: "companyName" },
      cell: ({ row }) => {
        const { companyName, website } = row.original;
        return (
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
              <Building2 className="size-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{companyName}</p>
              {website && (
                <p className="truncate text-xs text-muted-foreground">
                  {website}
                </p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "contactName",
      header: "Contact",
      size: 160,
      meta: { sortKey: "contactName" },
      cell: ({ getValue }) => (
        <span className="block truncate text-sm">
          {(getValue() as string) ?? "-"}
        </span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      size: 180,
      cell: ({ getValue }) => (
        <span className="block truncate text-sm text-muted-foreground">
          {(getValue() as string) ?? "-"}
        </span>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      size: 140,
      cell: ({ row }) => {
        const location = row.original.location;
        if (!location)
          return <span className="text-sm text-muted-foreground">-</span>;
        return (
          <div className="flex items-center gap-1.5 min-w-0">
            <MapPin className="size-3 shrink-0 text-muted-foreground" />
            <span className="block truncate text-sm text-muted-foreground">
              {location}
            </span>
          </div>
        );
      },
    },
    {
      id: "fillRate",
      header: "Fill Rate",
      size: 130,
      meta: { sortKey: "requirements" },
      accessorFn: (row) => {
        const totalNeeded = row.requirements.reduce(
          (sum, r) => sum + r.developersNeeded,
          0,
        );
        const filled = row.requirements.reduce((sum, r) => {
          const matches = r.proposedMatches ?? [];
          return (
            sum +
            matches.filter(
              (m) => m.status === "accepted" || m.status === "active",
            ).length
          );
        }, 0);
        return totalNeeded > 0 ? Math.round((filled / totalNeeded) * 100) : 0;
      },
      cell: ({ row }) => {
        const totalNeeded = row.original.requirements.reduce(
          (sum, r) => sum + r.developersNeeded,
          0,
        );
        const filled = row.original.requirements.reduce((sum, r) => {
          const matches = r.proposedMatches ?? [];
          return (
            sum +
            matches.filter(
              (m) => m.status === "accepted" || m.status === "active",
            ).length
          );
        }, 0);
        const pct =
          totalNeeded > 0 ? Math.round((filled / totalNeeded) * 100) : 0;

        if (totalNeeded === 0) {
          return (
            <span className="text-xs text-muted-foreground">No reqs</span>
          );
        }

        return (
          <div className="flex items-center gap-2 min-w-0">
            <Progress value={pct} className="h-1.5 flex-1" />
            <span className="shrink-0 font-mono text-xs text-muted-foreground">
              {filled}/{totalNeeded}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 120,
      meta: { sortKey: "status" },
      cell: ({ getValue }) => {
        const status = getValue() as CompanyStatus;
        return (
          <Badge
            variant="outline"
            className={companyStatusBadgeClass(status)}
          >
            {companyStatusLabel[status] ?? status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Submitted",
      size: 100,
      meta: { sortKey: "createdAt" },
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
        const company = row.original;
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
                <Link href={`/admin/dashboard/companies/${company.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={`/admin/dashboard/companies/${company.id}#status`}
                >
                  Change Status
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  );

  return cols;
}
