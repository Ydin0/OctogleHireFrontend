"use client";

import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  COUNTRY_OPTIONS,
  developers as staticDevelopers,
  JOB_TITLE_OPTIONS,
  MARKETPLACE_TECH_STACK_OPTIONS,
  type Developer,
} from "@/lib/data/developers";
import { fetchPublicDevelopers } from "@/lib/api/public-developers";
import { DeveloperGrid } from "./developer-grid";
import { FiltersSidebar } from "./filters-sidebar";
import { LeadCaptureDialog } from "./lead-capture-dialog";
import { NoResults } from "./no-results";
import { SearchHeader } from "./search-header";

const PUBLIC_VISIBLE = 6;
const LOCKED_COUNT = 3;
const FAKE_TOTAL_PAGES = 50;
const FAKE_DEVELOPER_COUNT = "1,200+";
const DISPLAY_VISIBLE = 9;

function matchesExperienceRange(
  years: number,
  range: string
): boolean {
  switch (range) {
    case "0–2 years":
      return years >= 0 && years <= 2;
    case "3–5 years":
      return years >= 3 && years <= 5;
    case "6–8 years":
      return years >= 6 && years <= 8;
    case "9+ years":
      return years >= 9;
    default:
      return false;
  }
}

type SortOption =
  | "relevance"
  | "rating-desc"
  | "experience-desc"
  | "hourly-asc"
  | "hourly-desc";

function getCountryFromLocation(location: string): string {
  const parts = location.split(",").map((part) => part.trim());
  return parts[parts.length - 1] ?? location;
}

