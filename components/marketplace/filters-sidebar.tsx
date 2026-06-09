"use client";

import { Check, X } from "lucide-react";

import type { MarketplaceSettings } from "@/lib/data/developers";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export interface MarketplaceFilterState {
  rate: number;
  exp: string[];
  stacks: string[];
  avail: boolean;
}

interface FiltersSidebarProps {
  settings: MarketplaceSettings;
  state: MarketplaceFilterState;
  onChange: (next: MarketplaceFilterState) => void;
  onClear: () => void;
  active: boolean;
}

function FilterSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <p className="mb-2.5 text-sm font-semibold">{label}</p>
      {children}
    </div>
  );
}

function MarketplaceFiltersSidebar({
  settings,
  state,
  onChange,
  onClear,
  active,
}: FiltersSidebarProps) {
  const toggleStack = (t: string) =>
    onChange({
      ...state,
      stacks: state.stacks.includes(t)
        ? state.stacks.filter((s) => s !== t)
        : [...state.stacks, t],
    });
  const toggleExp = (r: string) =>
    onChange({
      ...state,
      exp: state.exp.includes(r)
        ? state.exp.filter((s) => s !== r)
        : [...state.exp, r],
    });

  return (
    <div>
      <FilterSection label="Tech stack">
        <div className="flex flex-wrap gap-1.5">
          {settings.filters.techStacks.map((t) => {
            const on = state.stacks.includes(t);
            return (
              <button
                key={t}
                onClick={() => toggleStack(t)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs transition-colors",
                  on
                    ? "border-pulse/45 bg-pulse/10 text-pulse"
                    : "border-border text-muted-foreground hover:border-pulse/30"
                )}
              >
                {t}
              </button>
            );
          })}
        </div>
      </FilterSection>

      <div className="my-4 h-px bg-border" />

      <FilterSection label="Hourly rate">
        <Slider
          min={settings.filters.rateMin}
          max={settings.filters.rateMax}
          step={5}
          value={[state.rate]}
          onValueChange={([v]) => onChange({ ...state, rate: v })}
        />
        <div className="mt-1.5 flex justify-between text-[13px] text-muted-foreground">
          <span>${settings.filters.rateMin}/hr</span>
          <span className="font-mono tracking-wide text-pulse">
            ≤ ${state.rate}/hr
          </span>
        </div>
      </FilterSection>

      <div className="my-4 h-px bg-border" />

      <FilterSection label="Experience">
        <div className="flex flex-col gap-1">
          {settings.filters.experienceRanges.map((r) => {
            const on = state.exp.includes(r);
            return (
              <button
                key={r}
                onClick={() => toggleExp(r)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-2 py-1.5 text-left transition-colors",
                  on
                    ? "border-pulse/35 bg-pulse/10"
                    : "border-transparent hover:bg-accent"
                )}
              >
                <span
                  className={cn(
                    "inline-flex size-4 items-center justify-center rounded border",
                    on ? "border-pulse bg-pulse text-pulse-foreground" : "border-pulse/40"
                  )}
                >
                  {on && <Check className="size-3" strokeWidth={3.5} />}
                </span>
                <span className="text-sm">{r}</span>
              </button>
            );
          })}
        </div>
      </FilterSection>

      <div className="my-4 h-px bg-border" />

      <FilterSection label="Availability">
        <div className="flex items-center gap-3 rounded-lg border border-pulse/20 bg-pulse/5 px-2.5 py-2">
          <Switch
            checked={state.avail}
            onCheckedChange={(v) => onChange({ ...state, avail: v })}
          />
          <span className="text-sm">Available now</span>
        </div>
      </FilterSection>

      {active && (
        <button
          onClick={onClear}
          className="mt-1.5 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-pulse/25 px-2 py-2 text-[13px] text-pulse"
        >
          <X className="size-3.5" /> Clear all filters
        </button>
      )}
    </div>
  );
}

export { MarketplaceFiltersSidebar };
