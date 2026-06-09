"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Bookmark, MapPin, ShieldCheck, Sparkles, X } from "lucide-react";

import type { Developer, MarketplaceSettings } from "@/lib/data/developers";
import { TECH_ICONS } from "@/lib/tech-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ConsoleDetailPane, MiniRing, Mono } from "./console-ui";
import { useShortlist } from "./shortlist-context";

// ── Prompt → search criteria (filter, not a fabricated AI score) ─────────────

interface Criteria {
  raw: string;
  stacks: string[];
  yrsMin: number;
  seniority: string | null;
  budgetMax: number | null;
  region: string | null;
  availableOnly: boolean;
  active: boolean;
}

const ALIASES: Record<string, string> = {
  node: "Node.js",
  nodejs: "Node.js",
  next: "Next.js",
  nextjs: "Next.js",
  postgres: "PostgreSQL",
  k8s: "Kubernetes",
  kube: "Kubernetes",
  ts: "TypeScript",
  js: "JavaScript",
  ml: "PyTorch",
  ai: "PyTorch",
  rag: "PyTorch",
  llm: "PyTorch",
  devops: "Kubernetes",
  cloud: "AWS",
};

function parsePrompt(text: string, allStacks: string[]): Criteria {
  const t = " " + text.toLowerCase() + " ";
  const found = new Set<string>();
  allStacks.forEach((s) => {
    if (t.includes(s.toLowerCase())) found.add(s);
  });
  Object.keys(ALIASES).forEach((k) => {
    if (new RegExp("[^a-z]" + k.replace(/[.+]/g, "\\$&") + "[^a-z]").test(t))
      found.add(ALIASES[k]);
  });

  let seniority: string | null = null;
  let yrsMin = 0;
  if (/\b(junior|entry|grad)\b/.test(t)) {
    seniority = "Junior";
    yrsMin = 0;
  } else if (/\b(staff|principal|lead|architect|head)\b/.test(t)) {
    seniority = "Staff / Lead";
    yrsMin = 9;
  } else if (/\b(senior|sr|experienced)\b/.test(t)) {
    seniority = "Senior";
    yrsMin = 6;
  } else if (/\b(mid|intermediate)\b/.test(t)) {
    seniority = "Mid-level";
    yrsMin = 3;
  }

  let budgetMax: number | null = null;
  let m = t.match(/(?:under|below|less than|max|up ?to|≤|<)\s*\$?\s*(\d{2,3})\s*k?/);
  if (!m) m = t.match(/\$\s*(\d{2,3})/);
  if (m) {
    const n = +m[1];
    if (n >= 40 && n <= 200) budgetMax = n;
  }

  let region: string | null = null;
  if (/\b(us|usa|united states|america|americas|est|pst|eastern|pacific)\b/.test(t))
    region = "Americas";
  else if (/\b(europe|european|eu|emea|uk|cet|gmt)\b/.test(t)) region = "Europe";
  else if (/\b(india|asia|apac|ist|bangalore|bengaluru|mumbai)\b/.test(t))
    region = "Asia";

  const availableOnly = /\b(available|immediately|asap|start now|now)\b/.test(t);
  const active =
    found.size > 0 ||
    seniority != null ||
    budgetMax != null ||
    region != null ||
    availableOnly;

  return {
    raw: text.trim(),
    stacks: [...found],
    yrsMin,
    seniority,
    budgetMax,
    region,
    availableOnly,
    active,
  };
}

function regionMatch(region: string, loc: string) {
  if (region === "Americas")
    return /Brazil|Portugal|United States|USA|Canada|Mexico|Argentina/.test(loc);
  if (region === "Europe")
    return /Greece|Portugal|Spain|Germany|United Kingdom|UK|Ireland|France|Poland|Netherlands/.test(
      loc,
    );
  if (region === "Asia") return /India|Singapore|Vietnam|Philippines|Indonesia/.test(loc);
  return true;
}

function matchesCriteria(d: Developer, c: Criteria): boolean {
  if (!c.active) return true;
  const skillNames = (d.skillLevels?.map((s) => s.name) ?? d.skills);
  if (c.stacks.length && !c.stacks.every((s) => skillNames.includes(s))) return false;
  if (c.seniority && d.yearsOfExperience < c.yrsMin) return false;
  if (c.budgetMax != null && d.hourlyRate > c.budgetMax) return false;
  if (c.region && !regionMatch(c.region, d.location)) return false;
  if (c.availableOnly && !d.isOnline) return false;
  return true;
}

// ── Command bar ──────────────────────────────────────────────────────────────

const EXAMPLES = [
  "Senior React + TypeScript engineer, US overlap, under $80/hr",
  "ML engineer for RAG & agents, PyTorch, available now",
  "Staff platform engineer — Kubernetes, AWS",
];

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-pulse/38 bg-pulse/13 px-3 py-1 text-[12.5px] font-mono uppercase tracking-wider text-pulse">
      {children}
    </span>
  );
}

