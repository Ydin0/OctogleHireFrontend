"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Quote } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Review } from "@/lib/api/reviews";

interface SavingsComparisonProps {
  className?: string;
  /** Approved reviews from /reviews submissions. When present, these replace the seed. */
  reviews?: Review[];
}

interface Story {
  name: string;
  role: string;
  company: string;
  logo: string | null;
  logoSize: string;
  avatar: string;
  avatarPosition: string;
  quote: string;
  hiredRole: string;
  hiredCount: number;
  localRate: number;
  octogleRate: number;
  market: string;
  flag: string;
  currency: string;
}

const SEED_STORIES: Story[] = [
  {
    name: "Ricardo Machado",
    role: "CEO",
    company: "Beekey",
    logo: "/company-logos/Solidus.svg",
    logoSize: "h-6",
    avatar: "/Ricardo-Recruitment.jpg",
    avatarPosition: "object-[50%_15%]",
    quote:
      "We were about to commit to three senior frontend engineers at London rates. OctogleHire matched us with equally talented engineers in under a week — and we're saving over £200k a year.",
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
    logoSize: "h-5",
    avatar: "/review-4.jpg",
    avatarPosition: "object-[50%_25%]",
    quote:
      "Hiring two developers locally in Spain was going to cost us over €14,000 a month. OctogleHire matched us with two equally talented engineers for just €5,800 — cutting our costs by more than half.",
    hiredRole: "Full-Stack Developer",
    hiredCount: 2,
    localRate: 7000,
    octogleRate: 2900,
    market: "Spain",
    flag: "es",
    currency: "€",
  },
  {
    name: "Eduardo Middleton",
    role: "Founder",
    company: "1VA",
    logo: "/company-logos/1VA.svg",
    logoSize: "h-5",
    avatar: "/Eduardo.png",
    avatarPosition: "object-[50%_25%]",
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
    logoSize: "h-5",
    avatar: "/review-3.jpg",
    avatarPosition: "object-[50%_25%]",
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

const AUTO_ADVANCE_MS = 9000;

const reviewToStory = (r: Review): Story => ({
  name: r.name,
  role: r.role,
  company: r.company,
  logo: r.logoUrl,
  logoSize: "h-5",
  avatar: r.avatarUrl ?? "",
  avatarPosition: "object-[50%_20%]",
  quote: r.quote,
  hiredRole: r.hiredRole,
  hiredCount: r.hiredCount,
  localRate: r.localRate,
  octogleRate: r.octogleRate,
  market: r.market,
  flag: r.flag,
  currency: r.currency,
});

const SavingsComparison = ({
  className,
  reviews,
}: SavingsComparisonProps) => {
  const stories = useMemo<Story[]>(() => {
    const fromReviews = (reviews ?? [])
      .filter((r) => !!r.avatarUrl)
      .map(reviewToStory);
    return fromReviews.length > 0 ? fromReviews : SEED_STORIES;
  }, [reviews]);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  // Clamp index when the stories source changes (e.g. reviews load after mount)
  useEffect(() => {
    if (index >= stories.length) setIndex(0);
  }, [stories.length, index]);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(
      () => setIndex((i) => (i + 1) % stories.length),
      AUTO_ADVANCE_MS,
    );
    return () => clearTimeout(t);
  }, [index, paused, stories.length]);

  useEffect(() => {
    const el = progressRef.current;
    if (!el) return;
    el.style.animation = "none";
    void el.offsetHeight;
    el.style.animation = `progress-fill ${AUTO_ADVANCE_MS}ms linear forwards`;
  }, [index]);

  const s = stories[index];
  const savingsPercent = Math.round(
    ((s.localRate - s.octogleRate) / s.localRate) * 100,
  );
  const annualSavings = (s.localRate - s.octogleRate) * s.hiredCount * 12;

  return (
    <section
      className={cn("py-20 container mx-auto px-6", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Preload photos */}
      <div className="hidden">
        {stories.map((story) => (
          <Image
            key={story.name}
            src={story.avatar}
            alt=""
            width={600}
            height={600}
            priority
          />
        ))}
      </div>

      {/* Header */}
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Customer Stories
        </span>
        <h2 className="max-w-2xl text-3xl font-medium tracking-tight lg:text-4xl">
          Real teams.{" "}
          <span className="text-muted-foreground">Real savings.</span>
        </h2>
        <p className="max-w-xl text-sm text-muted-foreground">
          What companies were quoted locally — and what they actually paid with
          OctogleHire.
        </p>
      </div>

      {/* Editorial card */}
      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          {/* Left: portrait */}
          <div className="relative min-h-[280px] md:min-h-[340px] lg:min-h-[380px] overflow-hidden bg-muted">
            {stories.map((story, i) => (
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
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className={cn("object-cover", story.avatarPosition)}
                  priority={i === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
              </div>
            ))}

            {/* Top-left flag chip */}
            <div className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/45 px-2.5 py-1 backdrop-blur-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://flagcdn.com/w40/${s.flag}.png`}
                alt=""
                className="h-3 w-auto rounded-[2px]"
              />
              <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-white">
                {s.market}
              </span>
            </div>

            {/* Bottom overlay */}
            <div className="absolute inset-x-4 bottom-4 z-10 flex items-end justify-between gap-3">
              <div className="space-y-0.5">
                <p className="font-mono text-[9px] font-semibold uppercase tracking-wider text-white/70">
                  Hired via OctogleHire
                </p>
                <p className="text-sm font-semibold text-white leading-tight">
                  {s.hiredCount}× {s.hiredRole}
                </p>
              </div>
              <div className="inline-flex shrink-0 items-center rounded-full bg-pulse px-2.5 py-0.5 shadow-[0_0_20px_oklch(from_var(--pulse)_l_c_h_/_0.4)]">
                <span className="font-mono text-xs font-semibold text-background">
                  −{savingsPercent}%
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 z-10 h-[2px] bg-white/10">
              <div
                ref={progressRef}
                className="h-full origin-left bg-white/90"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
          </div>

          {/* Right: quote + receipt */}
          <div className="flex flex-col justify-between gap-5 p-6 md:p-8">
            <div className="space-y-4">
              <Quote className="size-6 text-pulse/50" strokeWidth={1.25} />

              <div className="relative">
                {stories.map((story, i) => (
                  <blockquote
                    key={story.name}
                    className={cn(
                      "text-base font-medium leading-[1.45] tracking-tight md:text-lg lg:text-xl transition-all duration-500",
                      i === index
                        ? "opacity-100 translate-y-0"
                        : "pointer-events-none absolute inset-0 opacity-0 translate-y-2",
                    )}
                  >
                    {story.quote}
                  </blockquote>
                ))}
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
                <div>
                  <p className="text-sm font-semibold">{s.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.role}, {s.company}
                  </p>
                </div>
                {s.logo && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={s.logo}
                    alt={s.company}
                    className={cn(
                      s.logoSize ?? "h-5",
                      "w-auto opacity-60 invert dark:invert-0 hidden sm:block",
                    )}
                  />
                )}
              </div>
            </div>

            {/* Receipt */}
            <div className="grid grid-cols-3 gap-3 rounded-xl border border-border bg-muted/40 p-3 md:p-4">
              <div className="space-y-0.5 border-r border-border pr-3">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {s.market} Rate
                </p>
                <p className="font-mono text-sm font-semibold tracking-tight line-through decoration-muted-foreground/50 md:text-base">
                  {s.currency}
                  {s.localRate.toLocaleString()}
                  <span className="text-[10px] text-muted-foreground no-underline">
                    /mo
                  </span>
                </p>
              </div>
              <div className="space-y-0.5 border-r border-border pr-3">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                  OctogleHire
                </p>
                <p className="font-mono text-sm font-semibold tracking-tight text-pulse md:text-base">
                  {s.currency}
                  {s.octogleRate.toLocaleString()}
                  <span className="text-[10px] text-muted-foreground">/mo</span>
                </p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Saved / Yr
                </p>
                <p className="font-mono text-sm font-semibold tracking-tight md:text-base">
                  {s.currency}
                  {(annualSavings / 1000).toFixed(0)}k
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tile selector — compact */}
      <div className="mx-auto mt-4 grid max-w-5xl grid-cols-4 gap-2 md:gap-3">
        {stories.map((story, i) => {
          const isActive = i === index;
          const pct = Math.round(
            ((story.localRate - story.octogleRate) / story.localRate) * 100,
          );

          return (
            <button
              key={story.name}
              onClick={() => setIndex(i)}
              aria-label={`View ${story.name} story`}
              className={cn(
                "group relative overflow-hidden rounded-xl border text-left transition-all duration-300",
                isActive
                  ? "border-pulse shadow-[0_0_0_1px_oklch(from_var(--pulse)_l_c_h_/_0.3)]"
                  : "border-border hover:border-foreground/40",
              )}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={story.avatar}
                  alt={story.name}
                  fill
                  sizes="(min-width: 768px) 20vw, 25vw"
                  className={cn(
                    "object-cover transition-all duration-500",
                    story.avatarPosition,
                    !isActive && "grayscale-[35%] group-hover:grayscale-0",
                  )}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div
                  className={cn(
                    "absolute right-2 top-2 inline-flex items-center rounded-full px-1.5 py-0.5 font-mono text-[9px] font-semibold transition-colors",
                    isActive
                      ? "bg-pulse text-background"
                      : "bg-black/55 text-white backdrop-blur-md",
                  )}
                >
                  −{pct}%
                </div>

                <div className="absolute inset-x-2 bottom-1.5">
                  <p className="text-[11px] font-semibold text-white leading-tight truncate">
                    {story.name}
                  </p>
                  <p className="text-[9px] text-white/70 leading-tight truncate">
                    {story.company}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <p className="mt-5 text-center text-[10px] text-muted-foreground">
        Based on 2024–2025 hiring data across 300+ placements
      </p>
    </section>
  );
};

export { SavingsComparison };
