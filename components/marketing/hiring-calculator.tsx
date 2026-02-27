"use client";

import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface HiringCalculatorProps {
  className?: string;
}

const ROLES = [
  "Frontend Engineer",
  "Full-Stack Engineer",
  "Backend Engineer",
  "DevOps Engineer",
] as const;

const EXPERIENCE_LEVELS = [
  { key: "junior", label: "Junior", years: "1–2 yrs" },
  { key: "mid", label: "Mid-Level", years: "3–5 yrs" },
  { key: "senior", label: "Senior", years: "6+ yrs" },
] as const;

const MARKETS = ["US", "UK", "Germany", "Australia"] as const;

type Role = (typeof ROLES)[number];
type Experience = (typeof EXPERIENCE_LEVELS)[number]["key"];
type Market = (typeof MARKETS)[number];

// Rates based on 2025 market data (Glassdoor, Arc, DistantJob, Flexiple)
// Local = typical employed monthly cost in that market
// OctogleHire = offshore pre-vetted talent via platform
const RATE_DATA: Record<
  Role,
  Record<Experience, Record<Market, { local: number; octogle: number }>>
> = {
  "Frontend Engineer": {
    junior: {
      US: { local: 6500, octogle: 2500 },
      UK: { local: 4800, octogle: 2250 },
      Germany: { local: 4500, octogle: 2125 },
      Australia: { local: 5200, octogle: 2375 },
    },
    mid: {
      US: { local: 9500, octogle: 4000 },
      UK: { local: 7500, octogle: 3500 },
      Germany: { local: 7000, octogle: 3250 },
      Australia: { local: 8000, octogle: 3750 },
    },
    senior: {
      US: { local: 12500, octogle: 5625 },
      UK: { local: 9500, octogle: 4750 },
      Germany: { local: 8500, octogle: 4375 },
      Australia: { local: 10000, octogle: 5000 },
    },
  },
  "Full-Stack Engineer": {
    junior: {
      US: { local: 6000, octogle: 2375 },
      UK: { local: 4500, octogle: 2125 },
      Germany: { local: 4200, octogle: 2000 },
      Australia: { local: 5000, octogle: 2250 },
    },
    mid: {
      US: { local: 9000, octogle: 3750 },
      UK: { local: 7000, octogle: 3250 },
      Germany: { local: 6500, octogle: 3000 },
      Australia: { local: 7500, octogle: 3500 },
    },
    senior: {
      US: { local: 12000, octogle: 5250 },
      UK: { local: 9000, octogle: 4375 },
      Germany: { local: 8000, octogle: 4000 },
      Australia: { local: 9500, octogle: 4750 },
    },
  },
  "Backend Engineer": {
    junior: {
      US: { local: 6200, octogle: 2250 },
      UK: { local: 4600, octogle: 2000 },
      Germany: { local: 4300, octogle: 1875 },
      Australia: { local: 5000, octogle: 2125 },
    },
    mid: {
      US: { local: 9200, octogle: 3750 },
      UK: { local: 7200, octogle: 3250 },
      Germany: { local: 6800, octogle: 3000 },
      Australia: { local: 7800, octogle: 3500 },
    },
    senior: {
      US: { local: 12500, octogle: 5375 },
      UK: { local: 9200, octogle: 4500 },
      Germany: { local: 8500, octogle: 4125 },
      Australia: { local: 10000, octogle: 4875 },
    },
  },
  "DevOps Engineer": {
    junior: {
      US: { local: 6800, octogle: 2625 },
      UK: { local: 5000, octogle: 2375 },
      Germany: { local: 4800, octogle: 2250 },
      Australia: { local: 5500, octogle: 2500 },
    },
    mid: {
      US: { local: 10000, octogle: 4250 },
      UK: { local: 8000, octogle: 3750 },
      Germany: { local: 7500, octogle: 3500 },
      Australia: { local: 8500, octogle: 4000 },
    },
    senior: {
      US: { local: 13500, octogle: 6000 },
      UK: { local: 10000, octogle: 5000 },
      Germany: { local: 9500, octogle: 4625 },
      Australia: { local: 11000, octogle: 5375 },
    },
  },
};

