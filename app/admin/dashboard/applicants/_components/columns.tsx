"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Building2, ExternalLink, MoreHorizontal, StickyNote } from "lucide-react";

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
      accessorKey: "professionalCategory",
      header: "Category",
      size: 100,
      cell: ({ getValue }) => {
        const category = getValue() as string | null;
        if (!category) return <span className="text-sm text-muted-foreground">-</span>;
        const styles: Record<string, string> = {
          engineering: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300",
          design: "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300",
          marketing: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300",
          hr: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
        };
        const labels: Record<string, string> = {
          engineering: "Engineering",
          design: "Design",
          marketing: "Marketing",
          hr: "HR",
        };
        return (
          <Badge variant="outline" className={`text-[10px] ${styles[category] ?? ""}`}>
            {labels[category] ?? category}
          </Badge>
        );
      },
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
      header: "Salary / Mo",
      size: 110,
      cell: ({ row }) => {
        const { salaryAmount, salaryCurrency } = row.original;
        if (salaryAmount == null || !salaryCurrency) {
          return <span className="text-sm text-muted-foreground">-</span>;
        }
        const sym = { USD: "$", GBP: "£", EUR: "€", AED: "د.إ", INR: "₹" }[salaryCurrency] ?? salaryCurrency;
        const compact = salaryAmount >= 1000
          ? `${sym}${Math.round(salaryAmount / 1000)}k`
          : `${sym}${salaryAmount}`;
        return (
          <span className="truncate font-mono text-sm" title={formatCurrency(salaryAmount, salaryCurrency)}>
            {compact}
          </span>
        );
      },
    },
    {
      id: "aiScore",
      header: "AI Score",
      size: 80,
      cell: ({ row }) => {
        const { flowmingoStatus, flowmingoScore, flowmingoSubmissionUrl } = row.original;
        if (flowmingoScore != null) {
          const score = parseFloat(flowmingoScore);
          const colorClass = score >= 7
            ? "text-emerald-600"
            : score >= 5
              ? "text-amber-600"
              : "text-red-600";

          if (flowmingoSubmissionUrl) {
            return (
              <a
                href={flowmingoSubmissionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1 font-mono text-sm font-medium ${colorClass} hover:underline`}
              >
                {flowmingoScore}
                <ExternalLink className="size-3 opacity-50" />
              </a>
            );
          }

          return (
            <span className={`font-mono text-sm font-medium ${colorClass}`}>
              {flowmingoScore}
            </span>
          );
        }
        if (flowmingoStatus) {
          return (
            <Badge variant="outline" className="text-[10px]">
              {flowmingoStatus}
            </Badge>
          );
        }
        return <span className="text-sm text-muted-foreground">-</span>;
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
      id: "source",
      header: "Source",
      size: 140,
      cell: ({ row }) => {
        const { source, agencyName } = row.original;
        if (source === "agency_referral" || source === "agency_manual") {
          return (
            <Badge
              variant="outline"
              className="gap-1 border-blue-200 bg-blue-50 text-blue-700 text-[10px] dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300"
            >
              <Building2 className="size-3" />
              {agencyName ?? "Agency"}
            </Badge>
          );
        }
        return (
          <span className="text-xs text-muted-foreground">Direct</span>
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
