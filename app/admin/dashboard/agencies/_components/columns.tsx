"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Briefcase, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import type { Agency } from "@/lib/api/agencies";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusBadgeClass = (status: string) => {
  switch (status) {
    case "active":
      return "bg-emerald-500/8 text-emerald-500 border-emerald-500/15";
    case "pending":
      return "bg-amber-500/8 text-amber-500 border-amber-500/15";
    case "suspended":
      return "bg-rose-500/8 text-rose-500 border-rose-500/15";
    default:
      return "bg-zinc-500/8 text-zinc-400 border-zinc-500/15";
  }
};

const statusLabel: Record<string, string> = {
  active: "Active",
  pending: "Pending",
  suspended: "Suspended",
};

interface GetColumnsOptions {
  onEdit?: (agency: Agency) => void;
  onDelete?: (agency: Agency) => void;
}

export function getColumns(
  options: GetColumnsOptions = {},
): ColumnDef<Agency>[] {
  return [
    {
      accessorKey: "name",
      header: "Agency",
      size: 220,
      cell: ({ row }) => {
        const { name, logo, location } = row.original;
        return (
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted overflow-hidden">
              {logo ? (
                <Image
                  src={logo}
                  alt={name}
                  width={32}
                  height={32}
                  className="size-8 object-contain"
                  unoptimized
                />
              ) : (
                <Briefcase className="size-4 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{name}</p>
              {location && (
                <p className="truncate text-xs text-muted-foreground">{location}</p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "contactName",
      header: "Contact",
      size: 180,
      cell: ({ row }) => {
        const { contactName, email } = row.original;
        return (
          <div className="min-w-0">
            <p className="truncate text-sm">{contactName}</p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "referralCode",
      header: "Referral Code",
      size: 130,
      cell: ({ getValue }) => (
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
          {getValue() as string}
        </code>
      ),
    },
    {
      accessorKey: "commissionRate",
      header: "Commission",
      size: 110,
      cell: ({ getValue }) => (
        <span className="font-mono text-sm">{getValue() as number}%</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 100,
      cell: ({ getValue }) => {
        const status = getValue() as string;
        return (
          <Badge variant="outline" className={statusBadgeClass(status)}>
            {statusLabel[status] ?? status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      size: 100,
      cell: ({ getValue }) => {
        const date = getValue() as string;
        if (!date) return <span className="text-sm text-muted-foreground">-</span>;
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
        const agency = row.original;
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
                  options.onEdit?.(agency);
                }}
              >
                <Pencil className="mr-2 size-3.5" />
                Edit Agency
              </DropdownMenuItem>
              {options.onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      options.onDelete!(agency);
                    }}
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
