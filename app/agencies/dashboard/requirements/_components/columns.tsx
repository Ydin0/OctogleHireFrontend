"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Building2, Users } from "lucide-react";

import type { AgencyRequirement } from "@/lib/api/agencies";
import { Badge } from "@/components/ui/badge";
import { CountryFlags } from "@/lib/utils/country-flags";

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
      return "bg-emerald-500/8 text-emerald-500 border-emerald-500/15";
    case "mid":
      return "bg-sky-500/8 text-sky-500 border-sky-500/15";
    case "senior":
      return "bg-violet-500/8 text-violet-500 border-violet-500/15";
    case "lead":
      return "bg-amber-500/8 text-amber-500 border-amber-500/15";
    case "principal":
      return "bg-rose-500/8 text-rose-500 border-rose-500/15";
    default:
      return "bg-zinc-500/8 text-zinc-500 border-zinc-500/15";
  }
};

const priorityBadgeClass = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "bg-rose-500/8 text-rose-500 border-rose-500/15";
    case "high":
      return "bg-orange-500/8 text-orange-500 border-orange-500/15";
    case "medium":
      return "bg-amber-500/8 text-amber-500 border-amber-500/15";
    default:
      return "bg-zinc-500/8 text-zinc-400 border-zinc-500/15";
  }
};

const priorityLabel: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export function getColumns(): ColumnDef<AgencyRequirement>[] {
  return [
    {
      accessorKey: "title",
      header: "Requirement",
      size: 260,
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
          <Badge variant="outline" className={experienceLevelBadgeClass(level)}>
            {experienceLevelLabel[level] ?? level}
          </Badge>
        );
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      size: 100,
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
      accessorKey: "developersNeeded",
      header: "Needed",
      size: 80,
      cell: ({ getValue }) => {
        const count = (getValue() as number) ?? 0;
        return (
          <div className="flex items-center gap-1.5">
            <Users className="size-3.5 text-muted-foreground" />
            <span className="text-sm font-medium">{count}</span>
          </div>
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
          return <span className="text-sm text-muted-foreground">Flexible</span>;
        }
        const fmt = (cents: number) =>
          `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
        return (
          <span className="font-mono text-sm">
            {budgetMinCents ? fmt(budgetMinCents) : "?"}
            {" – "}
            {budgetMaxCents ? fmt(budgetMaxCents) : "?"}
          </span>
        );
      },
    },
    {
      id: "countries",
      header: "Countries",
      size: 100,
      cell: ({ row }) => {
        const codes = row.original.hiringCountries;
        if (!codes?.length) {
          return <span className="text-sm text-muted-foreground">Any</span>;
        }
        return <CountryFlags codes={codes} max={3} />;
      },
    },
    {
      accessorKey: "engagementType",
      header: "Type",
      size: 100,
      cell: ({ getValue }) => (
        <span className="text-sm capitalize text-muted-foreground">
          {(getValue() as string)?.replace(/-/g, " ") ?? "-"}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Posted",
      size: 90,
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
  ];
}