function CommandBar({
  crit,
  onSubmit,
  onClear,
  count,
  total,
}: {
  crit: Criteria;
  onSubmit: (text: string) => void;
  onClear: () => void;
  count: number;
  total: number;
}) {
  const [text, setText] = useState("");
  return (
    <div className="border-b border-border bg-gradient-to-b from-pulse/7 to-background px-7 pb-5 pt-5.5">
      <div className="mx-auto max-w-[1380px]">
        <div className="mb-3.5 flex items-center gap-2.5">
          <span className="inline-flex size-[26px] items-center justify-center rounded-full bg-pulse/16 text-pulse">
            <Sparkles className="size-3.5" />
          </span>
          <Mono className="text-[11px] text-pulse">
            Octogle talent search · 1,000+ vetted engineers
          </Mono>
        </div>
        <div className="flex flex-wrap items-stretch gap-3">
          <div className="relative flex min-w-[320px] flex-1 items-center">
            <Sparkles className="pointer-events-none absolute left-4.5 size-[18px] text-pulse" />
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSubmit(text);
              }}
              placeholder="Describe who you need to hire…"
              className={cn(
                "h-14 w-full rounded-full border bg-card/80 pl-12 pr-5 text-[17px] tracking-tight outline-none",
                crit.active ? "border-pulse/45" : "border-border",
              )}
            />
          </div>
          <Button
            onClick={() => onSubmit(text)}
            className="h-14 rounded-full px-6 text-[13px]"
          >
            <Sparkles className="size-4" /> Search
          </Button>
        </div>
        <div className="mt-3.5 flex min-h-[30px] flex-wrap items-center gap-2.5">
          {crit.active ? (
            <>
              <Mono className="mr-0.5 text-[10px] text-muted-foreground">
                Filtering on
              </Mono>
              {crit.stacks.map((s) => (
                <Chip key={s}>
                  {TECH_ICONS[s] && (
                    <Image src={TECH_ICONS[s]} alt="" width={13} height={13} unoptimized />
                  )}
                  {s}
                </Chip>
              ))}
              {crit.seniority && <Chip>{crit.seniority}</Chip>}
              {crit.budgetMax != null && <Chip>≤ ${crit.budgetMax}/hr</Chip>}
              {crit.region && <Chip>{crit.region}</Chip>}
              {crit.availableOnly && <Chip>Available now</Chip>}
              <button
                onClick={onClear}
                className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" /> Clear
              </button>
              <span className="ml-auto">
                <Mono className="text-[10px] text-pulse">
                  {count} of {total} match
                </Mono>
              </span>
            </>
          ) : (
            <>
              <Mono className="mr-0.5 text-[10px] text-muted-foreground">Try</Mono>
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => {
                    setText(ex);
                    onSubmit(ex);
                  }}
                  className="rounded-full border border-dashed border-border px-3 py-1.5 text-left text-[12.5px] text-muted-foreground transition-colors hover:border-pulse/45 hover:text-foreground"
                >
                  {ex}
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── List pane ────────────────────────────────────────────────────────────────

const SORTS = [
  { id: "vetting", label: "Vetting" },
  { id: "rate", label: "Rate" },
  { id: "years", label: "Exp" },
] as const;
type SortId = (typeof SORTS)[number]["id"];

function CandidateRow({
  dev,
  active,
  saved,
  onSelect,
  onSave,
}: {
  dev: Developer;
  active: boolean;
  saved: boolean;
  onSelect: (id: string) => void;
  onSave: (id: string) => void;
}) {
  const skills = dev.skillLevels?.map((s) => s.name) ?? dev.skills;
  const country = dev.location.split(",").pop()?.trim();
  return (
    <div
      onClick={() => onSelect(dev.id)}
      className={cn(
        "group relative flex cursor-pointer items-center gap-3 border-b border-border px-4 py-3.5 pl-[18px] transition-colors",
        active
          ? "border-l-[3px] border-l-pulse bg-pulse/10"
          : "border-l-[3px] border-l-transparent hover:bg-foreground/[0.04]",
      )}
    >
      <span className="relative inline-flex size-12 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
        {dev.avatar ? (
          <Image src={dev.avatar} alt={dev.name} width={48} height={48} className="size-full object-cover" unoptimized />
        ) : (
          <span className="flex size-full items-center justify-center text-sm font-semibold text-muted-foreground">
            {dev.name.slice(0, 1)}
          </span>
        )}
        {dev.isOnline && (
          <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-card bg-emerald-400" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <span
          className={cn(
            "block truncate text-[15px] font-semibold",
            active ? "text-pulse" : "text-foreground",
          )}
        >
          {dev.name}
        </span>
        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="truncate text-pulse/90">{dev.role}</span>
          <span className="opacity-50">·</span>
          <span className="shrink-0 whitespace-nowrap">{country}</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {skills.slice(0, 3).map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-1.5 py-0.5 text-[10.5px] text-muted-foreground"
            >
              {TECH_ICONS[s] && (
                <Image src={TECH_ICONS[s]} alt="" width={11} height={11} unoptimized />
              )}
              {s}
            </span>
          ))}
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        {dev.gauntlet ? (
          <MiniRing value={dev.gauntlet.overall} />
        ) : (
          <span className="inline-flex items-center gap-1 text-[11.5px] text-muted-foreground">
            <ShieldCheck className="size-3 text-pulse" />
          </span>
        )}
        <span className="font-mono text-[13px] font-semibold">
          ${dev.hourlyRate}
          <span className="text-[10px] font-normal text-muted-foreground">/hr</span>
        </span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSave(dev.id);
        }}
        className={cn(
          "absolute right-3 top-2.5 p-0.5",
          saved ? "text-pulse" : "hidden text-muted-foreground group-hover:inline-flex",
        )}
      >
        <Bookmark className={cn("size-3.5", saved && "fill-pulse")} />
      </button>
    </div>
  );
}

