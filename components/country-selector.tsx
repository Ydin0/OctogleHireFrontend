"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";

import {
  HIRING_COUNTRY_OPTIONS,
  type HiringCountryOption,
} from "@/lib/data/hiring-countries";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface CountrySelectorProps {
  value: string[];
  onChange: (codes: string[]) => void;
  max?: number;
}

const NOTED_COUNT = HIRING_COUNTRY_OPTIONS.filter((c) => c.note).length;

const CountrySelector = ({ value, onChange, max = 20 }: CountrySelectorProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { popular, rest } = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const all = normalizedQuery
      ? HIRING_COUNTRY_OPTIONS.filter(
          (c) =>
            c.name.toLowerCase().includes(normalizedQuery) ||
            c.code.toLowerCase().includes(normalizedQuery),
        )
      : HIRING_COUNTRY_OPTIONS;

    return {
      popular: all.filter((c) => c.note),
      rest: all.filter((c) => !c.note),
    };
  }, [query]);

  const toggle = (code: string) => {
    if (value.includes(code)) {
      onChange(value.filter((c) => c !== code));
    } else if (value.length < max) {
      onChange([...value, code]);
    }
  };

  const remove = (code: string) => {
    onChange(value.filter((c) => c !== code));
  };

  const handleToggleOpen = () => {
    setOpen((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => searchRef.current?.focus(), 0);
      }
      return next;
    });
  };

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const selectedCountries = value
    .map((code) =>
      HIRING_COUNTRY_OPTIONS.find((c) => c.code === code),
    )
    .filter(Boolean) as HiringCountryOption[];

  const selectionLabel =
    value.length === 0
      ? "Select hiring countries..."
      : value.length <= 2
        ? selectedCountries.map((c) => `${c.flag} ${c.name}`).join(", ")
        : `${value.length} countries selected`;

  const renderOption = (option: HiringCountryOption) => {
    const checked = value.includes(option.code);
    const disabled = !checked && value.length >= max;

    return (
      <button
        key={option.code}
        type="button"
        disabled={disabled}
        onClick={() => toggle(option.code)}
        className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
          checked
            ? "bg-primary/10 text-foreground"
            : disabled
              ? "cursor-not-allowed opacity-40"
              : "hover:bg-muted"
        }`}
      >
        <span
          className={`flex size-4 shrink-0 items-center justify-center rounded-[4px] border ${
            checked
              ? "border-primary bg-primary text-primary-foreground"
              : "border-input"
          }`}
        >
          {checked && <Check className="size-3" />}
        </span>
        <span className="shrink-0">{option.flag}</span>
        <span className="truncate">{option.name}</span>
        {option.note && (
          <span className="ml-auto shrink-0 text-[10px] text-muted-foreground">
            {option.note}
          </span>
        )}
      </button>
    );
  };

  return (
    <div ref={containerRef}>
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          className="h-auto w-full justify-between px-3 py-2 text-left font-normal"
          onClick={handleToggleOpen}
        >
          <span className="truncate text-sm">{selectionLabel}</span>
          <ChevronDown
            className={`size-4 shrink-0 text-muted-foreground transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </Button>

        {open && (
          <div className="absolute left-0 z-50 mt-1 w-full rounded-md border bg-card shadow-md">
            <div className="border-b p-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  ref={searchRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search countries..."
                  className="h-8 w-full rounded-md border bg-background pl-7 pr-2 text-sm outline-none focus:border-ring"
                />
              </div>
            </div>

            <ScrollArea className="h-64">
              <div className="space-y-0.5 p-2">
                {popular.length === 0 && rest.length === 0 ? (
                  <p className="px-2 py-2 text-xs text-muted-foreground">
                    No matches found.
                  </p>
                ) : (
                  <>
                    {popular.length > 0 && (
                      <>
                        <p className="px-2 pb-1 pt-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                          Popular Hiring Countries
                        </p>
                        {popular.map(renderOption)}
                      </>
                    )}
                    {rest.length > 0 && (
                      <>
                        {popular.length > 0 && (
                          <div className="my-1.5 border-t" />
                        )}
                        <p className="px-2 pb-1 pt-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                          All Countries
                        </p>
                        {rest.map(renderOption)}
                      </>
                    )}
                  </>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      {selectedCountries.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {selectedCountries.map((c) => (
            <Badge
              key={c.code}
              variant="secondary"
              className="gap-1 pr-1 text-xs"
            >
              {c.flag} {c.name}
              <button
                type="button"
                onClick={() => remove(c.code)}
                className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <p className="mt-1.5 text-xs text-muted-foreground">
        {value.length}/{max} selected
      </p>
    </div>
  );
};

export { CountrySelector };