function normalizeTitleForMatch(value: string): string {
  return value
    .toLowerCase()
    .replace(/\b(senior|junior|lead|principal|staff)\b/g, "")
    .replace(/\b(engineer|developer|architect|specialist)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const DevelopersPage = () => {
  const [developers, setDevelopers] = useState<Developer[]>(staticDevelopers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStacks, setSelectedStacks] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedTitles, setSelectedTitles] = useState<string[]>([]);
  const [rateRange, setRateRange] = useState<[number, number]>([45, 150]);
  const [experienceRanges, setExperienceRanges] = useState<string[]>([]);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("relevance");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTrigger, setDialogTrigger] = useState<
    "locked-profile" | "pagination"
  >("locked-profile");

  // Fetch live developers from API — always public/featured
  useEffect(() => {
    const load = async () => {
      const result = await fetchPublicDevelopers({
        featured: true,
        limit: 9,
      });
      if (result && result.developers.length > 0) {
        setDevelopers(result.developers);
      }
    };
    load();
  }, []);

  const countries = COUNTRY_OPTIONS;
  const titles = JOB_TITLE_OPTIONS;
  const techStackOptions = MARKETPLACE_TECH_STACK_OPTIONS;

  const hasActiveFilters =
    searchQuery.length > 0 ||
    selectedStacks.length > 0 ||
    selectedCountries.length > 0 ||
    selectedTitles.length > 0 ||
    rateRange[0] !== 45 ||
    rateRange[1] !== 150 ||
    experienceRanges.length > 0 ||
    availableOnly;

  const activeFilterCount =
    selectedStacks.length +
    selectedCountries.length +
    selectedTitles.length +
    (rateRange[0] !== 45 || rateRange[1] !== 150 ? 1 : 0) +
    experienceRanges.length +
    (availableOnly ? 1 : 0);

  const filteredDevelopers = useMemo(() => {
    return developers.filter((dev) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchable = [
          dev.name,
          dev.role,
          ...dev.skills,
          dev.location,
          dev.bio,
        ]
          .join(" ")
          .toLowerCase();

        if (!searchable.includes(query)) {
          return false;
        }
      }

      if (selectedStacks.length > 0) {
        const hasAll = selectedStacks.every((stack) =>
          dev.skills.includes(stack)
        );
        if (!hasAll) return false;
      }

      if (selectedCountries.length > 0) {
        const country = getCountryFromLocation(dev.location);
        if (!selectedCountries.includes(country)) {
          return false;
        }
      }

      if (selectedTitles.length > 0) {
        const normalizedRole = dev.role.toLowerCase();
        const normalizedRoleForMatch = normalizeTitleForMatch(dev.role);
        const matchesTitle = selectedTitles.some((title) =>
          normalizedRole.includes(title.toLowerCase()) ||
          normalizedRoleForMatch.includes(normalizeTitleForMatch(title))
        );
        if (!matchesTitle) {
          return false;
        }
      }

      if (dev.hourlyRate < rateRange[0] || dev.hourlyRate > rateRange[1]) {
        return false;
      }

      if (experienceRanges.length > 0) {
        const matchesAny = experienceRanges.some((range) =>
          matchesExperienceRange(dev.yearsOfExperience, range)
        );
        if (!matchesAny) return false;
      }

      if (availableOnly && !dev.isOnline) {
        return false;
      }

      return true;
    });
  }, [
    developers,
    searchQuery,
    selectedStacks,
    selectedCountries,
    selectedTitles,
    rateRange,
    experienceRanges,
    availableOnly,
  ]);

  const sortedDevelopers = useMemo(() => {
    const next = [...filteredDevelopers];

    switch (sortBy) {
      case "rating-desc":
        next.sort((a, b) => b.rating - a.rating);
        break;
      case "experience-desc":
        next.sort((a, b) => b.yearsOfExperience - a.yearsOfExperience);
        break;
      case "hourly-asc":
        next.sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      case "hourly-desc":
        next.sort((a, b) => b.hourlyRate - a.hourlyRate);
        break;
      default:
        break;
    }

    return next;
  }, [filteredDevelopers, sortBy]);

  const showLocked = sortedDevelopers.length >= PUBLIC_VISIBLE;
  const visibleDevelopers = showLocked
    ? sortedDevelopers.slice(0, PUBLIC_VISIBLE)
    : sortedDevelopers;

  const openDialog = (trigger: "locked-profile" | "pagination") => {
    setDialogTrigger(trigger);
    setDialogOpen(true);
  };

  const toggleStack = (stack: string) => {
    setSelectedStacks((prev) =>
      prev.includes(stack)
        ? prev.filter((s) => s !== stack)
        : [...prev, stack]
    );
  };

  const toggleCountry = (country: string) => {
    setSelectedCountries((prev) =>
      prev.includes(country)
        ? prev.filter((item) => item !== country)
        : [...prev, country]
    );
  };

  const toggleTitle = (title: string) => {
    setSelectedTitles((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const toggleExperience = (range: string) => {
    setExperienceRanges((prev) =>
      prev.includes(range)
        ? prev.filter((r) => r !== range)
        : [...prev, range]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedStacks([]);
    setSelectedCountries([]);
    setSelectedTitles([]);
    setRateRange([45, 150]);
    setExperienceRanges([]);
    setAvailableOnly(false);
    setSortBy("relevance");
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleRateChange = (value: [number, number]) => {
    setRateRange(value);
  };

  const handleAvailableChange = (value: boolean) => {
    setAvailableOnly(value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value as SortOption);
  };

  const sidebarProps = {
    techStackOptions,
    selectedStacks,
    onToggleStack: toggleStack,
    countries,
    selectedCountries,
    onToggleCountry: toggleCountry,
    titles,
    selectedTitles,
    onToggleTitle: toggleTitle,
    rateRange,
    onRateChange: handleRateChange,
    experienceRanges,
    onToggleExperience: toggleExperience,
    availableOnly,
    onAvailableChange: handleAvailableChange,
    onClearFilters: clearFilters,
    hasActiveFilters,
  };

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-6">
        <SearchHeader
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />

        {/* Toolbar: mobile filter button + result count */}
        <div className="mt-6 flex items-center justify-between">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-pulse/30 text-foreground hover:bg-pulse/10 lg:hidden"
              >
                <SlidersHorizontal className="size-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge
                    className="ml-1.5 size-5 rounded-full border border-pulse/40 bg-pulse/15 p-0 text-[10px] text-pulse flex items-center justify-center"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="px-4 pb-4">
                <FiltersSidebar {...sidebarProps} />
              </div>
            </SheetContent>
          </Sheet>

          <p className="rounded-full border border-pulse/25 bg-pulse/5 px-3 py-1 text-sm text-muted-foreground ml-auto">
            Showing {DISPLAY_VISIBLE} of {FAKE_DEVELOPER_COUNT}{" "}
            developers
          </p>
        </div>

        <div className="mt-3 flex justify-end">
          <Select
            value={sortBy}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-[220px] border-pulse/30 bg-background/90 focus:ring-pulse/35">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="rating-desc">Highest Rating</SelectItem>
              <SelectItem value="experience-desc">Most Experience</SelectItem>
              <SelectItem value="hourly-asc">Hourly Rate: Low to High</SelectItem>
              <SelectItem value="hourly-desc">Hourly Rate: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Main layout: sidebar + grid */}
        <div className="mt-6 flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden w-72 shrink-0 rounded-2xl border border-pulse/25 bg-card p-4 shadow-sm lg:block">
            <FiltersSidebar {...sidebarProps} />
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {sortedDevelopers.length > 0 ? (
              <>
                <DeveloperGrid
                  developers={visibleDevelopers}
                  lockedCount={showLocked ? LOCKED_COUNT : 0}
                  onUnlockClick={() => openDialog("locked-profile")}
                />

                {/* Fake pagination bar */}
                <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">
                    Page 1 of {FAKE_TOTAL_PAGES}
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-pulse/30 hover:bg-pulse/10"
                      disabled
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-pulse/30 hover:bg-pulse/10"
                      onClick={() => openDialog("pagination")}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <NoResults onClearFilters={clearFilters} />
            )}
          </main>
        </div>
      </div>

      <LeadCaptureDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        trigger={dialogTrigger}
      />
    </section>
  );
};

export { DevelopersPage };
