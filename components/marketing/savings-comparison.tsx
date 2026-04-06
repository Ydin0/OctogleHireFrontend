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
    name: "Ricardo Machado",
    role: "CEO",
    company: "Beekey",
    logo: "/company-logos/Solidus.svg",
    avatar: "/Ricardo-Recruitment.jpg",
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
    name: "Antonio Coman",
    role: "Founder",
    company: "Artistatours",
    logo: "/company-logos/ArtistaTours.svg",
    avatar: "/review-4.jpg",
    quote:
      "Hiring two developers locally in Spain was going to cost us over \u20AC14,000 a month. OctogleHire matched us with two equally talented engineers for just \u20AC5,800 — cutting our costs by more than half.",
    hiredRole: "Full-Stack Developer",
    hiredCount: 2,
    localRate: 7000,
    octogleRate: 2900,
    market: "Spain",
    flag: "es",
    currency: "\u20AC",
  },
  {
    name: "Eduardo Middleton",
    role: "Founder",
    company: "1VA",
    logo: "/company-logos/1VA.svg",
    avatar:
      "https://media.licdn.com/dms/image/v2/D4D03AQF1HZ_soFlz_A/profile-displayphoto-crop_800_800/B4DZqnZwyBGsAI-/0/1763745140907?e=1775692800&v=beta&t=ymhZJ57Gb1efoAix0Q_0WLZnfA4hw9_CbTjKP7JMXJE",
    quote:
      "Our initial budget for a developer in the UK was £75,000. OctogleHire placed an equally skilled engineer for just £38,000 — saving us nearly half without compromising on quality.",
    hiredRole: "Full-Stack Engineer",
    hiredCount: 1,
    localRate: 6250,
    octogleRate: 3167,
    market: "UK",
    flag: "gb",
    currency: "£",
  },
  {
    name: "Connor Berwick",
    role: "Co-Founder",
    company: "Hireflow",
    logo: "/company-logos/Hireflow.svg",
    avatar: "/review-3.jpg",
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
                className="h-10 w-auto opacity-40 invert dark:invert-0 hidden sm:block"
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
