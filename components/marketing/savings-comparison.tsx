"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface SavingsComparisonProps {
  className?: string;
}

const stories = [
  {
    name: "Sarah Chen",
    role: "CTO",
    company: "Nextera Technologies",
    logo: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-1.svg",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face",
    quote:
      "We were about to commit to three senior frontend engineers at London rates. OctogleHire matched us with equally talented engineers in under a week — and we're saving over $200k a year.",
    hiredRole: "Senior Frontend Engineer",
    hiredCount: 3,
    localRate: 9500,
    octogleRate: 3800,
    market: "UK",
    flag: "gb",
    currency: "£",
  },
  {
    name: "Marcus Rivera",
    role: "VP of Engineering",
    company: "Cloudshift",
    logo: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-2.svg",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    quote:
      "Scaling our backend team in New York would have cost us a fortune. With OctogleHire we went from 5 to 12 engineers in three months at a fraction of what we budgeted.",
    hiredRole: "Backend Engineer",
    hiredCount: 7,
    localRate: 12500,
    octogleRate: 4300,
    market: "US",
    flag: "us",
    currency: "$",
  },
  {
    name: "Priya Sharma",
    role: "Head of People",
    company: "Finova",
    logo: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-3.svg",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
    quote:
      "We quoted a DevOps engineer locally in Sydney at $11k/month. OctogleHire found us someone better for less than half that — and handled all the compliance.",
    hiredRole: "DevOps Engineer",
    hiredCount: 2,
    localRate: 11000,
    octogleRate: 4300,
    market: "AU",
    flag: "au",
    currency: "A$",
  },
  {
    name: "James Okafor",
    role: "CTO",
    company: "DataPulse Analytics",
    logo: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-4.svg",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    quote:
      "Hiring full-stack engineers in Berlin was eating our runway. OctogleHire cut our engineering spend by 60% without any drop in quality. The vetting process is genuinely world-class.",
    hiredRole: "Full-Stack Engineer",
    hiredCount: 4,
    localRate: 8000,
    octogleRate: 3200,
    market: "DE",
    flag: "de",
    currency: "€",
  },
];

const SavingsComparison = ({ className }: SavingsComparisonProps) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [animKey, setAnimKey] = useState(0);

  const go = (dir: "left" | "right") => {
    setDirection(dir);
    setAnimKey((k) => k + 1);
    setIndex((i) =>
      dir === "right"
        ? (i + 1) % stories.length
        : (i - 1 + stories.length) % stories.length,
    );
  };

  const s = stories[index];
  const savingsPercent = Math.round(
    ((s.localRate - s.octogleRate) / s.localRate) * 100,
  );
  const annualSavings = (s.localRate - s.octogleRate) * s.hiredCount * 12;

  return (
    <section className={cn("py-24 container mx-auto px-6", className)}>
      {/* Header */}
      <div className="mb-12 flex flex-col gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Customer Stories
        </span>
        <h2 className="text-4xl font-medium tracking-tight lg:text-5xl">
          Real savings. Real teams.
        </h2>
        <p className="text-muted-foreground">
          See what companies were quoted locally — and what they actually paid.
        </p>
      </div>

      {/* Carousel */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Left arrow */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => go("left")}
          className="rounded-full size-11 shrink-0"
          aria-label="Previous story"
        >
          <ArrowLeft className="size-4" />
        </Button>

        {/* Card */}
        <div className="flex-1 overflow-hidden rounded-2xl border border-border bg-card">
          <div
            key={animKey}
            className={cn(
              "animate-in duration-300",
              direction === "right"
                ? "fade-in slide-in-from-right-4"
                : "fade-in slide-in-from-left-4",
            )}
          >
            {/* Top: Author + company */}
            <div className="p-6 md:p-8 pb-0 md:pb-0 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="size-12 ring-2 ring-border shrink-0">
                  <AvatarImage src={s.avatar} alt={s.name} />
                  <AvatarFallback>{s.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{s.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.role}, {s.company}
                  </p>
                </div>
              </div>
              <img
                src={s.logo}
                alt={s.company}
                className="h-6 w-auto opacity-40 hidden sm:block"
              />
            </div>

            {/* Quote */}
            <div className="px-6 md:px-8 py-6">
              <blockquote className="text-xl font-medium leading-relaxed lg:text-2xl">
                &ldquo;{s.quote}&rdquo;
              </blockquote>
            </div>

            {/* Savings strip */}
            <div className="border-t border-border bg-muted/30 px-6 md:px-8 py-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Rate comparison */}
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      <img
                        src={`https://flagcdn.com/w20/${s.flag}.png`}
                        alt=""
                        className="inline h-3 w-auto rounded-sm mr-1.5"
                        width={20}
                        height={14}
                      />
                      {s.market} rate
                    </p>
                    <p className="mt-1 font-mono text-xl font-semibold tracking-tight line-through decoration-muted-foreground/40">
                      {s.currency}{s.localRate.toLocaleString()}
                      <span className="text-xs text-muted-foreground no-underline">/mo</span>
                    </p>
                  </div>
                  <div>
                    <ArrowRight className="size-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      OctogleHire
                    </p>
                    <p className="mt-1 font-mono text-xl font-semibold tracking-tight text-pulse">
                      {s.currency}{s.octogleRate.toLocaleString()}
                      <span className="text-xs text-muted-foreground">/mo</span>
                    </p>
                  </div>
                </div>

                {/* Savings summary */}
                <div className="flex items-center gap-4">
                  <div className="text-right sm:text-left">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {s.hiredCount} engineers hired
                    </p>
                    <p className="mt-1 font-mono text-xl font-semibold tracking-tight">
                      {s.currency}{annualSavings.toLocaleString()}
                      <span className="text-xs text-muted-foreground">/yr saved</span>
                    </p>
                  </div>
                  <div className="inline-flex items-center rounded-full bg-foreground px-3 py-1">
                    <span className="text-sm font-semibold text-background">
                      -{savingsPercent}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right arrow */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => go("right")}
          className="rounded-full size-11 shrink-0"
          aria-label="Next story"
        >
          <ArrowRight className="size-4" />
        </Button>
      </div>

      {/* Dot indicators */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {stories.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > index ? "right" : "left");
              setAnimKey((k) => k + 1);
              setIndex(i);
            }}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === index ? "bg-foreground w-6" : "bg-border w-1.5",
            )}
          />
        ))}
      </div>

      <p className="mt-6 text-center text-[10px] text-muted-foreground">
        Based on 2024–2025 hiring data across 300+ placements
      </p>
    </section>
  );
};

export { SavingsComparison };