const MARKET_FLAGS: Record<Market, string> = {
  US: "us",
  UK: "gb",
  Germany: "de",
  Australia: "au",
};

const MARKET_CURRENCY: Record<Market, string> = {
  US: "$",
  UK: "£",
  Germany: "€",
  Australia: "A$",
};

const HiringCalculator = ({ className }: HiringCalculatorProps) => {
  const [role, setRole] = useState<Role>("Frontend Engineer");
  const [experience, setExperience] = useState<Experience>("mid");
  const [market, setMarket] = useState<Market>("US");
  const [teamSize, setTeamSize] = useState([3]);

  const rates = RATE_DATA[role][experience][market];
  const savingsPercent = Math.round(
    ((rates.local - rates.octogle) / rates.local) * 100,
  );
  const monthlySavings = rates.local - rates.octogle;

  const annualSavings = useMemo(
    () => teamSize[0] * monthlySavings * 12,
    [teamSize, monthlySavings],
  );

  const currency = MARKET_CURRENCY[market];
  const fmt = (n: number) => `${currency}${n.toLocaleString()}`;

  return (
    <section className={cn("py-24 container mx-auto px-6", className)}>
      {/* Header */}
      <div className="mb-10 flex flex-col gap-4">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Calculator
        </span>
        <h2 className="max-w-2xl text-4xl font-medium tracking-tight lg:text-5xl">
          Quantify your savings
        </h2>
      </div>

      <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-muted/30 p-8 md:p-10">
        <div className="space-y-8">
          {/* Role selector */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Role</label>
            <div className="flex flex-wrap gap-2">
              {ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    r === role
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background text-muted-foreground hover:text-foreground",
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Experience</label>
            <div className="flex flex-wrap gap-2">
              {EXPERIENCE_LEVELS.map((lvl) => (
                <button
                  key={lvl.key}
                  onClick={() => setExperience(lvl.key)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                    lvl.key === experience
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background text-muted-foreground hover:text-foreground",
                  )}
                >
                  {lvl.label} ({lvl.years})
                </button>
              ))}
            </div>
          </div>

          {/* Market */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Compare against</label>
            <div className="flex flex-wrap gap-2">
              {MARKETS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMarket(m)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                    m === market
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background text-muted-foreground hover:text-foreground",
                  )}
                >
                  <img
                    src={`https://flagcdn.com/w20/${MARKET_FLAGS[m]}.png`}
                    alt=""
                    className="h-3.5 w-auto rounded-sm"
                    width={20}
                    height={14}
                  />
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Rate comparison */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-border bg-background p-4 sm:p-5 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Typical {market} rate
              </p>
              <p className="mt-2 font-mono text-xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
                {fmt(rates.local)}
                <span className="text-xs sm:text-base text-muted-foreground">/mo</span>
              </p>
            </div>
            <div className="rounded-2xl border border-pulse bg-background p-4 sm:p-5 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                OctogleHire rate
              </p>
              <p className="mt-2 font-mono text-xl font-semibold tracking-tight text-pulse sm:text-3xl lg:text-4xl">
                {fmt(rates.octogle)}
                <span className="text-xs sm:text-base text-muted-foreground">/mo</span>
              </p>
            </div>
          </div>

          <p className="text-center text-lg font-semibold">
            You save {savingsPercent}%{" "}
            <span className="text-muted-foreground font-normal">
              ({fmt(monthlySavings)}/mo per developer)
            </span>
          </p>

          {/* Team size slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">How many developers?</label>
              <span className="font-mono text-sm font-semibold">{teamSize[0]}</span>
            </div>
            <Slider
              value={teamSize}
              onValueChange={setTeamSize}
              min={1}
              max={20}
              step={1}
              className="w-full"
            />
          </div>

          {/* Annual savings result */}
          <div className="rounded-2xl border border-border bg-background p-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Annual savings with {teamSize[0]} developer{teamSize[0] > 1 ? "s" : ""}
            </p>
            <p className="font-mono text-2xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              {fmt(annualSavings)}
            </p>
            <Button asChild className="w-full rounded-full gap-2" size="lg">
              <a href="/companies/signup">
                Start Saving Now
                <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export { HiringCalculator };