// ── Console ──────────────────────────────────────────────────────────────────

export function DiscoverConsole({
  developers,
  settings,
}: {
  developers: Developer[];
  settings: MarketplaceSettings;
}) {
  const { isSaved, toggle } = useShortlist();
  const allStacks = settings.filters.techStacks.length
    ? settings.filters.techStacks
    : ["React", "TypeScript", "Node.js", "Python", "Go", "AWS", "Next.js", "PyTorch"];

  const [crit, setCrit] = useState<Criteria>(() => parsePrompt("", allStacks));
  const [sort, setSort] = useState<SortId>("vetting");
  const [selectedId, setSelectedId] = useState<string | null>(
    developers[0]?.id ?? null,
  );

  const rows = useMemo(() => {
    const filtered = developers.filter((d) => matchesCriteria(d, crit));
    const by: Record<SortId, (a: Developer, b: Developer) => number> = {
      vetting: (a, b) => (b.gauntlet?.overall ?? 0) - (a.gauntlet?.overall ?? 0),
      rate: (a, b) => a.hourlyRate - b.hourlyRate,
      years: (a, b) => b.yearsOfExperience - a.yearsOfExperience,
    };
    return [...filtered].sort(by[sort]);
  }, [developers, crit, sort]);

  useEffect(() => {
    if (!rows.length) return;
    if (selectedId == null || !rows.some((r) => r.id === selectedId)) {
      setSelectedId(rows[0].id);
    }
  }, [rows, selectedId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      e.preventDefault();
      const idx = rows.findIndex((r) => r.id === selectedId);
      if (idx === -1) return;
      const n =
        e.key === "ArrowDown"
          ? Math.min(rows.length - 1, idx + 1)
          : Math.max(0, idx - 1);
      setSelectedId(rows[n].id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [rows, selectedId]);

  const selected = rows.find((r) => r.id === selectedId) ?? rows[0] ?? null;

  return (
    <>
      <CommandBar
        crit={crit}
        onSubmit={(text) => setCrit(parsePrompt(text, allStacks))}
        onClear={() => setCrit(parsePrompt("", allStacks))}
        count={rows.length}
        total={developers.length}
      />
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[408px_1fr]">
        {/* list */}
        <div className="flex min-h-0 flex-col border-r border-border bg-card/30">
          <div className="flex shrink-0 items-center justify-between gap-2.5 border-b border-border px-4.5 py-3.5">
            <Mono className="text-[10.5px] text-muted-foreground">
              {rows.length} engineer{rows.length === 1 ? "" : "s"}
            </Mono>
            <div className="inline-flex gap-0.5 rounded-full border border-border bg-card/60 p-0.5">
              {SORTS.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setSort(o.id)}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider transition-colors",
                    sort === o.id
                      ? "bg-pulse text-pulse-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {rows.length ? (
              rows.map((d) => (
                <CandidateRow
                  key={d.id}
                  dev={d}
                  active={d.id === selectedId}
                  saved={isSaved(d.id)}
                  onSelect={setSelectedId}
                  onSave={toggle}
                />
              ))
            ) : (
              <div className="px-6 py-16 text-center text-sm text-muted-foreground">
                No engineers match this search.
              </div>
            )}
          </div>
        </div>
        {/* detail */}
        {selected ? (
          <ConsoleDetailPane
            developer={selected}
            saved={isSaved(selected.id)}
            onSave={toggle}
          />
        ) : (
          <div className="flex items-center justify-center bg-background text-sm text-muted-foreground">
            Select an engineer to preview.
          </div>
        )}
      </div>
    </>
  );
}
