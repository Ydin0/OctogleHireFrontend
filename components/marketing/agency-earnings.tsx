"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface AgencyEarningsProps {
  className?: string;
}

const stories = [
  {
    name: "Tech Staffing Co.",
    initials: "TS",
    quote:
      "OctogleHire's agency marketplace completely changed how we operate. We went from cold-calling to filling roles through a branded pipeline — and the commission tracking is seamless.",
    placements: 5,
    earned: 12000,
    rate: "10%",
  },
  {
    name: "GlobalRecruiters",
    initials: "GR",
    quote:
      "The platform gives us access to requirements we'd never find on our own. We've placed 12 engineers in three months and earned more than we did in the previous quarter combined.",
    placements: 12,
    earned: 34000,
    rate: "10%",
  },
  {
    name: "TalentBridge",
    initials: "TB",
    quote:
      "What sold us was the transparency. We can see exactly where every candidate is in the pipeline and exactly what we'll earn. No more chasing invoices or guessing on commissions.",
    placements: 8,
    earned: 22000,
    rate: "10%",
  },
];

const AgencyEarnings = ({ className }: AgencyEarningsProps) => {
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

  return (
    <section className={cn("py-24 container mx-auto px-6", className)}>
      {/* Header */}
      <div className="mb-12 flex flex-col gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Agency Success Stories
        </span>
        <h2 className="text-4xl font-medium tracking-tight lg:text-5xl">
          Real agencies. Real earnings.
        </h2>
        <p className="text-muted-foreground">
          See what recruitment agencies are earning on the OctogleHire
          marketplace.
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
            {/* Top: Agency identity */}
            <div className="p-6 md:p-8 pb-0 md:pb-0 flex items-center gap-3">
              <Avatar className="size-12 ring-2 ring-border shrink-0">
                <AvatarFallback className="font-mono text-sm">
                  {s.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{s.name}</p>
                <p className="text-xs text-muted-foreground">
                  Recruitment Agency
                </p>
              </div>
            </div>

            {/* Quote */}
            <div className="px-6 md:px-8 py-6">
              <blockquote className="text-xl font-medium leading-relaxed lg:text-2xl">
                &ldquo;{s.quote}&rdquo;
              </blockquote>
            </div>

            {/* Earnings strip */}
            <div className="border-t border-border bg-muted/30 px-6 md:px-8 py-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Placements
                    </p>
                    <p className="mt-1 font-mono text-xl font-semibold tracking-tight">
                      {s.placements}
                    </p>
                  </div>
                  <div>
                    <ArrowRight className="size-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Total Earned
                    </p>
                    <p className="mt-1 font-mono text-xl font-semibold tracking-tight text-pulse">
                      ${s.earned.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center rounded-full bg-foreground px-3 py-1">
                  <span className="text-sm font-mono font-semibold text-background">
                    {s.rate} commission
                  </span>
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
    </section>
  );
};

export { AgencyEarnings };
