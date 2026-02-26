"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  ChevronDown,
  X,
  Download,
  SlidersHorizontal,
  Check,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { FilterOptions } from "@/lib/api/admin";
import {
  ALL_STATUSES,
  applicationStatusLabel,
} from "../../_components/dashboard-data";

interface FiltersBarProps {
  filterOptions: FilterOptions | null;
  token: string;
}

function FiltersBar({ filterOptions, token }: FiltersBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") ?? "";
  const currentStatus = searchParams.get("status") ?? "all";
  const currentIsLive = searchParams.get("isLive") ?? "all";
  const currentTitle = searchParams.get("professionalTitle") ?? "";
  const currentStack = searchParams.get("stack") ?? "";
  const currentLocation = searchParams.get("location") ?? "";
  const currentExpMin = searchParams.get("expMin") ?? "";
  const currentExpMax = searchParams.get("expMax") ?? "";
  const currentEngagement = searchParams.get("engagementType") ?? "";
  const currentAvailability = searchParams.get("availability") ?? "";

  const [searchValue, setSearchValue] = useState(currentSearch);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [titleOpen, setTitleOpen] = useState(false);
  const [stackOpen, setStackOpen] = useState(false);

  const activeFilterCount = [
    currentTitle,
    currentStack,
    currentLocation,
    currentExpMin,
    currentExpMax,
    currentEngagement,
    currentAvailability,
  ].filter(Boolean).length;

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
    [router, searchParams, startTransition]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== currentSearch) {
        pushParams({ search: searchValue });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue, currentSearch, pushParams]);

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    const limit = searchParams.get("limit");
    if (limit) params.set("limit", limit);
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
    setSearchValue("");
  };

  const handleExport = async () => {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

    const exportParams = new URLSearchParams();
    if (currentSearch) exportParams.set("search", currentSearch);
    if (currentStatus && currentStatus !== "all") exportParams.set("status", currentStatus);
    if (currentIsLive && currentIsLive !== "all") exportParams.set("isLive", currentIsLive);
    if (currentTitle) exportParams.set("professionalTitle", currentTitle);
    if (currentStack) exportParams.set("stack", currentStack);
    if (currentLocation) exportParams.set("location", currentLocation);
    if (currentExpMin) exportParams.set("expMin", currentExpMin);
    if (currentExpMax) exportParams.set("expMax", currentExpMax);
    if (currentEngagement) exportParams.set("engagementType", currentEngagement);
    if (currentAvailability) exportParams.set("availability", currentAvailability);

    const qs = exportParams.toString();
    const url = `${apiBaseUrl}/api/admin/applications/export${qs ? `?${qs}` : ""}`;

    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) return;
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "applicants-export.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      // Export failed silently
    }
  };

  // Multi-select helpers for stack
  const selectedStacks = currentStack ? currentStack.split(",") : [];
  const toggleStack = (tech: string) => {
    const set = new Set(selectedStacks);
    if (set.has(tech)) set.delete(tech);
    else set.add(tech);
    pushParams({ stack: [...set].join(",") });
  };

  // Checkbox group helpers
  const selectedEngagement = currentEngagement ? currentEngagement.split(",") : [];
  const toggleEngagement = (val: string) => {
    const set = new Set(selectedEngagement);
    if (set.has(val)) set.delete(val);
    else set.add(val);
    pushParams({ engagementType: [...set].join(",") });
  };

  const selectedAvailability = currentAvailability ? currentAvailability.split(",") : [];
  const toggleAvailability = (val: string) => {
    const set = new Set(selectedAvailability);
    if (set.has(val)) set.delete(val);
    else set.add(val);
    pushParams({ availability: [...set].join(",") });
  };

  return (
    <div className="space-y-3">
      {/* Row 1: Search + Status + isLive + Export */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={currentStatus}
          onValueChange={(v) => pushParams({ status: v })}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {ALL_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {applicationStatusLabel[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={currentIsLive}
          onValueChange={(v) => pushParams({ isLive: v })}
        >
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Live status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">Live</SelectItem>
            <SelectItem value="false">Not Live</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="mr-1.5 size-3.5" />
          Export
        </Button>
      </div>

      {/* Row 2: More Filters collapsible */}
      <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
        <div className="flex items-center gap-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              <SlidersHorizontal className="size-3.5" />
              More Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 size-5 justify-center rounded-full p-0 text-[10px]">
                  {activeFilterCount}
                </Badge>
              )}
              <ChevronDown className={`size-3.5 transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
            </Button>
          </CollapsibleTrigger>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs text-muted-foreground"
            >
              <X className="mr-1 size-3" />
              Clear all
            </Button>
          )}
        </div>

        <CollapsibleContent className="pt-3">
          <div className="grid grid-cols-1 gap-4 rounded-lg border border-border/70 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Professional Title — searchable combobox */}
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Professional Title
              </Label>
              <Popover open={titleOpen} onOpenChange={setTitleOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between font-normal"
                  >
                    <span className="truncate">
                      {currentTitle || "Any title"}
                    </span>
                    <ChevronDown className="ml-2 size-3.5 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[250px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search titles..." />
                    <CommandList>
                      <CommandEmpty>No titles found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          onSelect={() => {
                            pushParams({ professionalTitle: "" });
                            setTitleOpen(false);
                          }}
                        >
                          <Check className={`mr-2 size-3.5 ${!currentTitle ? "opacity-100" : "opacity-0"}`} />
                          Any title
                        </CommandItem>
                        {(filterOptions?.professionalTitles ?? []).map((title) => (
                          <CommandItem
                            key={title}
                            onSelect={() => {
                              pushParams({ professionalTitle: title });
                              setTitleOpen(false);
                            }}
                          >
                            <Check className={`mr-2 size-3.5 ${currentTitle === title ? "opacity-100" : "opacity-0"}`} />
                            {title}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Tech Stack — multi-select with search */}
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Tech Stack
              </Label>
              <Popover open={stackOpen} onOpenChange={setStackOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between font-normal"
                  >
                    <span className="truncate">
                      {selectedStacks.length > 0
                        ? `${selectedStacks.length} selected`
                        : "Any stack"}
                    </span>
                    <ChevronDown className="ml-2 size-3.5 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[250px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search tech..." />
                    <CommandList>
                      <CommandEmpty>No tech found.</CommandEmpty>
                      <CommandGroup>
                        {(filterOptions?.techStacks ?? []).map((tech) => (
                          <CommandItem
                            key={tech}
                            onSelect={() => toggleStack(tech)}
                          >
                            <Check className={`mr-2 size-3.5 ${selectedStacks.includes(tech) ? "opacity-100" : "opacity-0"}`} />
                            {tech}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Location — text input */}
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Location
              </Label>
              <Input
                placeholder="City or state..."
                value={searchParams.get("location") ?? ""}
                onChange={(e) => pushParams({ location: e.target.value })}
              />
            </div>

            {/* Experience Range */}
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Experience (years)
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  min={0}
                  className="w-20"
                  value={currentExpMin}
                  onChange={(e) => pushParams({ expMin: e.target.value })}
                />
                <span className="text-xs text-muted-foreground">to</span>
                <Input
                  type="number"
                  placeholder="Max"
                  min={0}
                  className="w-20"
                  value={currentExpMax}
                  onChange={(e) => pushParams({ expMax: e.target.value })}
                />
              </div>
            </div>

            {/* Engagement Type — checkbox group */}
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Engagement Type
              </Label>
              <div className="space-y-2">
                {(filterOptions?.engagementTypes ?? []).map((type) => (
                  <div key={type} className="flex items-center gap-2">
                    <Checkbox
                      id={`engagement-${type}`}
                      checked={selectedEngagement.includes(type)}
                      onCheckedChange={() => toggleEngagement(type)}
                    />
                    <label htmlFor={`engagement-${type}`} className="text-sm capitalize">
                      {type}
                    </label>
                  </div>
                ))}
                {(!filterOptions?.engagementTypes || filterOptions.engagementTypes.length === 0) && (
                  <p className="text-xs text-muted-foreground">No options</p>
                )}
              </div>
            </div>

            {/* Availability — checkbox group */}
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Availability
              </Label>
              <div className="space-y-2">
                {(filterOptions?.availabilities ?? []).map((avail) => (
                  <div key={avail} className="flex items-center gap-2">
                    <Checkbox
                      id={`availability-${avail}`}
                      checked={selectedAvailability.includes(avail)}
                      onCheckedChange={() => toggleAvailability(avail)}
                    />
                    <label htmlFor={`availability-${avail}`} className="text-sm capitalize">
                      {avail}
                    </label>
                  </div>
                ))}
                {(!filterOptions?.availabilities || filterOptions.availabilities.length === 0) && (
                  <p className="text-xs text-muted-foreground">No options</p>
                )}
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export { FiltersBar };
