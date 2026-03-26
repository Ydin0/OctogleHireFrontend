"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";

import type {
  AgencyRequirement,
  MarketplaceFilterOptions,
  MarketplaceParams,
  Pagination,
} from "@/lib/api/agencies";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DataTable } from "@/app/admin/dashboard/_components/data-table";
import { getColumns } from "./columns";

// ── Tabs ────────────────────────────────────────────────────────────────────

const PRIORITY_TABS = [
  { value: "all", label: "All" },
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
] as const;

// ── Component ───────────────────────────────────────────────────────────────

interface MarketplaceClientProps {
  requirements: AgencyRequirement[];
  pagination: Pagination;
  filterOptions: MarketplaceFilterOptions;
  activeParams: MarketplaceParams;
}

function MarketplaceClient({
  requirements,
  pagination,
  filterOptions,
  activeParams,
}: MarketplaceClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentPriority = searchParams.get("priority") ?? "all";
  const currentSearch = searchParams.get("search") ?? "";
  const currentExp = searchParams.get("experienceLevel") ?? "";
  const currentType = searchParams.get("engagementType") ?? "";
  const currentStack = searchParams.get("techStack") ?? "";
  const currentSortBy = searchParams.get("sortBy") ?? "";
  const currentSortOrder = searchParams.get("sortOrder") ?? "";

  const [searchValue, setSearchValue] = useState(currentSearch);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const pushParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value && value !== "all") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      params.delete("page");
      startTransition(() => {
        router.push(`?${params.toString()}`);
      });
    },
    [router, searchParams, startTransition],
  );

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== currentSearch) {
        pushParams({ search: searchValue });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue, currentSearch, pushParams]);

  const hasFilters =
    currentSearch || currentExp || currentType || currentStack || currentPriority !== "all";

  const clearAll = () => {
    const params = new URLSearchParams();
    const limit = searchParams.get("limit");
    if (limit) params.set("limit", limit);
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
    setSearchValue("");
  };

  const columns = getColumns();

  return (
    <>
      {/* Priority tabs */}
      <div className="flex gap-0 border-b border-border">
        {PRIORITY_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => pushParams({ priority: tab.value === "all" ? "" : tab.value, page: "" })}
            className={cn(
              "relative px-4 py-2.5 text-sm font-medium transition-colors",
              currentPriority === tab.value || (tab.value === "all" && !searchParams.get("priority"))
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
            <span
              className={cn(
                "absolute bottom-0 left-0 h-0.5 w-full bg-foreground transition-all duration-300",
                currentPriority === tab.value || (tab.value === "all" && !searchParams.get("priority"))
                  ? "opacity-100"
                  : "opacity-0",
              )}
            />
          </button>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title, company, or tech stack..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={currentExp || "all"}
          onValueChange={(v) => pushParams({ experienceLevel: v === "all" ? "" : v })}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {filterOptions.experienceLevels.map((level) => (
              <SelectItem key={level} value={level} className="capitalize">
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={currentType || "all"}
          onValueChange={(v) => pushParams({ engagementType: v === "all" ? "" : v })}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {filterOptions.engagementTypes.map((type) => (
              <SelectItem key={type} value={type} className="capitalize">
                {type.replace(/-/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearAll}>
            <X className="mr-1 size-3" />
            Clear
          </Button>
        )}
      </div>

      {/* Tech stack filter chips */}
      {filterOptions.techStacks.length > 0 && (
        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
              <SlidersHorizontal className="size-3" />
              {filtersOpen ? "Hide" : "Filter by"} Tech Stack
              {currentStack && (
                <Badge variant="secondary" className="ml-1 text-[10px]">
                  {currentStack.split(",").length}
                </Badge>
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {filterOptions.techStacks.slice(0, 40).map((tech) => {
                const selected = currentStack.split(",").includes(tech);
                return (
                  <button
                    key={tech}
                    onClick={() => {
                      const current = currentStack ? currentStack.split(",") : [];
                      const next = selected
                        ? current.filter((t) => t !== tech)
                        : [...current, tech];
                      pushParams({ techStack: next.join(",") });
                    }}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[10px] font-medium transition-colors",
                      selected
                        ? "border-pulse/40 bg-pulse/10 text-pulse"
                        : "border-border text-muted-foreground hover:border-pulse/25 hover:text-foreground",
                    )}
                  >
                    {tech}
                  </button>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Active filter chips */}
      {(currentStack || currentExp || currentType) && (
        <div className="flex flex-wrap items-center gap-1.5">
          {currentExp && (
            <Badge variant="outline" className="gap-1 text-xs capitalize">
              {currentExp}
              <button onClick={() => pushParams({ experienceLevel: "" })}>
                <X className="size-2.5" />
              </button>
            </Badge>
          )}
          {currentType && (
            <Badge variant="outline" className="gap-1 text-xs capitalize">
              {currentType.replace(/-/g, " ")}
              <button onClick={() => pushParams({ engagementType: "" })}>
                <X className="size-2.5" />
              </button>
            </Badge>
          )}
          {currentStack &&
            currentStack.split(",").map((tech) => (
              <Badge key={tech} variant="outline" className="gap-1 text-xs">
                {tech}
                <button
                  onClick={() => {
                    const next = currentStack
                      .split(",")
                      .filter((t) => t !== tech)
                      .join(",");
                    pushParams({ techStack: next });
                  }}
                >
                  <X className="size-2.5" />
                </button>
              </Badge>
            ))}
        </div>
      )}

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={requirements}
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
        onSortChange={(column) => {
          if (currentSortBy === column) {
            if (currentSortOrder === "asc") {
              pushParams({ sortBy: column, sortOrder: "desc" });
            } else {
              pushParams({ sortBy: "", sortOrder: "" });
            }
          } else {
            pushParams({ sortBy: column, sortOrder: "asc" });
          }
        }}
        currentSort={
          currentSortBy
            ? { column: currentSortBy, order: currentSortOrder as "asc" | "desc" }
            : undefined
        }
        onRowClick={(req) =>
          router.push(`/agencies/dashboard/requirements/${req.id}`)
        }
      />
    </>
  );
}

export { MarketplaceClient };
