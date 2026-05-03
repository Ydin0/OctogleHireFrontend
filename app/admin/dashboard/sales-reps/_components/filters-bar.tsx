"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Check, ChevronDown } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import type { SalesRepFilterOptions } from "@/lib/api/admin-sales-rep";
import {
  SALES_REP_ALL_STATUSES,
  salesRepApplicationStatusLabel,
  type SalesRepApplicationStatus,
} from "../../_components/dashboard-data";

interface FiltersBarProps {
  filterOptions: SalesRepFilterOptions | null;
}

function FiltersBar({ filterOptions }: FiltersBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") ?? "";
  const currentStatusParam = searchParams.get("status") ?? "";
  const currentIsLive = searchParams.get("isLive") ?? "all";
  const currentRoleTitle = searchParams.get("salesRoleTitle") ?? "";
  const currentTools = searchParams.get("salesTools") ?? "";
  const currentLocation = searchParams.get("location") ?? "";

  const [searchValue, setSearchValue] = useState(currentSearch);
  const [statusOpen, setStatusOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  const selectedStatuses = currentStatusParam
    ? currentStatusParam.split(",")
    : [];
  const selectedTools = currentTools ? currentTools.split(",") : [];

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
    setSearchValue(currentSearch);
  }, [currentSearch]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (searchValue !== currentSearch) {
        pushParams({ search: searchValue });
      }
    }, 350);
    return () => clearTimeout(t);
  }, [searchValue, currentSearch, pushParams]);

  const toggleStatus = (status: string) => {
    const set = new Set(selectedStatuses);
    if (set.has(status)) set.delete(status);
    else set.add(status);
    pushParams({ status: [...set].join(",") });
  };

  const toggleTool = (tool: string) => {
    const set = new Set(selectedTools);
    if (set.has(tool)) set.delete(tool);
    else set.add(tool);
    pushParams({ salesTools: [...set].join(",") });
  };

  const clearAll = () => {
    const params = new URLSearchParams();
    const tab = searchParams.get("tab");
    if (tab) params.set("tab", tab);
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const hasActiveFilters =
    currentSearch ||
    currentStatusParam ||
    currentIsLive !== "all" ||
    currentRoleTitle ||
    currentTools ||
    currentLocation;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative flex-1 min-w-[220px] max-w-md">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search by name or email..."
          className="pl-9"
        />
      </div>

      <Popover open={statusOpen} onOpenChange={setStatusOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            Status
            {selectedStatuses.length > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[10px]">
                {selectedStatuses.length}
              </Badge>
            )}
            <ChevronDown className="size-3.5 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-0" align="start">
          <Command>
            <CommandList>
              <CommandGroup>
                {SALES_REP_ALL_STATUSES.map((s) => {
                  const isSelected = selectedStatuses.includes(s);
                  return (
                    <CommandItem
                      key={s}
                      onSelect={() => toggleStatus(s)}
                      className="gap-2"
                    >
                      <Checkbox checked={isSelected} className="size-3.5" />
                      <span>
                        {
                          salesRepApplicationStatusLabel[
                            s as SalesRepApplicationStatus
                          ]
                        }
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Select
        value={currentIsLive}
        onValueChange={(v) => pushParams({ isLive: v })}
      >
        <SelectTrigger size="sm" className="w-[110px]">
          <SelectValue placeholder="Live" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="true">Live only</SelectItem>
          <SelectItem value="false">Offline</SelectItem>
        </SelectContent>
      </Select>

      {filterOptions && filterOptions.salesRoleTitles.length > 0 && (
        <Popover open={roleOpen} onOpenChange={setRoleOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              {currentRoleTitle || "Role"}
              <ChevronDown className="size-3.5 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            <Command>
              <CommandInput placeholder="Search roles..." />
              <CommandList>
                <CommandEmpty>No roles.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      pushParams({ salesRoleTitle: "" });
                      setRoleOpen(false);
                    }}
                  >
                    <span className="text-muted-foreground">All roles</span>
                  </CommandItem>
                  {filterOptions.salesRoleTitles.map((title) => (
                    <CommandItem
                      key={title}
                      onSelect={() => {
                        pushParams({ salesRoleTitle: title });
                        setRoleOpen(false);
                      }}
                    >
                      <Check
                        className={`mr-2 size-4 ${
                          currentRoleTitle === title
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />
                      {title}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}

      {filterOptions && filterOptions.salesTools.length > 0 && (
        <Popover open={toolsOpen} onOpenChange={setToolsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              Tools
              {selectedTools.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 px-1.5 py-0 text-[10px]"
                >
                  {selectedTools.length}
                </Badge>
              )}
              <ChevronDown className="size-3.5 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            <Command>
              <CommandInput placeholder="Search tools..." />
              <CommandList>
                <CommandEmpty>No tools.</CommandEmpty>
                <CommandGroup>
                  {filterOptions.salesTools.map((tool) => {
                    const isSelected = selectedTools.includes(tool);
                    return (
                      <CommandItem
                        key={tool}
                        onSelect={() => toggleTool(tool)}
                        className="gap-2"
                      >
                        <Checkbox checked={isSelected} className="size-3.5" />
                        {tool}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}

      <Input
        placeholder="Location"
        value={currentLocation}
        onChange={(e) => pushParams({ location: e.target.value })}
        className="w-[140px]"
      />

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAll}
          className="gap-1 text-muted-foreground"
        >
          <X className="size-3.5" />
          Clear
        </Button>
      )}
    </div>
  );
}

export { FiltersBar };
