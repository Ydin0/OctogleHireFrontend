"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  ChevronDown,
  X,
  SlidersHorizontal,
  Check,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const AGENCY_STATUSES = [
  { value: "all", label: "All Statuses" },
  { value: "prospected", label: "Prospected" },
  { value: "contacted", label: "Contacted" },
  { value: "interviewing", label: "Interviewing" },
  { value: "draft", label: "Draft" },
  { value: "hr_communication_round", label: "HR Communication" },
  { value: "ai_technical_examination", label: "AI Technical Exam" },
  { value: "tech_lead_human_interview", label: "Tech Lead Interview" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
] as const;

const SOURCE_OPTIONS = [
  { value: "all", label: "All Sources" },
  { value: "referral", label: "Referral" },
  { value: "extension", label: "Extension" },
  { value: "agency_manual", label: "Manual" },
] as const;

interface FiltersBarProps {
  availableStacks?: string[];
}

function FiltersBar({ availableStacks = [] }: FiltersBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") ?? "";
  const currentStatus = searchParams.get("status") ?? "all";
  const currentSource = searchParams.get("source") ?? "all";
  const currentStack = searchParams.get("stack") ?? "";
  const currentLocation = searchParams.get("location") ?? "";
  const currentExpMin = searchParams.get("expMin") ?? "";
  const currentExpMax = searchParams.get("expMax") ?? "";

  const [searchValue, setSearchValue] = useState(currentSearch);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [stackOpen, setStackOpen] = useState(false);

  const selectedStacks = currentStack ? currentStack.split(",") : [];

  const activeFilterCount = [
    currentStack,
    currentLocation,
    currentExpMin,
    currentExpMax,
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

  const toggleStack = (tech: string) => {
    const set = new Set(selectedStacks);
    if (set.has(tech)) set.delete(tech);
    else set.add(tech);
    pushParams({ stack: [...set].join(",") });
  };

  return (
    <div className="space-y-3">
      {/* Row 1: Search + Status + Source */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or title..."
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
            {AGENCY_STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={currentSource}
          onValueChange={(v) => pushParams({ source: v })}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Filter by source" />
          </SelectTrigger>
          <SelectContent>
            {SOURCE_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
                <PopoverContent className="w-[250px] p-0" align="start" onWheel={(e) => e.stopPropagation()}>
                  <Command>
                    <CommandInput placeholder="Search tech..." />
                    <CommandList className="overscroll-contain">
                      <CommandEmpty>No tech found.</CommandEmpty>
                      <CommandGroup>
                        {availableStacks.map((tech) => (
                          <CommandItem
                            key={tech}
                            value={tech}
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
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export { FiltersBar };
