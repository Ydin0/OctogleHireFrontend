"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import { Building2, MoreHorizontal, Pencil, Star, Trash2 } from "lucide-react";

import type { AdminRequirement } from "@/lib/api/admin";
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
  type RequirementStatus,
  requirementStatusBadgeClass,
  requirementStatusLabel,
  priorityBadgeClass,
  priorityLabel,
} from "../../_components/dashboard-data";

interface GetColumnsOptions {
  onToggleFeatured?: (requirement: AdminRequirement) => void;
  onDelete?: (requirement: AdminRequirement) => void;
}

const experienceLevelLabel: Record<string, string> = {
  junior: "Junior",
  mid: "Mid",
  senior: "Senior",
  lead: "Lead",
  principal: "Principal",
};

const experienceLevelBadgeClass = (level: string) => {
  switch (level) {
    case "junior":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-600/20";
    case "mid":
      return "bg-blue-500/10 text-blue-600 border-blue-600/20";
    case "senior":
      return "bg-violet-500/10 text-violet-600 border-violet-600/20";
    case "lead":
      return "bg-orange-500/10 text-orange-600 border-orange-600/20";
    case "principal":
      return "bg-red-500/10 text-red-600 border-red-600/20";
    default:
      return "bg-zinc-500/10 text-zinc-600 border-zinc-600/20";
  }
};

export function getColumns(
  options: GetColumnsOptions = {}
): ColumnDef<AdminRequirement>[] {
  return [
    {
      accessorKey: "title",
      header: "Requirement",
      size: 260,
      meta: { sortKey: "title" },
      cell: ({ row }) => {
        const { title, companyName, companyLogoUrl } = row.original;
        return (
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted overflow-hidden">
              {companyLogoUrl ? (
                <Image
                  src={companyLogoUrl}
                  alt={companyName ?? ""}
                  width={32}
                  height={32}
                  className="size-8 object-contain"
                  unoptimized
                />
              ) : (
                <Building2 className="size-4 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{title}</p>
              <p className="truncate text-xs text-muted-foreground">
                {companyName ?? "Unknown"}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "techStack",
      header: "Tech Stack",
      size: 180,
      cell: ({ getValue }) => {
        const stack = (getValue() as string[]) ?? [];
        const display = stack.slice(0, 3);
        const remaining = stack.length - 3;
        return (
          <div className="flex flex-wrap gap-1">
            {display.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-[10px]">
                {tech}
              </Badge>
            ))}
            {remaining > 0 && (
              <Badge variant="outline" className="text-[10px]">
                +{remaining}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "experienceLevel",
      header: "Experience",
      size: 100,
      cell: ({ getValue }) => {
        const level = getValue() as string;
        return (
          <Badge
            variant="outline"
            className={experienceLevelBadgeClass(level)}
          >
            {experienceLevelLabel[level] ?? level}
          </Badge>
        );
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      size: 100,
      meta: { sortKey: "priority" },
      cell: ({ getValue }) => {
        const p = getValue() as string;
        return (
          <Badge variant="outline" className={priorityBadgeClass(p)}>
            {priorityLabel[p] ?? p}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 100,
      meta: { sortKey: "status" },
      cell: ({ getValue }) => {
        const status = getValue() as RequirementStatus;
        return (
          <Badge
            variant="outline"
            className={requirementStatusBadgeClass(status)}
          >
            {requirementStatusLabel[status] ?? status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "isFeatured",
      header: "Featured",
      size: 80,
      cell: ({ row }) => {
        const req = row.original;
        return (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              options.onToggleFeatured?.(req);
            }}
            className="inline-flex items-center justify-center"
            title={req.isFeatured ? "Remove from featured" : "Mark as featured"}
          >
            <Star
              className={`size-4 transition-colors ${
                req.isFeatured
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/40 hover:text-amber-400"
              }`}
            />
          </button>
        );
      },
    },
    {
      id: "budget",
      header: "Budget",
      size: 130,
      cell: ({ row }) => {
        const { budgetMinCents, budgetMaxCents } = row.original;
        if (!budgetMinCents && !budgetMaxCents) {
          return <span className="text-sm text-muted-foreground">-</span>;
        }
        const fmt = (cents: number) =>
          `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
        return (
          <span className="font-mono text-sm">
            {budgetMinCents ? fmt(budgetMinCents) : "?"}
            {" - "}
            {budgetMaxCents ? fmt(budgetMaxCents) : "?"}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
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
        const req = row.original;
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
                <Link href={`/admin/dashboard/requirements/${req.id}`}>
                  <Pencil className="mr-2 size-3.5" />
                  View / Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  options.onToggleFeatured?.(req);
                }}
              >
                <Star className="mr-2 size-3.5" />
                {req.isFeatured ? "Unfeature" : "Feature"}
              </DropdownMenuItem>
              {options.onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      options.onDelete!(req);
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
