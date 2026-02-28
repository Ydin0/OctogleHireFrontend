"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Loader2,
  MapPin,
  Search,
  Star,
  Users,
  X,
} from "lucide-react";

import type {
  DeveloperSummary,
  ExperienceLevel,
  JobRequirement,
} from "@/lib/api/companies";
import { getAllDeveloperSummaries } from "@/lib/data/mock-companies";
import { getInitials } from "../../../../../_components/dashboard-data";
import { cn } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// ── Types ────────────────────────────────────────────────────────────────────

interface DeveloperPoolProps {
  requirement: JobRequirement;
  excludeDevIds: Set<string>;
  onPropose: (payload: {
    developerId: string;
    hourlyRate: number;
    monthlyRate: number;
    currency: string;
  }) => Promise<void>;
}

interface ScoredDeveloper {
  dev: DeveloperSummary;
  score: number;
  matchingSkills: string[];
}

interface Filters {
  skills: string[];
  expMin: string;
  expMax: string;
  rateMin: string;
  rateMax: string;
  minRating: string;
  location: string;
}

// ── Match Score Algorithm ────────────────────────────────────────────────────

const LEVEL_RANGES: Record<ExperienceLevel, [number, number]> = {
  junior: [0, 2],
  mid: [3, 5],
  senior: [5, 9],
  lead: [8, 14],
  principal: [12, 30],
};

function computeMatchScore(
  dev: DeveloperSummary,
  requirement: JobRequirement,
): { score: number; matchingSkills: string[] } {
  const reqSkillsLower = requirement.techStack.map((s) => s.toLowerCase());
  const matchingSkills = dev.skills.filter((s) =>
    reqSkillsLower.includes(s.toLowerCase()),
  );

  // Tech stack overlap (50%)
  const techScore =
    reqSkillsLower.length > 0
      ? matchingSkills.length / reqSkillsLower.length
      : 0;

  // Experience alignment (30%)
  const [rangeMin, rangeMax] = LEVEL_RANGES[requirement.experienceLevel] ?? [
    0, 30,
  ];
  let expScore: number;
  if (
    dev.yearsOfExperience >= rangeMin &&
    dev.yearsOfExperience <= rangeMax
  ) {
    expScore = 1;
  } else if (dev.yearsOfExperience < rangeMin) {
    expScore = Math.max(
      0,
      1 - (rangeMin - dev.yearsOfExperience) / (rangeMin || 1),
    );
  } else {
    expScore = Math.max(
      0,
      1 - (dev.yearsOfExperience - rangeMax) / rangeMax,
    );
  }

  // Rate fit (20%)
  let rateScore = 0.5;
  if (requirement.budgetMin != null && requirement.budgetMax != null) {
    if (
      dev.hourlyRate >= requirement.budgetMin &&
      dev.hourlyRate <= requirement.budgetMax
    ) {
      rateScore = 1;
    } else if (dev.hourlyRate < requirement.budgetMin) {
      rateScore = 0.8;
    } else {
      const overBy = dev.hourlyRate - requirement.budgetMax;
      rateScore = Math.max(0, 1 - overBy / requirement.budgetMax);
    }
  }

  const score = Math.round(techScore * 50 + expScore * 30 + rateScore * 20);
  return { score, matchingSkills };
}

function scoreBadgeClass(score: number) {
  if (score >= 80)
    return "bg-emerald-500/10 text-emerald-600 border-emerald-600/20";
  if (score >= 50)
    return "bg-amber-500/10 text-amber-700 border-amber-600/20";
  return "bg-zinc-500/10 text-zinc-600 border-zinc-600/20";
}

// ── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 50;
const EMPTY_FILTERS: Filters = {
  skills: [],
  expMin: "",
  expMax: "",
  rateMin: "",
  rateMax: "",
  minRating: "",
  location: "",
};

// ── Component ────────────────────────────────────────────────────────────────

