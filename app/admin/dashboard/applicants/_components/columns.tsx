"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { MoreHorizontal, StickyNote } from "lucide-react";

import type { AdminApplication } from "@/lib/api/admin";
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
  type ApplicationStatus,
  applicationStatusBadgeClass,
  applicationStatusLabel,
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
  onQuickNote?: (app: AdminApplication) => void;
  enableSelection?: boolean;
}

export function getColumns(options: GetColumnsOptions = {}): ColumnDef<AdminApplication>[] {
  const cols: ColumnDef<AdminApplication>[] = [];

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
      header: "Developer",
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
      accessorKey: "professionalTitle",
      header: "Title",
      size: 180,
      meta: { sortKey: "professionalTitle" },
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
      accessorKey: "primaryStack",
      header: "Stack",
      size: 180,
      cell: ({ getValue }) => {
        const stack = (getValue() as string[] | null) ?? [];
        return (
          <div className="flex flex-wrap gap-1">
            {stack.slice(0, 3).map((tech) => (
              <Badge key={tech} variant="outline" className="text-[10px]">
                {tech}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 140,
      meta: { sortKey: "status" },
      cell: ({ getValue }) => {
        const status = getValue() as ApplicationStatus;
        return (
          <Badge
            variant="outline"
            className={applicationStatusBadgeClass(status)}
          >
            {applicationStatusLabel[status] ?? status}
          </Badge>
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
                <Link href={`/admin/dashboard/applicants/${app.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/admin/dashboard/applicants/${app.id}#status`}>
                  Change Status
                </Link>
              </DropdownMenuItem>
              {options.onQuickNote && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => options.onQuickNote!(app)}
                  >
                    <StickyNote className="mr-2 size-3.5" />
                    Add Note
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }
  );

  return cols;
}

// Keep backwards-compatible export
export const columns = getColumns();
