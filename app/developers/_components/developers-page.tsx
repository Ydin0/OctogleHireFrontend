"use client";

import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, Lock } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

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
import { NoResults } from "./no-results";
import { SearchHeader } from "./search-header";

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

const PAGE_SIZE = 9;

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
  const { isSignedIn } = useAuth();
  const [developers, setDevelopers] = useState<Developer[]>(staticDevelopers);
  const [apiLoaded, setApiLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStacks, setSelectedStacks] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedTitles, setSelectedTitles] = useState<string[]>([]);
  const [rateRange, setRateRange] = useState<[number, number]>([45, 150]);
  const [experienceRanges, setExperienceRanges] = useState<string[]>([]);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch live developers from API
  useEffect(() => {
    const load = async () => {
      const params = isSignedIn
        ? { limit: 100 }
        : { featured: true, limit: 9 };
      const result = await fetchPublicDevelopers(params);
      if (result && result.developers.length > 0) {
        setDevelopers(result.developers);
        setApiLoaded(true);
      }
    };
    load();
  }, [isSignedIn]);

  const showUnlockCta = !isSignedIn && apiLoaded;

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
      // Text search
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

      // Stack filter: AND logic
      if (selectedStacks.length > 0) {
        const hasAll = selectedStacks.every((stack) =>
          dev.skills.includes(stack)
        );
        if (!hasAll) return false;
      }

      // Country filter
      if (selectedCountries.length > 0) {
        const country = getCountryFromLocation(dev.location);
        if (!selectedCountries.includes(country)) {
          return false;
        }
      }

      // Role/title filter
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

      // Rate filter
      if (dev.hourlyRate < rateRange[0] || dev.hourlyRate > rateRange[1]) {
        return false;
      }

      // Experience filter: OR logic across selected ranges
      if (experienceRanges.length > 0) {
        const matchesAny = experienceRanges.some((range) =>
          matchesExperienceRange(dev.yearsOfExperience, range)
        );
        if (!matchesAny) return false;
      }

      // Availability filter
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

  const totalPages = Math.max(1, Math.ceil(sortedDevelopers.length / PAGE_SIZE));
  const clampedCurrentPage = Math.min(currentPage, totalPages);

  const paginatedDevelopers = useMemo(() => {
    const start = (clampedCurrentPage - 1) * PAGE_SIZE;
    return sortedDevelopers.slice(start, start + PAGE_SIZE);
  }, [sortedDevelopers, clampedCurrentPage]);

  const toggleStack = (stack: string) => {
    setCurrentPage(1);
    setSelectedStacks((prev) =>
      prev.includes(stack)
        ? prev.filter((s) => s !== stack)
        : [...prev, stack]
    );
  };

  const toggleCountry = (country: string) => {
    setCurrentPage(1);
    setSelectedCountries((prev) =>
      prev.includes(country)
        ? prev.filter((item) => item !== country)
        : [...prev, country]
    );
  };

  const toggleTitle = (title: string) => {
    setCurrentPage(1);
    setSelectedTitles((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const toggleExperience = (range: string) => {
    setCurrentPage(1);
    setExperienceRanges((prev) =>
      prev.includes(range)
        ? prev.filter((r) => r !== range)
        : [...prev, range]
    );
  };

  const clearFilters = () => {
    setCurrentPage(1);
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
    setCurrentPage(1);
    setSearchQuery(value);
  };

  const handleRateChange = (value: [number, number]) => {
    setCurrentPage(1);
    setRateRange(value);
  };

  const handleAvailableChange = (value: boolean) => {
    setCurrentPage(1);
    setAvailableOnly(value);
  };

  const handleSortChange = (value: string) => {
    setCurrentPage(1);
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
            Showing {sortedDevelopers.length} of {developers.length}{" "}
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
                <DeveloperGrid developers={paginatedDevelopers} />

                {showUnlockCta && (
                  <div className="mt-10 rounded-2xl border border-border bg-card p-8 text-center">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
                      <Lock className="size-5 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">
                      Unlock the Full Marketplace
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Sign up as a company to browse all pre-vetted developers, filter by tech stack, and hire instantly.
                    </p>
                    <Button className="mt-5" asChild>
                      <Link href="/auth/companies/sign-up">
                        Get Started
                      </Link>
                    </Button>
                  </div>
                )}

                {!showUnlockCta && (
                  <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-muted-foreground">
                      Page {clampedCurrentPage} of {totalPages}
                    </p>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-pulse/30 hover:bg-pulse/10"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={clampedCurrentPage <= 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-pulse/30 hover:bg-pulse/10"
                        onClick={() =>
                          setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                        }
                        disabled={clampedCurrentPage >= totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <NoResults onClearFilters={clearFilters} />
            )}
          </main>
        </div>
      </div>
    </section>
  );
};

export { DevelopersPage };
