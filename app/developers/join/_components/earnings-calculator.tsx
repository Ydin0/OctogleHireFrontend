"use client";

import { useState } from "react";
import { ArrowRight, Banknote, FileText, Scale, Shield } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Experience = "junior" | "mid" | "senior";

const EXPERIENCE_LEVELS: Array<{
  key: Experience;
  label: string;
  years: string;
  range: string;
}> = [
  { key: "junior", label: "Junior", years: "1–2 yrs", range: "10–15%" },
  { key: "mid", label: "Mid-Level", years: "3–5 yrs", range: "15–25%" },
  { key: "senior", label: "Senior", years: "6+ yrs", range: "20–30%" },
];

const VALUE_PROPS = [
  {
    icon: Banknote,
    title: "Paid in your local currency",
    description: "No conversion headaches — we pay you directly in your local currency.",
  },
  {
    icon: FileText,
    title: "Invoicing handled for you",
    description: "We manage all invoicing with the client. You just do the work.",
  },
  {
    icon: Scale,
    title: "Fully compliant with local laws",
    description: "Contracts are structured to comply with your country's employment and tax regulations.",
  },
  {
    icon: Shield,
    title: "Experience letters & full-time roles available",
    description: "Receive formal experience letters. Long-term and full-time arrangements are available.",
  },
];

const EarningsCalculator = () => {
  const [experience, setExperience] = useState<Experience>("mid");

  const selected = EXPERIENCE_LEVELS.find((lvl) => lvl.key === experience)!;

  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-muted/30 p-8 md:p-10">
      <div className="space-y-8">
        {/* Experience selector */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Your experience level</label>
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

        {/* Uplift result */}
        <div className="rounded-2xl border border-pulse bg-background p-6 space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Estimated earnings uplift
          </p>
          <p className="font-mono text-4xl font-semibold tracking-tight text-pulse lg:text-5xl">
            +{selected.range}
          </p>
          <p className="text-sm text-muted-foreground">
            above your local market rate, working with US, UK &amp; European companies
          </p>
        </div>

        {/* Value props */}
        <div className="grid gap-4 sm:grid-cols-2">
          {VALUE_PROPS.map((prop) => (
            <div key={prop.title} className="flex gap-3 items-start">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
                <prop.icon className="size-4 text-foreground" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-semibold">{prop.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{prop.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Engagement models */}
        <div className="rounded-2xl border border-border bg-background p-6 space-y-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Flexible engagement models
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Hourly", description: "Project-based flexibility" },
              { label: "Monthly", description: "Ongoing retainer contracts" },
              { label: "Annual", description: "Stable, full-time roles" },
            ].map((model) => (
              <div key={model.label} className="text-center rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-mono text-lg font-semibold">{model.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{model.description}</p>
              </div>
            ))}
          </div>
          <Button asChild className="w-full rounded-full gap-2" size="lg">
            <a href="/apply">
              Apply Now
              <ArrowRight className="size-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export { EarningsCalculator };
