"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { MoreHorizontal, ShieldCheck, Star } from "lucide-react";

import type { AdminApplication } from "@/lib/api/admin";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const getInitials = (name: string | null) => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export function getColumns(): ColumnDef<AdminApplication>[] {
  return [
    {
      accessorKey: "fullName",
      header: "Developer",
      size: 240,
      meta: { sortKey: "fullName" },
      cell: ({ row }) => {
        const { fullName, email, profilePhotoPath } = row.original;
        return (
          <div className="flex min-w-0 items-center gap-3">
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
                {email ?? "—"}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "professionalTitle",
      header: "Role",
      size: 190,
      meta: { sortKey: "professionalTitle" },
      cell: ({ getValue }) => (
        <span className="block truncate text-sm">
          {(getValue() as string | null) ?? "—"}
        </span>
      ),
    },
    {
      id: "location",
      header: "Location",
      size: 150,
      cell: ({ row }) => {
        const { locationCity, locationState } = row.original;
        const parts = [locationCity, locationState].filter(Boolean);
        return (
          <span className="block truncate text-sm text-muted-foreground">
            {parts.length > 0 ? parts.join(", ") : "—"}
          </span>
        );
      },
    },
    {
      id: "tag",
      header: "Badge",
      size: 130,
      cell: ({ row }) => {
        const profile = row.original.marketplaceProfile;
        if (!profile?.tag) {
          return <span className="text-xs text-muted-foreground">—</span>;
        }
        return (
          <Badge
            variant="outline"
            className="gap-1 border-pulse/35 bg-pulse/10 text-[10px] font-mono uppercase tracking-wider text-pulse"
          >
            {profile.tag}
            {profile.tagEmoji ? ` ${profile.tagEmoji}` : ""}
          </Badge>
        );
      },
    },
    {
      id: "rate",
      header: "Rate",
      size: 90,
      cell: ({ row }) => {
        const cents = row.original.hourlyRateCents;
        if (cents == null) {
          return <span className="text-sm text-muted-foreground">—</span>;
        }
        return (
          <span className="font-mono text-sm">
            ${Math.round(cents / 100)}
            <span className="text-xs text-muted-foreground">/hr</span>
          </span>
        );
      },
    },
    {
      id: "gauntlet",
      header: "Gauntlet",
      size: 90,
      cell: ({ row }) => {
        const overall = row.original.marketplaceProfile?.gauntlet?.overall;
        if (overall == null) {
          return <span className="text-sm text-muted-foreground">—</span>;
        }
        return (
          <span className="inline-flex items-center gap-1 font-mono text-sm">
            <ShieldCheck className="size-3.5 text-pulse" />
            {overall}
          </span>
        );
      },
    },
    {
      accessorKey: "isFeatured",
      header: "Featured",
      size: 80,
      cell: ({ getValue }) =>
        (getValue() as boolean) ? (
          <Star className="size-4 fill-pulse text-pulse" />
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        ),
    },
    {
      accessorKey: "isLive",
      header: "Live",
      size: 60,
      cell: ({ getValue }) =>
        (getValue() as boolean) ? (
          <span className="inline-flex items-center gap-1.5 text-xs">
            <span className="size-2.5 rounded-full bg-emerald-500" />
          </span>
        ) : (
          <span className="size-2.5 inline-block rounded-full bg-zinc-300 dark:bg-zinc-600" />
        ),
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
                <Link href={`/admin/dashboard/marketplace/${app.id}`}>
                  Edit profile
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
