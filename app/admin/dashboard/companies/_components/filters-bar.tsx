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

import type { CompanyProfile } from "@/lib/api/companies";
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
import { companyStatusLabel } from "../../_components/dashboard-data";

const ALL_COMPANY_STATUSES = [
  "enquired",
  "pending",
  "contacted",
  "active",
  "inactive",
] as const;

const ENGAGEMENT_OPTIONS = [
  "full-time",
  "part-time",
  "contract",
  "project-based",
] as const;

const REQ_STATUS_OPTIONS = [
  { value: "has_open", label: "Has Open" },
  { value: "has_matching", label: "Has Matching" },
  { value: "has_filled", label: "Has Filled" },
] as const;

interface FiltersBarProps {
  companies: CompanyProfile[];
  filteredCompanies: CompanyProfile[];
}

function FiltersBar({ companies, filteredCompanies }: FiltersBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") ?? "";
  const currentStatus = searchParams.get("status") ?? "all";
  const currentReqStatus = searchParams.get("reqStatus") ?? "all";
  const currentEngagement = searchParams.get("engagementType") ?? "";
  const currentStack = searchParams.get("techStack") ?? "";

  const [searchValue, setSearchValue] = useState(currentSearch);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [stackOpen, setStackOpen] = useState(false);

  const activeFilterCount = [
    currentReqStatus !== "all" ? currentReqStatus : "",
    currentEngagement,
    currentStack,
  ].filter(Boolean).length;

  // Derive tech stack options from all companies' requirements
  const techStackOptions = Array.from(
    new Set(
      companies.flatMap((c) =>
        c.requirements.flatMap((r) => r.techStack),
      ),
    ),
  ).sort();

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

  const handleExport = () => {
    const rows = filteredCompanies.map((c) => ({
      "Company Name": c.companyName,
      Contact: c.contactName,
      Email: c.email,
      Phone: c.phone,
      Website: c.website ?? "",
      Status: c.status,
      Requirements: c.requirements.length,
      "Created At": c.createdAt,
    }));

    if (rows.length === 0) return;

    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((h) => {
            const val = String(row[h as keyof typeof row]);
            return val.includes(",") ? `"${val}"` : val;
          })
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "companies-export.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Multi-select helpers for tech stack
  const selectedStacks = currentStack ? currentStack.split(",") : [];
  const toggleStack = (tech: string) => {
    const set = new Set(selectedStacks);
    if (set.has(tech)) set.delete(tech);
    else set.add(tech);
    pushParams({ techStack: [...set].join(",") });
  };

  // Checkbox group helpers for engagement
  const selectedEngagement = currentEngagement
    ? currentEngagement.split(",")
    : [];
  const toggleEngagement = (val: string) => {
    const set = new Set(selectedEngagement);
    if (set.has(val)) set.delete(val);
    else set.add(val);
    pushParams({ engagementType: [...set].join(",") });
  };

  return (
    <div className="space-y-3">
      {/* Row 1: Search + Status + Export */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by company, contact, or email..."
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
            {ALL_COMPANY_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {companyStatusLabel[status]}
              </SelectItem>
            ))}
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
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground"
            >
              <SlidersHorizontal className="size-3.5" />
              More Filters
              {activeFilterCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 size-5 justify-center rounded-full p-0 text-[10px]"
                >
                  {activeFilterCount}
                </Badge>
              )}
              <ChevronDown
                className={`size-3.5 transition-transform ${filtersOpen ? "rotate-180" : ""}`}
              />
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
            {/* Requirement Status */}
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Requirement Status
              </Label>
              <Select
                value={currentReqStatus}
                onValueChange={(v) => pushParams({ reqStatus: v })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any</SelectItem>
                  {REQ_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Engagement Type — checkbox group */}
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Engagement Type
              </Label>
              <div className="space-y-2">
                {ENGAGEMENT_OPTIONS.map((type) => (
                  <div key={type} className="flex items-center gap-2">
                    <Checkbox
                      id={`company-engagement-${type}`}
                      checked={selectedEngagement.includes(type)}
                      onCheckedChange={() => toggleEngagement(type)}
                    />
                    <label
                      htmlFor={`company-engagement-${type}`}
                      className="text-sm capitalize"
                    >
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack — searchable multi-select */}
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
                        {techStackOptions.map((tech) => (
                          <CommandItem
                            key={tech}
                            onSelect={() => toggleStack(tech)}
                          >
                            <Check
                              className={`mr-2 size-3.5 ${selectedStacks.includes(tech) ? "opacity-100" : "opacity-0"}`}
                            />
                            {tech}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export { FiltersBar };
