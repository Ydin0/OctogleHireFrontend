"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import type {
  AgencyRequirement,
  MarketplaceFilterOptions,
  MarketplaceParams,
  Pagination,
} from "@/lib/api/agencies";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ── Helpers ──────────────────────────────────────────────────────────────────

const priorityBadge: Record<string, string> = {
  low: "border-zinc-600/20 bg-zinc-500/10 text-zinc-600",
  medium: "border-blue-600/20 bg-blue-500/10 text-blue-600",
  high: "border-amber-600/20 bg-amber-500/10 text-amber-700",
  urgent: "border-red-600/20 bg-red-500/10 text-red-600",
};

const formatBudget = (cents: number | null) => {
  if (cents == null) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
};

const relativeDate = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest" },
  { value: "budgetMaxCents:desc", label: "Budget (High → Low)" },
  { value: "priority:desc", label: "Priority" },
  { value: "developersNeeded:desc", label: "Developers Needed" },
];

// ── Component ────────────────────────────────────────────────────────────────

interface MarketplaceClientProps {
  requirements: AgencyRequirement[];
  pagination: Pagination;
  filterOptions: MarketplaceFilterOptions;
  activeParams: MarketplaceParams;
}

export function MarketplaceClient({
  requirements,
  pagination,
  filterOptions,
  activeParams,
}: MarketplaceClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(activeParams.search ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Push params to URL
  const pushParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      // Reset page on filter change unless page is being set
      if (!("page" in updates)) {
        params.delete("page");
      }
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const current = searchParams.get("search") ?? "";
      if (searchValue.trim() !== current) {
        pushParams({ search: searchValue.trim() || undefined });
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchValue, pushParams, searchParams]);

  // Active filter count & chips
  const activeFilters: { key: string; label: string }[] = [];
  if (activeParams.experienceLevel) {
    activeFilters.push({
      key: "experienceLevel",
      label: activeParams.experienceLevel,
    });
  }
  if (activeParams.engagementType) {
    activeFilters.push({
      key: "engagementType",
      label: activeParams.engagementType,
    });
  }
  if (activeParams.techStack) {
    for (const t of activeParams.techStack.split(",")) {
      activeFilters.push({ key: `techStack:${t}`, label: t });
    }
  }
  if (activeParams.priority) {
    activeFilters.push({ key: "priority", label: activeParams.priority });
  }
  if (activeParams.budgetMin) {
    activeFilters.push({
      key: "budgetMin",
      label: `Min $${Number(activeParams.budgetMin) / 100}`,
    });
  }
  if (activeParams.budgetMax) {
    activeFilters.push({
      key: "budgetMax",
      label: `Max $${Number(activeParams.budgetMax) / 100}`,
    });
  }

  const removeFilter = (chip: { key: string; label: string }) => {
    if (chip.key.startsWith("techStack:")) {
      const current = (activeParams.techStack ?? "").split(",").filter(Boolean);
      const next = current.filter((t) => t !== chip.label);
      pushParams({ techStack: next.length > 0 ? next.join(",") : undefined });
    } else {
      pushParams({ [chip.key]: undefined });
    }
  };

  const clearAllFilters = () => {
    pushParams({
      search: undefined,
      experienceLevel: undefined,
      engagementType: undefined,
      techStack: undefined,
      priority: undefined,
      budgetMin: undefined,
      budgetMax: undefined,
    });
    setSearchValue("");
  };

  const sortValue = activeParams.sortBy
    ? `${activeParams.sortBy}:${activeParams.sortOrder ?? "desc"}`
    : "createdAt:desc";

  return (
    <div className="space-y-4">
      {/* Search + Sort */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title or company..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={sortValue}
          onValueChange={(v) => {
            const [sortBy, sortOrder] = v.split(":");
            pushParams({ sortBy, sortOrder });
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {activeFilters.map((chip) => (
            <Badge
              key={chip.key}
              variant="outline"
              className="gap-1 capitalize"
            >
              {chip.label}
              <button
                type="button"
                onClick={() => removeFilter(chip)}
                className="ml-0.5 rounded-full hover:bg-muted"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Collapsible Filters Panel */}
      <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <SlidersHorizontal className="size-4" />
            Filters
            {activeFilters.length > 0 && (
              <Badge variant="secondary" className="ml-1 size-5 justify-center p-0 text-[10px]">
                {activeFilters.length}
              </Badge>
            )}
            <ChevronDown
              className={`size-4 transition-transform ${filtersOpen ? "rotate-180" : ""}`}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <Card>
            <CardContent className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Experience Level */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Experience Level
                </label>
                <Select
                  value={activeParams.experienceLevel ?? "all"}
                  onValueChange={(v) =>
                    pushParams({
                      experienceLevel: v === "all" ? undefined : v,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {filterOptions.experienceLevels.map((lvl) => (
                      <SelectItem key={lvl} value={lvl} className="capitalize">
                        {lvl}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Engagement Type */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Engagement Type
                </label>
                <div className="space-y-1.5">
                  {filterOptions.engagementTypes.map((type) => {
                    const isActive = activeParams.engagementType === type;
                    return (
                      <label
                        key={type}
                        className="flex items-center gap-2 text-sm capitalize"
                      >
                        <Checkbox
                          checked={isActive}
                          onCheckedChange={(checked) =>
                            pushParams({
                              engagementType: checked ? type : undefined,
                            })
                          }
                        />
                        {type}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Tech Stack multi-select */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Tech Stack
                </label>
                <TechStackCombobox
                  options={filterOptions.techStacks}
                  selected={
                    activeParams.techStack
                      ? activeParams.techStack.split(",").filter(Boolean)
                      : []
                  }
                  onChange={(next) =>
                    pushParams({
                      techStack: next.length > 0 ? next.join(",") : undefined,
                    })
                  }
                />
              </div>

              {/* Priority */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Priority
                </label>
                <div className="space-y-1.5">
                  {filterOptions.priorities.map((p) => {
                    const isActive = activeParams.priority === p;
                    return (
                      <label
                        key={p}
                        className="flex items-center gap-2 text-sm capitalize"
                      >
                        <Checkbox
                          checked={isActive}
                          onCheckedChange={(checked) =>
                            pushParams({ priority: checked ? p : undefined })
                          }
                        />
                        {p}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Budget Range */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Budget Range (USD)
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    defaultValue={
                      activeParams.budgetMin
                        ? String(Number(activeParams.budgetMin) / 100)
                        : ""
                    }
                    onBlur={(e) => {
                      const v = e.target.value.trim();
                      pushParams({
                        budgetMin: v ? String(Number(v) * 100) : undefined,
                      });
                    }}
                    className="font-mono"
                  />
                  <span className="text-muted-foreground">–</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    defaultValue={
                      activeParams.budgetMax
                        ? String(Number(activeParams.budgetMax) / 100)
                        : ""
                    }
                    onBlur={(e) => {
                      const v = e.target.value.trim();
                      pushParams({
                        budgetMax: v ? String(Number(v) * 100) : undefined,
                      });
                    }}
                    className="font-mono"
                  />
                </div>
              </div>

              {/* Clear all */}
              <div className="flex items-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-muted-foreground"
                >
                  Clear all
                </Button>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        <span className="font-mono">{pagination.total}</span>{" "}
        {pagination.total === 1 ? "result" : "results"}
      </p>

      {/* Card Grid */}
      {requirements.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No requirements match your filters.
            </p>
            {activeFilters.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={clearAllFilters}
              >
                Clear filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {requirements.map((req) => (
            <RequirementCard key={req.id} requirement={req} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Rows per page</span>
            <Select
              value={String(pagination.limit)}
              onValueChange={(v) => pushParams({ limit: v, page: "1" })}
            >
              <SelectTrigger className="w-[72px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["12", "24", "48"].map((n) => (
                  <SelectItem key={n} value={n}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="font-mono text-muted-foreground">
              {pagination.total} total
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              disabled={pagination.page <= 1}
              onClick={() =>
                pushParams({ page: String(pagination.page - 1) })
              }
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="px-2 text-sm font-mono">
              {pagination.page} / {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() =>
                pushParams({ page: String(pagination.page + 1) })
              }
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Requirement Card ─────────────────────────────────────────────────────────

function RequirementCard({ requirement: req }: { requirement: AgencyRequirement }) {
  const MAX_TECH = 4;
  const extraTech = req.techStack.length - MAX_TECH;

  return (
    <Link
      href={`/agencies/dashboard/requirements/${req.id}`}
      className="group"
    >
      <Card className="flex h-full flex-col transition-all hover:border-foreground/20 hover:shadow-sm">
        {/* Header */}
        <div className="flex items-start gap-3 p-4 pb-2">
          <div className="flex flex-1 items-start gap-2.5">
            {req.companyLogoUrl ? (
              <Image
                src={req.companyLogoUrl}
                alt={req.companyName ?? ""}
                width={32}
                height={32}
                unoptimized
                className="size-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <Building2 className="size-4 text-muted-foreground" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              {req.companyName && (
                <p className="text-xs text-muted-foreground">
                  {req.companyName}
                </p>
              )}
              <h3 className="truncate text-base font-semibold">{req.title}</h3>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`shrink-0 capitalize ${priorityBadge[req.priority] ?? priorityBadge.medium}`}
          >
            {req.priority}
          </Badge>
        </div>

        {/* Body */}
        <CardContent className="flex flex-1 flex-col space-y-3 pt-0">
          {/* Tech stack */}
          <div className="flex flex-wrap gap-1.5">
            {req.techStack.slice(0, MAX_TECH).map((tech) => (
              <Badge key={tech} variant="outline" className="text-[10px]">
                {tech}
              </Badge>
            ))}
            {extraTech > 0 && (
              <Badge variant="outline" className="text-[10px] text-muted-foreground">
                +{extraTech} more
              </Badge>
            )}
          </div>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Experience
              </p>
              <p className="font-medium capitalize">{req.experienceLevel}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Type
              </p>
              <p className="font-medium capitalize">{req.engagementType}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Developers Needed
              </p>
              <p className="font-mono font-medium">{req.developersNeeded}</p>
            </div>
            {(req.budgetMinCents || req.budgetMaxCents) && (
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Budget Range
                </p>
                <p className="font-mono font-medium">
                  {formatBudget(req.budgetMinCents)} –{" "}
                  {formatBudget(req.budgetMaxCents)}
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {req.description}
          </p>

          {/* Footer */}
          <div className="mt-auto flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
            <span>{relativeDate(req.createdAt)}</span>
            <span className="font-medium text-foreground">View & Pitch →</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// ── Tech Stack Combobox ──────────────────────────────────────────────────────

function TechStackCombobox({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const [open, setOpen] = useState(false);

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((s) => s !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start text-left font-normal"
        >
          {selected.length > 0
            ? `${selected.length} selected`
            : "Select technologies..."}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search tech..." />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup>
              {options.map((tech) => (
                <CommandItem
                  key={tech}
                  value={tech}
                  onSelect={() => toggle(tech)}
                >
                  <Checkbox
                    checked={selected.includes(tech)}
                    className="pointer-events-none mr-2"
                  />
                  {tech}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
