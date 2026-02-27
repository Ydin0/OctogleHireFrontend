"use client";

import { ArrowRight, Check, X as XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

interface ComparisonTableProps {
  className?: string;
}

// ── Competitor data ──────────────────────────────────────────────────────────
const competitors = [
  {
    name: "Upwork",
    logo: "https://www.google.com/s2/favicons?domain=upwork.com&sz=64",
    tagline: "Open marketplace",
    traits: [
      { label: "Vetting", value: "None — self-reported", pass: false },
      { label: "Talent Quality", value: "Inconsistent", pass: false },
      { label: "Time to Hire", value: "Weeks of filtering", pass: false },
      { label: "Pricing", value: "Low, variable quality", pass: false },
      { label: "Compliance", value: "You manage it", pass: false },
      { label: "Support", value: "Community forums", pass: false },
    ],
    verdict: "Huge pool, but you're on your own sorting through thousands of unvetted profiles.",
  },
  {
    name: "Freelancer",
    logo: "https://www.google.com/s2/favicons?domain=freelancer.com&sz=64",
    tagline: "Bidding platform",
    traits: [
      { label: "Vetting", value: "None — bid-based", pass: false },
      { label: "Talent Quality", value: "Race to the bottom", pass: false },
      { label: "Time to Hire", value: "Days of reviewing bids", pass: false },
      { label: "Pricing", value: "Cheapest wins", pass: false },
      { label: "Compliance", value: "You manage it", pass: false },
      { label: "Support", value: "Ticket system", pass: false },
    ],
    verdict: "Lowest price wins — but low cost often means low quality and constant churn.",
  },
  {
    name: "Toptal",
    logo: "https://www.google.com/s2/favicons?domain=toptal.com&sz=64",
    tagline: "Elite network",
    traits: [
      { label: "Vetting", value: "Rigorous screening", pass: true },
      { label: "Talent Quality", value: "Top 3%", pass: true },
      { label: "Time to Hire", value: "1–3 weeks", pass: false },
      { label: "Pricing", value: "Premium — $150+/hr", pass: false },
      { label: "Compliance", value: "Managed for you", pass: true },
      { label: "Support", value: "Account manager", pass: true },
    ],
    verdict: "Great quality, but slow placements and pricing that excludes most growing teams.",
  },
];

const octogle = {
  tagline: "Best of both worlds",
  traits: [
    { label: "Vetting", value: "5-stage technical vetting" },
    { label: "Talent Quality", value: "Top 5% — verified" },
    { label: "Time to Hire", value: "48 hours average" },
    { label: "Pricing", value: "Competitive & transparent" },
    { label: "Compliance", value: "Fully managed globally" },
    { label: "Support", value: "24/7 account manager" },
  ],
};

const ComparisonTable = ({ className }: ComparisonTableProps) => {
  return (
    <section id="compare" className={cn("py-24", className)}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Compare
          </span>
          <h2 className="mt-4 text-4xl font-medium tracking-tight lg:text-5xl">
            Why teams switch to OctogleHire
          </h2>
          <p className="mt-4 text-muted-foreground">
            The quality of elite networks. The speed and pricing that actually
            works for growing teams.
          </p>
        </div>

        {/* Cards grid — OctogleHire in the center */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {/* Competitor cards (left) */}
          {competitors.slice(0, 2).map((c) => (
            <CompetitorCard key={c.name} competitor={c} />
          ))}

          {/* OctogleHire card — center, highlighted */}
          <div className="relative rounded-3xl border-2 border-pulse bg-background p-6 flex flex-col md:col-span-2 xl:col-span-1 xl:order-none order-first md:order-none">
            {/* Recommended badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-pulse px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-pulse-foreground">
                Recommended
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Logo width={110} height={26} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{octogle.tagline}</p>

            <div className="mt-6 flex-1 space-y-4">
              {octogle.traits.map((trait) => (
                <div key={trait.label} className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-pulse">
                    <Check className="size-2.5 text-pulse-foreground" strokeWidth={3} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {trait.label}
                    </p>
                    <p className="text-sm font-medium">{trait.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <Button asChild className="w-full rounded-full gap-2">
                <a href="/companies/signup">
                  Start Hiring Free
                  <ArrowRight className="size-4" />
                </a>
              </Button>
              <p className="text-center text-[10px] text-muted-foreground">
                No credit card. First candidates in 48h.
              </p>
            </div>
          </div>

          {/* Competitor card (right) */}
          <CompetitorCard competitor={competitors[2]} />
        </div>
      </div>
    </section>
  );
};

// ── Competitor card ─────────────────────────────────────────────────────────
function CompetitorCard({
  competitor,
}: {
  competitor: (typeof competitors)[0];
}) {
  return (
    <div className="rounded-3xl border border-border bg-muted/30 p-6 flex flex-col">
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={competitor.logo}
          alt={competitor.name}
          className="size-8 rounded-lg object-contain"
        />
        <div>
          <p className="text-sm font-semibold">{competitor.name}</p>
          <p className="text-xs text-muted-foreground">{competitor.tagline}</p>
        </div>
      </div>

      <div className="mt-6 flex-1 space-y-4">
        {competitor.traits.map((trait) => (
          <div key={trait.label} className="flex items-start gap-3">
            <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-muted">
              {trait.pass ? (
                <Check className="size-2.5 text-muted-foreground" strokeWidth={3} />
              ) : (
                <XIcon className="size-2.5 text-muted-foreground/50" strokeWidth={3} />
              )}
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {trait.label}
              </p>
              <p
                className={cn(
                  "text-sm",
                  trait.pass
                    ? "text-muted-foreground"
                    : "text-muted-foreground/70",
                )}
              >
                {trait.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-xs leading-relaxed text-muted-foreground border-t border-border pt-4">
        {competitor.verdict}
      </p>
    </div>
  );
}

export { ComparisonTable };
