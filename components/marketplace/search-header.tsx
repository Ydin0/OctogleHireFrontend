"use client";

import { Search, X } from "lucide-react";

import type { MarketplaceSettings } from "@/lib/data/developers";

interface MarketplaceSearchHeaderProps {
  query: string;
  onQuery: (value: string) => void;
  settings: MarketplaceSettings;
}

function MarketplaceSearchHeader({
  query,
  onQuery,
  settings,
}: MarketplaceSearchHeaderProps) {
  const { hero } = settings;
  return (
    <div className="rounded-[22px] border border-pulse/30 bg-gradient-to-br from-card to-pulse/5 p-7">
      <span className="inline-flex rounded-full border border-pulse/35 bg-pulse/10 px-2.5 py-1 text-xs font-medium text-pulse">
        {hero.eyebrow}
      </span>
      <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight">
        {hero.title}{" "}
        <span className="text-pulse">{hero.titleAccent}</span>
      </h1>
      <p className="mt-2 max-w-2xl text-[15px] text-muted-foreground">
        {hero.description}
      </p>
      <div className="relative mt-4 max-w-xl">
        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search by name, role, skill, or country…"
          className="h-11 w-full rounded-full border border-pulse/25 bg-background/90 pl-10 pr-10 text-sm outline-none focus-visible:border-pulse"
        />
        {query && (
          <button
            onClick={() => onQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export { MarketplaceSearchHeader };
