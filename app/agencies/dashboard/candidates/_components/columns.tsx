"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { AlertTriangle, MoreHorizontal } from "lucide-react";

import type { UnifiedCandidate } from "@/lib/api/agencies";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  type ApplicationStatus,
  applicationStatusBadgeClass,
  applicationStatusLabel,
} from "@/app/admin/dashboard/_components/dashboard-data";

const getInitials = (name: string | null) => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const sourceBadgeClass = (source: string) => {
  switch (source) {
    case "extension":
      return "bg-teal-500/10 text-teal-600 border-teal-600/20";
    case "referral":
      return "bg-blue-500/10 text-blue-600 border-blue-600/20";
    default:
      return "bg-zinc-500/10 text-zinc-600 border-zinc-600/20";
  }
};

export function getColumns(): ColumnDef<UnifiedCandidate>[] {
  return [
    {
      accessorKey: "fullName",
      header: "Developer",
      size: 220,
      meta: { sortKey: "fullName" },
      cell: ({ row }) => {
        const { fullName, email, professionalTitle, profilePhotoPath } = row.original;
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
              <p className="truncate text-xs text-muted-foreground">
                {email ?? professionalTitle ?? "-"}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      id: "completeness",
      header: "",
      size: 36,
      cell: ({ row }) => {
        const { email, professionalTitle, primaryStack } = row.original;
        const missing: string[] = [];
        if (!email || email.includes("@linkedin-import.placeholder") || email.includes("@import.placeholder")) missing.push("email");
        if (!professionalTitle) missing.push("title");
        if (!primaryStack || primaryStack.length === 0) missing.push("skills");
        if (missing.length === 0) return null;
        return (
          <div title={`Missing: ${missing.join(", ")}`}>
            <AlertTriangle className={`size-4 ${missing.includes("email") ? "text-red-500" : "text-amber-500"}`} />
          </div>
        );
      },
    },
    {
      accessorKey: "professionalTitle",
      header: "Title",
      size: 180,
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
      cell: ({ row }) => (
        <span className="block truncate text-sm text-muted-foreground">
          {row.original.location || "-"}
        </span>
      ),
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
        const status = getValue() as string;
        return (
          <Badge
            variant="outline"
            className={applicationStatusBadgeClass(status as ApplicationStatus)}
          >
            {applicationStatusLabel[status as ApplicationStatus] ?? status.replace(/_/g, " ")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "source",
      header: "Source",
      size: 100,
      cell: ({ getValue }) => {
        const source = getValue() as string;
        const label = source === "extension" ? "Extension" : source === "referral" ? "Referral" : source;
        return (
          <Badge variant="outline" className={sourceBadgeClass(source)}>
            {label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Added",
      size: 100,
      meta: { sortKey: "createdAt" },
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
        const candidate = row.original;
        const href =
          candidate.sourceTable === "saved"
            ? `/agencies/dashboard/candidates/${candidate.id}?source=saved`
            : `/agencies/dashboard/candidates/${candidate.id}`;
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
                <Link href={href}>View Details</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
