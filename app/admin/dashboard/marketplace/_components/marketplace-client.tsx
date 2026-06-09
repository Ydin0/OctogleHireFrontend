"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ExternalLink, Search, Settings2, X } from "lucide-react";

import type { AdminApplication, Pagination } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DataTable } from "../../_components/data-table";
import { getColumns } from "./columns";

const TABS = [
  { value: "live", label: "Live" },
  { value: "approved", label: "Approved" },
  { value: "all", label: "All" },
] as const;

interface MarketplaceClientProps {
  applications: AdminApplication[];
  pagination: Pagination;
  liveCount: number;
}

function MarketplaceClient({
  applications,
  pagination,
  liveCount,
}: MarketplaceClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") ?? ""
  );

  const currentTab = searchParams.get("tab") ?? "live";
  const currentSortBy = searchParams.get("sortBy") ?? "";
  const currentSortOrder = searchParams.get("sortOrder") ?? "";

  const pushParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const handleSortChange = (column: string) => {
    if (currentSortBy === column) {
      if (currentSortOrder === "asc") {
        pushParams({ sortBy: column, sortOrder: "desc" });
      } else {
        pushParams({ sortBy: "", sortOrder: "" });
      }
    } else {
      pushParams({ sortBy: column, sortOrder: "asc" });
    }
  };

  const switchTab = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (tab === "live") params.delete("tab");
    else params.set("tab", tab);
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const submitSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (value.trim()) params.set("search", value.trim());
    else params.delete("search");
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const columns = getColumns();

  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">Developer Marketplace</h1>
          <p className="text-sm text-muted-foreground">
            Manage every live developer and everything companies see about them.
            <span className="ml-1 font-mono text-foreground">
              {liveCount.toLocaleString()}
            </span>{" "}
            live.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <Link href="/admin/dashboard/marketplace/settings">
              <Settings2 className="size-4" />
              Settings
            </Link>
          </Button>
          <Button asChild size="sm" className="rounded-full">
            <Link href="/admin/dashboard/marketplace/preview">
              <ExternalLink className="size-4" />
              View marketplace
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex gap-0 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => switchTab(tab.value)}
            className={cn(
              "relative px-4 py-2.5 text-sm font-medium transition-colors",
              currentTab === tab.value
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            <span
              className={cn(
                "absolute bottom-0 left-0 h-0.5 w-full bg-foreground transition-all duration-300",
                currentTab === tab.value ? "opacity-100" : "opacity-0"
              )}
            />
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitSearch(searchValue);
        }}
        className="relative max-w-sm"
      >
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search by name or email…"
          className="h-9 w-full rounded-full border border-border bg-background pl-9 pr-9 text-sm outline-none focus-visible:border-pulse/50"
        />
        {searchValue && (
          <button
            type="button"
            onClick={() => {
              setSearchValue("");
              submitSearch("");
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </form>

      <DataTable
        columns={columns}
        data={applications}
        pagination={pagination}
        onPageChange={(page) => pushParams({ page: String(page) })}
        onLimitChange={(limit) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("limit", String(limit));
          params.delete("page");
          startTransition(() => {
            router.push(`?${params.toString()}`);
          });
        }}
        onSortChange={handleSortChange}
        currentSort={
          currentSortBy
            ? {
                column: currentSortBy,
                order: currentSortOrder as "asc" | "desc",
              }
            : undefined
        }
        onRowClick={(app) =>
          router.push(`/admin/dashboard/marketplace/${app.id}`)
        }
      />
    </>
  );
}

export { MarketplaceClient };