const DeveloperPool = ({
  requirement,
  excludeDevIds,
  onPropose,
}: DeveloperPoolProps) => {
  const allDevs = useMemo(() => getAllDeveloperSummaries(), []);

  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [filters, setFilters] = useState<Filters>(() => ({
    ...EMPTY_FILTERS,
    skills: [...requirement.techStack],
    rateMin: requirement.budgetMin ? String(requirement.budgetMin) : "",
    rateMax: requirement.budgetMax ? String(requirement.budgetMax) : "",
  }));
  const [skillsPopoverOpen, setSkillsPopoverOpen] = useState(false);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [workingDaysPerMonth, setWorkingDaysPerMonth] = useState("22");
  const [hoursPerDay, setHoursPerDay] = useState("8");
  const [currency, setCurrency] = useState("USD");
  const [devRates, setDevRates] = useState<
    Record<string, { hourlyRate: string }>
  >({});
  const [proposing, setProposing] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // All available skills
  const allSkills = useMemo(() => {
    const skillSet = new Set<string>();
    for (const dev of allDevs) {
      for (const skill of dev.skills) skillSet.add(skill);
    }
    return [...skillSet].sort();
  }, [allDevs]);

  // Compute match scores once
  const scoredDevs = useMemo(
    (): ScoredDeveloper[] =>
      allDevs
        .filter((d) => !excludeDevIds.has(d.id))
        .map((dev) => {
          const { score, matchingSkills } = computeMatchScore(
            dev,
            requirement,
          );
          return { dev, score, matchingSkills };
        }),
    [allDevs, excludeDevIds, requirement],
  );

  // Apply filters + search
  const filteredDevs = useMemo(() => {
    let result = scoredDevs;

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        ({ dev }) =>
          dev.name.toLowerCase().includes(q) ||
          dev.role.toLowerCase().includes(q) ||
          dev.skills.some((s) => s.toLowerCase().includes(q)),
      );
    }

    if (filters.skills.length > 0) {
      const filterSkillsLower = filters.skills.map((s) => s.toLowerCase());
      result = result.filter(({ dev }) =>
        filterSkillsLower.some((fs) =>
          dev.skills.some((ds) => ds.toLowerCase() === fs),
        ),
      );
    }

    if (filters.expMin) {
      const min = Number(filters.expMin);
      result = result.filter(({ dev }) => dev.yearsOfExperience >= min);
    }
    if (filters.expMax) {
      const max = Number(filters.expMax);
      result = result.filter(({ dev }) => dev.yearsOfExperience <= max);
    }
    if (filters.rateMin) {
      const min = Number(filters.rateMin);
      result = result.filter(({ dev }) => dev.hourlyRate >= min);
    }
    if (filters.rateMax) {
      const max = Number(filters.rateMax);
      result = result.filter(({ dev }) => dev.hourlyRate <= max);
    }
    if (filters.minRating) {
      const min = Number(filters.minRating);
      result = result.filter(({ dev }) => dev.rating >= min);
    }
    if (filters.location) {
      const loc = filters.location.toLowerCase();
      result = result.filter(({ dev }) =>
        dev.location.toLowerCase().includes(loc),
      );
    }

    return [...result].sort((a, b) => b.score - a.score);
  }, [scoredDevs, debouncedSearch, filters]);

  // Reset pagination on filter change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [debouncedSearch, filters]);

  const visibleDevs = filteredDevs.slice(0, visibleCount);
  const hasMore = visibleCount < filteredDevs.length;

  const activeFilterCount = [
    filters.skills.length > 0,
    filters.expMin,
    filters.expMax,
    filters.rateMin,
    filters.rateMax,
    filters.minRating,
    filters.location,
  ].filter(Boolean).length;

  // Selection
  const toggleSelection = useCallback((devId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(devId)) next.delete(devId);
      else next.add(devId);
      return next;
    });
  }, []);

  const allVisibleSelected =
    filteredDevs.length > 0 &&
    filteredDevs.every(({ dev }) => selectedIds.has(dev.id));

  const toggleSelectAll = useCallback(() => {
    if (allVisibleSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredDevs.map(({ dev }) => dev.id)));
    }
  }, [allVisibleSelected, filteredDevs]);

  const toggleSkill = useCallback((skill: string) => {
    setFilters((prev) => {
      const set = new Set(prev.skills);
      if (set.has(skill)) set.delete(skill);
      else set.add(skill);
      return { ...prev, skills: [...set] };
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setSearchInput("");
    setDebouncedSearch("");
  }, []);

  // Bulk propose
  const handleBulkPropose = async () => {
    setProposing(true);
    const selectedDevs = scoredDevs.filter(({ dev }) =>
      selectedIds.has(dev.id),
    );
    const days = Number(workingDaysPerMonth) || 22;
    const hours = Number(hoursPerDay) || 8;

    for (const { dev } of selectedDevs) {
      const hourlyRate = Number(devRates[dev.id]?.hourlyRate) || dev.hourlyRate;
      const monthlyRate = Math.round(hourlyRate * hours * days);
      await onPropose({
        developerId: dev.id,
        hourlyRate,
        monthlyRate,
        currency,
      });
    }

    setProposing(false);
    setSelectedIds(new Set());
    setBulkDialogOpen(false);
    setOpen(false);
  };

  const reqSkillsLower = useMemo(
    () => new Set(requirement.techStack.map((s) => s.toLowerCase())),
    [requirement.techStack],
  );

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={() => setOpen(true)}
      >
        <Users className="size-3.5" />
        Search Developer Pool
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="flex flex-col p-0 gap-0"
          style={{
            width: "90vw",
            maxWidth: "90vw",
            height: "90vh",
            maxHeight: "90vh",
          }}
        >
          {/* ── Header ──────────────────────────────────────────── */}
          <div className="shrink-0 flex items-center gap-3 border-b px-6 py-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search developers by name, role, or skill..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9"
              />
            </div>
            {activeFilterCount > 0 && (
              <>
                <Badge variant="secondary" className="shrink-0">
                  {activeFilterCount} filter
                  {activeFilterCount !== 1 ? "s" : ""}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="shrink-0 gap-1 text-xs text-muted-foreground"
                >
                  <X className="size-3" />
                  Clear all
                </Button>
              </>
            )}
            <Separator orientation="vertical" className="h-6" />
            <span className="shrink-0 text-sm text-muted-foreground">
              {filteredDevs.length} developer
              {filteredDevs.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* ── Body: sidebar + table ─────────────────────────── */}
          <div className="flex min-h-0 flex-1">
            {/* Left sidebar — filters */}
            <div className="w-64 shrink-0 overflow-y-auto border-r p-4 space-y-5">
              {/* Skills */}
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Skills
                </Label>
                <Popover
                  open={skillsPopoverOpen}
                  onOpenChange={setSkillsPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between font-normal"
                    >
                      <span className="truncate">
                        {filters.skills.length > 0
                          ? `${filters.skills.length} selected`
                          : "Any skill"}
                      </span>
                      <ChevronDown className="ml-2 size-3.5 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[220px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search skills..." />
                      <CommandList>
                        <CommandEmpty>No skills found.</CommandEmpty>
                        <CommandGroup>
                          {allSkills.map((skill) => (
                            <CommandItem
                              key={skill}
                              onSelect={() => toggleSkill(skill)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 size-3.5",
                                  filters.skills.includes(skill)
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {skill}
                              {reqSkillsLower.has(skill.toLowerCase()) && (
                                <Badge
                                  variant="secondary"
                                  className="ml-auto text-[10px] px-1 py-0"
                                >
                                  req
                                </Badge>
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {filters.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {filters.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="gap-1 text-xs cursor-pointer"
                        onClick={() => toggleSkill(skill)}
                      >
                        {skill}
                        <X className="size-2.5" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Experience */}
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Experience (years)
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    min={0}
                    className="w-full"
                    value={filters.expMin}
                    onChange={(e) =>
                      setFilters((p) => ({ ...p, expMin: e.target.value }))
                    }
                  />
                  <span className="text-xs text-muted-foreground">to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    min={0}
                    className="w-full"
                    value={filters.expMax}
                    onChange={(e) =>
                      setFilters((p) => ({ ...p, expMax: e.target.value }))
                    }
                  />
                </div>
              </div>

              {/* Rate */}
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Rate ($/hr)
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    min={0}
                    className="w-full font-mono"
                    value={filters.rateMin}
                    onChange={(e) =>
                      setFilters((p) => ({ ...p, rateMin: e.target.value }))
                    }
                  />
                  <span className="text-xs text-muted-foreground">to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    min={0}
                    className="w-full font-mono"
                    value={filters.rateMax}
                    onChange={(e) =>
                      setFilters((p) => ({ ...p, rateMax: e.target.value }))
                    }
                  />
                </div>
              </div>

              {/* Rating */}
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Minimum Rating
                </Label>
                <Select
                  value={filters.minRating || "any"}
                  onValueChange={(v) =>
                    setFilters((p) => ({
                      ...p,
                      minRating: v === "any" ? "" : v,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any rating</SelectItem>
                    <SelectItem value="4.0">4.0+</SelectItem>
                    <SelectItem value="4.5">4.5+</SelectItem>
                    <SelectItem value="4.8">4.8+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Location
                </Label>
                <Input
                  placeholder="City or country..."
                  value={filters.location}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, location: e.target.value }))
                  }
                />
              </div>
            </div>

            {/* Right main area — table */}
            <div className="flex-1 flex flex-col min-h-0">
              {filteredDevs.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                  <Users className="size-10 text-muted-foreground/40" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    No developers match your filters.
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={clearAllFilters}
                  >
                    Clear all filters
                  </Button>
                </div>
              ) : (
                <div className="flex-1 overflow-auto">
                  <table className="w-full">
                    <thead className="sticky top-0 z-10 bg-background border-b">
                      <tr className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        <th className="w-10 px-3 py-2.5 text-left">
                          <Checkbox
                            checked={allVisibleSelected}
                            onCheckedChange={toggleSelectAll}
                          />
                        </th>
                        <th className="px-3 py-2.5 text-left">Developer</th>
                        <th className="px-3 py-2.5 text-left">Skills</th>
                        <th className="px-3 py-2.5 text-left">Location</th>
                        <th className="px-3 py-2.5 text-right">Exp</th>
                        <th className="px-3 py-2.5 text-right">Rating</th>
                        <th className="px-3 py-2.5 text-right">Rate</th>
                        <th className="w-20 px-3 py-2.5 text-right">Match</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {visibleDevs.map(({ dev, score, matchingSkills }) => {
                        const isSelected = selectedIds.has(dev.id);
                        return (
                          <tr
                            key={dev.id}
                            className={cn(
                              "cursor-pointer transition-colors",
                              isSelected
                                ? "bg-pulse/5"
                                : "hover:bg-muted/50",
                            )}
                            onClick={() => toggleSelection(dev.id)}
                          >
                            <td className="px-3 py-2.5">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() =>
                                  toggleSelection(dev.id)
                                }
                                onClick={(e) => e.stopPropagation()}
                              />
                            </td>
                            <td className="px-3 py-2.5">
                              <div className="flex items-center gap-2.5">
                                <Avatar className="size-8 shrink-0">
                                  <AvatarImage
                                    src={dev.avatar}
                                    alt={dev.name}
                                  />
                                  <AvatarFallback className="text-[10px]">
                                    {getInitials(dev.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium truncate">
                                    {dev.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {dev.role}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-2.5">
                              <div className="flex flex-wrap gap-1">
                                {dev.skills.slice(0, 4).map((skill) => (
                                  <Badge
                                    key={skill}
                                    variant={
                                      matchingSkills.some(
                                        (ms) =>
                                          ms.toLowerCase() ===
                                          skill.toLowerCase(),
                                      )
                                        ? "default"
                                        : "secondary"
                                    }
                                    className="text-[11px] px-2 py-0.5"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                                {dev.skills.length > 4 && (
                                  <Badge
                                    variant="secondary"
                                    className="text-[11px] px-2 py-0.5"
                                  >
                                    +{dev.skills.length - 4}
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-2.5">
                              <span className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                                <MapPin className="size-3 shrink-0" />
                                {dev.location}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 text-right text-xs text-muted-foreground whitespace-nowrap">
                              {dev.yearsOfExperience}y
                            </td>
                            <td className="px-3 py-2.5 text-right">
                              <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground whitespace-nowrap">
                                <Star className="size-3 fill-amber-400 text-amber-400" />
                                {dev.rating}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 text-right font-mono text-xs text-muted-foreground whitespace-nowrap">
                              ${dev.hourlyRate}/hr
                            </td>
                            <td className="px-3 py-2.5 text-right">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "font-mono text-xs",
                                  scoreBadgeClass(score),
                                )}
                              >
                                {score}%
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {hasMore && (
                    <div className="flex justify-center border-t py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setVisibleCount((c) => c + PAGE_SIZE);
                        }}
                        className="text-xs text-muted-foreground"
                      >
                        Load more ({filteredDevs.length - visibleCount}{" "}
                        remaining)
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Footer — always rendered, content conditional ─── */}
          <div className="shrink-0 flex items-center gap-4 border-t px-6 py-3">
            {selectedIds.size > 0 ? (
              <>
                <span className="text-sm font-medium">
                  {selectedIds.size} selected
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedIds(new Set())}
                  className="text-xs text-muted-foreground"
                >
                  Clear
                </Button>
                <div className="flex-1" />
                <Button
                  size="sm"
                  className="gap-1.5 bg-pulse text-pulse-foreground hover:bg-pulse/90"
                  onClick={() => {
                    const initial: Record<string, { hourlyRate: string }> = {};
                    for (const { dev } of scoredDevs) {
                      if (selectedIds.has(dev.id)) {
                        initial[dev.id] = {
                          hourlyRate: String(dev.hourlyRate),
                        };
                      }
                    }
                    setDevRates(initial);
                    setBulkDialogOpen(true);
                  }}
                >
                  Propose Selected ({selectedIds.size})
                </Button>
              </>
            ) : (
              <span className="text-xs text-muted-foreground">
                Select developers to propose them for this requirement.
              </span>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Bulk Propose Dialog ──────────────────────────────── */}
      <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Propose {selectedIds.size} Engineer
              {selectedIds.size !== 1 ? "s" : ""}
            </DialogTitle>
            <DialogDescription>
              Set hourly rates and work schedule for the selected developers.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Work Schedule */}
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Work Schedule
              </Label>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="working-days" className="text-xs">
                    Days / month
                  </Label>
                  <Input
                    id="working-days"
                    type="number"
                    min={1}
                    max={31}
                    value={workingDaysPerMonth}
                    onChange={(e) => setWorkingDaysPerMonth(e.target.value)}
                    className="font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="hours-day" className="text-xs">
                    Hours / day
                  </Label>
                  <Input
                    id="hours-day"
                    type="number"
                    min={1}
                    max={24}
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(e.target.value)}
                    className="font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                e.g. 22 days &times; 8h = 176h/mo (full-time), 22 &times; 4 =
                88h/mo (part-time)
              </p>
            </div>

            <Separator />

            {/* Developer Table */}
            <ScrollArea className="max-h-[320px]">
              <table className="w-full">
                <thead className="sticky top-0 z-10 bg-background">
                  <tr className="text-[10px] uppercase tracking-wider text-muted-foreground border-b">
                    <th className="px-3 py-2 text-left">Developer</th>
                    <th className="px-3 py-2 text-right">Hourly Rate</th>
                    <th className="px-3 py-2 text-right">Monthly Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {scoredDevs
                    .filter(({ dev }) => selectedIds.has(dev.id))
                    .map(({ dev }) => {
                      const hourly =
                        Number(devRates[dev.id]?.hourlyRate) || 0;
                      const monthly = Math.round(
                        hourly *
                          (Number(hoursPerDay) || 8) *
                          (Number(workingDaysPerMonth) || 22),
                      );
                      return (
                        <tr key={dev.id}>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-2">
                              <Avatar className="size-7">
                                <AvatarImage
                                  src={dev.avatar}
                                  alt={dev.name}
                                />
                                <AvatarFallback className="text-[10px]">
                                  {getInitials(dev.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {dev.name}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {dev.role}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-right">
                            <Input
                              type="number"
                              min={0}
                              value={devRates[dev.id]?.hourlyRate ?? ""}
                              onChange={(e) =>
                                setDevRates((prev) => ({
                                  ...prev,
                                  [dev.id]: {
                                    hourlyRate: e.target.value,
                                  },
                                }))
                              }
                              className="ml-auto w-28 text-right font-mono"
                            />
                          </td>
                          <td className="px-3 py-2.5 text-right font-mono text-sm text-muted-foreground whitespace-nowrap">
                            {monthly.toLocaleString()}/mo
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBulkDialogOpen(false)}
              disabled={proposing}
            >
              Cancel
            </Button>
            <Button
              disabled={proposing}
              className="gap-2 bg-pulse text-pulse-foreground hover:bg-pulse/90"
              onClick={handleBulkPropose}
            >
              {proposing && <Loader2 className="size-4 animate-spin" />}
              Confirm Proposals
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export { DeveloperPool };
