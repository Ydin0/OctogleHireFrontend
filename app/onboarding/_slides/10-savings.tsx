"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Quote } from "lucide-react";

import { cn } from "@/lib/utils";
import { SlideShell } from "../_components/slide-shell";

const STORIES = [
  {
    name: "Ricardo Machado",
    role: "CEO",
    company: "Beekey",
    avatar: "/Ricardo-Recruitment.jpg",
    quote:
      "We were about to commit to three senior frontend engineers at London rates. OctogleHire matched us with equally talented engineers in under a week.",
    hiredRole: "Senior Frontend Engineer",
    hiredCount: 3,
    localRate: 9500,
    octogleRate: 3800,
    market: "UK",
    flag: "gb",
    currency: "£",
  },
  {
    name: "Eduardo Middleton",
    role: "Founder",
    company: "1VA",
    avatar: "/Eduardo.png",
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
    name: "Antonio Coman",
    role: "Founder",
    company: "Artistatours",
    avatar: "/review-4.jpg",
    quote:
      "Hiring two developers locally in Spain was going to cost us over €14,000 a month. OctogleHire matched us for just €5,800 — cutting our costs by more than half.",
    hiredRole: "Full-Stack Developer",
    hiredCount: 2,
    localRate: 7000,
    octogleRate: 2900,
    market: "Spain",
    flag: "es",
    currency: "€",
  },
  {
    name: "Connor Berwick",
    role: "Co-Founder",
    company: "Hireflow",
    avatar: "/review-3.jpg",
    quote:
      "Hiring three engineers locally in the UK was going to cost us £15,000 a month. OctogleHire placed all three at £2,000 each — saving us over £108k a year without compromising on quality.",
    hiredRole: "Full-Stack Engineer",
    hiredCount: 3,
    localRate: 5000,
    octogleRate: 2000,
    market: "UK",
    flag: "gb",
    currency: "£",
  },
];

const AUTO_MS = 9000;

export const SavingsSlide = () => {
  const [index, setIndex] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(
      () => setIndex((i) => (i + 1) % STORIES.length),
      AUTO_MS,
    );
    return () => clearTimeout(t);
  }, [index]);

  useEffect(() => {
    const el = progressRef.current;
    if (!el) return;
    el.style.animation = "none";
    void el.offsetHeight;
    el.style.animation = `progress-fill ${AUTO_MS}ms linear forwards`;
  }, [index]);

  const s = STORIES[index];
  const savingsPercent = Math.round(
    ((s.localRate - s.octogleRate) / s.localRate) * 100,
  );
  const annualSavings = (s.localRate - s.octogleRate) * s.hiredCount * 12;

  return (
    <SlideShell eyebrow="Real savings">
      <div className="overflow-hidden rounded-3xl border border-border bg-card">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          {/* Left: portrait */}
          <div className="relative min-h-[360px] md:min-h-[440px] lg:min-h-[560px] overflow-hidden bg-muted">
            {STORIES.map((story, i) => (
              <div
                key={story.name}
                className={cn(
                  "absolute inset-0 transition-all duration-700 ease-out",
                  i === index
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-[1.03]",
                )}
              >
                <Image
                  src={story.avatar}
                  alt={story.name}
                  fill
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="object-cover"
                  priority={i === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              </div>
            ))}

            <div className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-full border border-white/25 bg-black/45 px-3 py-1.5 backdrop-blur-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://flagcdn.com/w40/${s.flag}.png`}
                alt=""
                className="h-3.5 w-auto rounded-[2px]"
              />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-white">
                {s.market}
              </span>
            </div>

            <div className="absolute inset-x-5 bottom-5 z-10 flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-white/70">
                  Hired via OctogleHire
                </p>
                <p className="text-base font-semibold text-white leading-tight md:text-lg">
                  {s.hiredCount}× {s.hiredRole}
                </p>
              </div>
              <div className="inline-flex shrink-0 items-center rounded-full bg-pulse px-3 py-1 shadow-[0_0_24px_oklch(from_var(--pulse)_l_c_h_/_0.4)]">
                <span className="font-mono text-sm font-semibold text-background">
                  −{savingsPercent}%
                </span>
              </div>
            </div>

            {/* Progress */}
            <div className="absolute bottom-0 left-0 right-0 z-10 h-[3px] bg-white/10">
              <div
                ref={progressRef}
                className="h-full origin-left bg-white/90"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
          </div>

          {/* Right: quote + savings */}
          <div className="flex flex-col justify-between gap-8 p-8 md:p-10 lg:p-12">
            <div className="space-y-6">
              <Quote className="size-8 text-pulse/50" strokeWidth={1.25} />
              <div className="relative">
                {STORIES.map((story, i) => (
                  <blockquote
                    key={story.name}
                    className={cn(
                      "text-2xl font-medium leading-[1.3] tracking-tight md:text-3xl transition-all duration-500",
                      i === index
                        ? "opacity-100 translate-y-0"
                        : "pointer-events-none absolute inset-0 opacity-0 translate-y-2",
                    )}
                  >
                    &ldquo;{story.quote}&rdquo;
                  </blockquote>
                ))}
              </div>
              <div className="border-t border-border pt-5">
                <p className="text-base font-semibold">{s.name}</p>
                <p className="text-sm text-muted-foreground">
                  {s.role}, {s.company}
                </p>
              </div>
            </div>

            {/* Receipt */}
            <div className="grid grid-cols-3 gap-3 rounded-2xl border border-border bg-muted/40 p-5">
              <div className="space-y-1 border-r border-border pr-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {s.market} Rate
                </p>
                <p className="font-mono text-lg font-semibold tracking-tight line-through decoration-muted-foreground/50 md:text-xl">
                  {s.currency}
                  {s.localRate.toLocaleString()}
                  <span className="text-xs text-muted-foreground no-underline">
                    /mo
                  </span>
                </p>
              </div>
              <div className="space-y-1 border-r border-border pr-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  OctogleHire
                </p>
                <p className="font-mono text-lg font-semibold tracking-tight text-pulse md:text-xl">
                  {s.currency}
                  {s.octogleRate.toLocaleString()}
                  <span className="text-xs text-muted-foreground">/mo</span>
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Saved / yr
                </p>
                <p className="font-mono text-lg font-semibold tracking-tight md:text-xl">
                  {s.currency}
                  {annualSavings.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dots selector */}
      <div className="mt-5 flex items-center justify-center gap-2">
        {STORIES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Story ${i + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === index ? "w-8 bg-pulse" : "w-1.5 bg-border hover:bg-foreground/40",
            )}
          />
        ))}
      </div>
    </SlideShell>
  );
};
