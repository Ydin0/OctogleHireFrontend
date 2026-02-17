"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

const EXPERIENCE_RANGES = [
  "0–2 years",
  "3–5 years",
  "6–8 years",
  "9+ years",
] as const;

interface MultiSelectFilterProps {
  label: string;
  options: string[];
  selected: string[];
  placeholder: string;
  onToggle: (value: string) => void;
}

const MultiSelectFilter = ({
  label,
  options,
  selected,
  placeholder,
  onToggle,
}: MultiSelectFilterProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return options;
    }

    return options.filter((option) =>
      option.toLowerCase().includes(normalizedQuery)
    );
  }, [options, query]);

  const selectionLabel =
    selected.length === 0
      ? placeholder
      : selected.length <= 2
        ? selected.join(", ")
        : `${selected.length} selected`;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold text-foreground/90">
          {label}
        </Label>
        {selected.length > 0 && (
          <span className="text-[11px] font-mono uppercase tracking-[0.08em] text-pulse">
            {selected.length} selected
          </span>
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        className="h-auto w-full justify-between border-pulse/30 bg-background/90 px-3 py-2 text-left font-normal hover:bg-pulse/5"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="truncate text-sm">{selectionLabel}</span>
        <ChevronDown
          className={`size-4 shrink-0 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </Button>

      {open && (
        <div className="rounded-md border border-pulse/25 bg-card shadow-sm">
          <div className="border-b border-pulse/20 p-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={`Search ${label.toLowerCase()}...`}
                className="h-8 w-full rounded-md border border-pulse/20 bg-background pl-7 pr-2 text-sm outline-none focus:border-pulse/40"
              />
            </div>
          </div>

          <ScrollArea className="h-56">
            <div className="space-y-1 p-2">
              {filteredOptions.length === 0 ? (
                <p className="px-2 py-2 text-xs text-muted-foreground">
                  No matches found.
                </p>
              ) : (
                filteredOptions.map((option) => {
                  const checked = selected.includes(option);

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => onToggle(option)}
                      className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                        checked
                          ? "bg-pulse/10 text-foreground"
                          : "hover:bg-pulse/5"
                      }`}
                    >
                      <span
                        className={`flex size-4 items-center justify-center rounded-[4px] border ${
                          checked
                            ? "border-pulse bg-pulse text-pulse-foreground"
                            : "border-pulse/40"
                        }`}
                      >
                        {checked && <Check className="size-3" />}
                      </span>
                      <span>{option}</span>
                    </button>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

interface FiltersSidebarProps {
  techStackOptions: string[];
  selectedStacks: string[];
  onToggleStack: (stack: string) => void;
  countries: string[];
  selectedCountries: string[];
  onToggleCountry: (country: string) => void;
  titles: string[];
  selectedTitles: string[];
  onToggleTitle: (title: string) => void;
  rateRange: [number, number];
  onRateChange: (range: [number, number]) => void;
  experienceRanges: string[];
  onToggleExperience: (range: string) => void;
  availableOnly: boolean;
  onAvailableChange: (available: boolean) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const FiltersSidebar = ({
  techStackOptions,
  selectedStacks,
  onToggleStack,
  countries,
  selectedCountries,
  onToggleCountry,
  titles,
  selectedTitles,
  onToggleTitle,
  rateRange,
  onRateChange,
  experienceRanges,
  onToggleExperience,
  availableOnly,
  onAvailableChange,
  onClearFilters,
  hasActiveFilters,
}: FiltersSidebarProps) => {
  return (
    <div className="space-y-4">
      <MultiSelectFilter
        label="Tech Stack"
        options={techStackOptions}
        selected={selectedStacks}
        placeholder="Select technologies"
        onToggle={onToggleStack}
      />

      <MultiSelectFilter
        label="Country"
        options={countries}
        selected={selectedCountries}
        placeholder="Select countries"
        onToggle={onToggleCountry}
      />

      <MultiSelectFilter
        label="Title"
        options={titles}
        selected={selectedTitles}
        placeholder="Select job titles"
        onToggle={onToggleTitle}
      />

      <Separator />

      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground/90">
          Hourly Rate
        </Label>
        <Slider
          min={45}
          max={150}
          step={5}
          value={rateRange}
          onValueChange={(value) => onRateChange(value as [number, number])}
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>${rateRange[0]}/hr</span>
          <span>${rateRange[1]}/hr</span>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-foreground/90">
          Experience
        </Label>
        <div className="space-y-2">
          {EXPERIENCE_RANGES.map((range) => (
            <div
              key={range}
              className={`flex items-center gap-2 rounded-md border px-2 py-1.5 transition-colors ${
                experienceRanges.includes(range)
                  ? "border-pulse/35 bg-pulse/10"
                  : "border-transparent hover:border-pulse/20 hover:bg-pulse/5"
              }`}
            >
              <Checkbox
                id={`exp-${range}`}
                checked={experienceRanges.includes(range)}
                onCheckedChange={() => onToggleExperience(range)}
                className="border-pulse/40 data-[state=checked]:bg-pulse data-[state=checked]:border-pulse"
              />
              <Label
                htmlFor={`exp-${range}`}
                className="cursor-pointer text-sm font-normal"
              >
                {range}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-foreground/90">
          Availability
        </Label>
        <div className="flex items-center gap-3 rounded-md border border-pulse/20 bg-pulse/5 px-2 py-2">
          <Switch
            id="available-now"
            checked={availableOnly}
            onCheckedChange={onAvailableChange}
          />
          <Label
            htmlFor="available-now"
            className="cursor-pointer text-sm font-normal"
          >
            Available now
          </Label>
        </div>
      </div>

      {hasActiveFilters && (
        <>
          <Separator />
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="w-full border border-pulse/25 text-pulse hover:bg-pulse/10 hover:text-pulse"
          >
            <X className="mr-1 size-3" />
            Clear all filters
          </Button>
        </>
      )}
    </div>
  );
};

export { FiltersSidebar, EXPERIENCE_RANGES };
