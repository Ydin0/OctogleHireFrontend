"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import type { Developer, MarketplaceSettings } from "@/lib/data/developers";
import { Button } from "@/components/ui/button";
import { DeveloperCard } from "./developer-card";
import { DeveloperProfile } from "./developer-profile";
import {
  MarketplaceFiltersSidebar,
  type MarketplaceFilterState,
} from "./filters-sidebar";
import { MarketplaceSearchHeader } from "./search-header";

interface MarketplaceBrowseProps {
  developers: Developer[];
  settings: MarketplaceSettings;
  /** Optional banner shown at the top (e.g. the admin "preview mode" bar). */
  topBar?: React.ReactNode;
}

function matchesExperience(years: number, ranges: string[]): boolean {
  if (ranges.length === 0) return true;
  return ranges.some((r) => {
    if (r.startsWith("0")) return years <= 2;
    if (r.startsWith("3")) return years >= 3 && years <= 5;
    if (r.startsWith("6")) return years >= 6 && years <= 8;
    return years >= 9;
  });
}

function MarketplaceBrowse({
  developers,
  settings,
  topBar,
}: MarketplaceBrowseProps) {
  const [selected, setSelected] = useState<Developer | null>(null);
  const [query, setQuery] = useState("");
  const [shortlist, setShortlist] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<MarketplaceFilterState>({
    rate: settings.filters.rateMax,
    exp: [],
    stacks: [],
    avail: false,
  });

  const toggleSave = (id: string) =>
    setShortlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return developers.filter((d) => {
      const skillNames = (d.skillLevels?.map((s) => s.name) ?? d.skills).join(" ");
      const qMatch =
        !q ||
        [d.name, d.role, d.location, skillNames].join(" ").toLowerCase().includes(q);
      const stackMatch =
        filters.stacks.length === 0 ||
        filters.stacks.every((s) =>
          (d.skillLevels?.map((k) => k.name) ?? d.skills).includes(s)
        );
      return (
        qMatch &&
        d.hourlyRate <= filters.rate &&
        matchesExperience(d.yearsOfExperience, filters.exp) &&
        stackMatch &&
        (!filters.avail || d.isOnline)
      );
    });
  }, [developers, query, filters]);

  const active =
    !!query ||
    filters.rate < settings.filters.rateMax ||
    filters.exp.length > 0 ||
    filters.stacks.length > 0 ||
    filters.avail;

  const clear = () =>
    setFilters({
      rate: settings.filters.rateMax,
      exp: [],
      stacks: [],
      avail: false,
    });

  return (
    <div className="marketplace-route">
      {topBar}
      {selected ? (
        <div className="mx-auto max-w-[1180px]">
          <DeveloperProfile
            developer={selected}
            saved={shortlist.has(selected.id)}
            onSave={toggleSave}
            onBack={() => setSelected(null)}
            settings={settings}
          />
        </div>
      ) : (
        <div className="mx-auto max-w-[1280px]">
          <MarketplaceSearchHeader
            query={query}
            onQuery={setQuery}
            settings={settings}
          />
          <div className="mt-5 grid items-start gap-6 lg:grid-cols-[260px_1fr]">
            <aside className="sticky top-4 hidden rounded-[18px] border border-border bg-card p-4.5 lg:block">
              <MarketplaceFiltersSidebar
                settings={settings}
                state={filters}
                onChange={setFilters}
                onClear={clear}
                active={active}
              />
            </aside>
            <main>
              <div className="mb-3.5 flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                  {results.length} engineer{results.length === 1 ? "" : "s"} found
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Sorted by · gauntlet score
                </span>
              </div>
              {results.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {results.map((d) => (
                    <DeveloperCard
                      key={d.id}
                      developer={d}
                      saved={shortlist.has(d.id)}
                      onSave={toggleSave}
                      onOpen={setSelected}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center text-muted-foreground">
                  <p className="text-[15px]">No engineers match your filters.</p>
                  <Button
                    variant="outline"
                    onClick={clear}
                    className="mt-2 rounded-full"
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}

export { MarketplaceBrowse };
export const AdminPreviewBar = () => (
  <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-full border border-border bg-card px-4 py-2.5">
    <Link
      href="/admin/dashboard/marketplace"
      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="size-4" /> Back to admin
    </Link>
    <span className="inline-flex items-center gap-2 text-sm">
      <span className="text-[10px] font-mono uppercase tracking-wider text-pulse">
        Preview
      </span>
      <span className="text-muted-foreground">What companies see · Acme Corp</span>
    </span>
  </div>
);
