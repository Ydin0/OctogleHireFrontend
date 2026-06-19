"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Clock,
  Globe,
  Scale,
  Shield,
  Star,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { BriefWizard, BRIEF_TECH_NAMES } from "@/components/marketing/brief-wizard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { techToSlug, roleToSlug, countryToSlug } from "@/lib/seo-data";
import { hireFaqs } from "@/lib/data/hire-faqs";
import { HireComparison } from "@/components/marketing/hire-comparison";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Benefit {
  title: string;
  description: string;
}

interface CrossLink {
  label: string;
  href: string;
}

interface HirePageLayoutProps {
  label: string;
  title: string;
  titleAccent?: string;
  description: string;
  benefits: Benefit[];
  crossLinks?: CrossLink[];
  techCrossLinks?: string[];
  countryCrossLinks?: string[];
  roleCrossLinks?: string[];
  applySlug?: string;
  children?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

const BENEFIT_ICONS: LucideIcon[] = [Shield, Zap, Globe, Scale, Users, Clock];

const faqs = hireFaqs;

const testimonials = [
  {
    quote:
      "OctogleHire transformed how we build engineering teams. We went from months of searching to having three senior engineers onboarded in under two weeks.",
    name: "Sarah Chen",
    role: "CTO",
    company: "Nextera Technologies",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face",
    stat: { value: "3x", label: "faster time to hire" },
  },
  {
    quote:
      "We scaled our backend team from 5 to 20 engineers in three months. Every hire has been a perfect fit both technically and culturally.",
    name: "Marcus Rivera",
    role: "VP of Engineering",
    company: "Cloudshift",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    stat: { value: "15", label: "engineers hired" },
  },
  {
    quote:
      "The compliance handling alone saved us thousands in legal fees. Hiring across borders has never been this seamless.",
    name: "Priya Sharma",
    role: "Head of People",
    company: "Finova",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
    stat: { value: "60%", label: "lower hiring costs" },
  },
];

const matchData = [
  {
    name: "Arjun Kumar",
    role: "React \u2022 6 yrs exp",
    rate: "$65/hr",
    score: "98%",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    online: true,
    stack: [
      `${DEVICON}/react/react-original.svg`,
      `${DEVICON}/typescript/typescript-original.svg`,
    ],
  },
  {
    name: "Priya Mehta",
    role: "React \u2022 5 yrs exp",
    rate: "$60/hr",
    score: "95%",
    avatar:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=face",
    online: true,
    stack: [
      `${DEVICON}/react/react-original.svg`,
      `${DEVICON}/nodejs/nodejs-original.svg`,
    ],
  },
  {
    name: "Rahul Verma",
    role: "React \u2022 7 yrs exp",
    rate: "$75/hr",
    score: "93%",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    online: false,
    stack: [
      `${DEVICON}/react/react-original.svg`,
      `${DEVICON}/tailwindcss/tailwindcss-original.svg`,
    ],
  },
];

const VETTING_STEPS = [
  "Application Review",
  "Technical Assessment",
  "Live Interview",
  "Background Check",
  "Reference Verification",
];

// ---------------------------------------------------------------------------
// Helper — render title with accent
// ---------------------------------------------------------------------------

function renderTitle(title: string, accent?: string) {
  if (!accent) return title;
  const idx = title.toLowerCase().indexOf(accent.toLowerCase());
  if (idx === -1) return title;
  const before = title.slice(0, idx);
  const match = title.slice(idx, idx + accent.length);
  const after = title.slice(idx + accent.length);
  return (
    <>
      {before}
      <span className="text-pulse">{match}</span>
      {after}
    </>
  );
}

// ---------------------------------------------------------------------------
// Match mockup — shimmer loading → staggered results loop
// ---------------------------------------------------------------------------

function MatchMockup() {
  const [phase, setPhase] = useState<"loading" | "results">("loading");
  const [cycleKey, setCycleKey] = useState(0);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const runCycle = () => {
      setPhase("loading");
      setCycleKey((k) => k + 1);
      t = setTimeout(() => {
        setPhase("results");
        t = setTimeout(runCycle, 4200);
      }, 1000);
    };
    runCycle();
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Your Matches</p>
        <Badge variant="outline" className="text-[10px]">
          Delivered in 48h
        </Badge>
      </div>

      {phase === "loading" ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border border-border p-3 animate-pulse"
            >
              <div className="size-10 rounded-full bg-muted shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 rounded-full bg-muted w-24" />
                <div className="h-2 rounded-full bg-muted w-16" />
              </div>
              <div className="space-y-1.5 shrink-0">
                <div className="h-3 rounded-full bg-muted w-12 ml-auto" />
                <div className="h-2 rounded-full bg-muted w-10 ml-auto" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3" key={cycleKey}>
          {matchData.map((d, i) => (
            <div
              key={d.name}
              className="flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-muted/40 animate-in fade-in slide-in-from-bottom-2 duration-300"
              style={{
                animationDelay: `${i * 120}ms`,
                animationFillMode: "backwards",
              }}
            >
              <div className="relative shrink-0">
                <Avatar className="size-10">
                  <AvatarImage src={d.avatar} alt={d.name} />
                  <AvatarFallback>{d.name[0]}</AvatarFallback>
                </Avatar>
                {d.online && (
                  <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-card bg-emerald-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{d.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {d.stack.map((icon, si) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={si} src={icon} alt="" className="size-3" />
                  ))}
                  <span className="text-xs text-muted-foreground ml-0.5">
                    {d.role}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-mono font-medium">{d.rate}</p>
                <p className="text-[10px] text-pulse font-mono font-semibold">
                  {d.score} match
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Vetting mockup — sequential checklist animation
// ---------------------------------------------------------------------------

function VettingMockup() {
  const [checkedCount, setCheckedCount] = useState(0);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (checkedCount >= VETTING_STEPS.length) {
      t = setTimeout(() => setCheckedCount(0), 2200);
    } else {
      t = setTimeout(
        () => setCheckedCount((c) => c + 1),
        checkedCount === 0 ? 600 : 520,
      );
    }
    return () => clearTimeout(t);
  }, [checkedCount]);

  return (
    <div className="rounded-2xl border border-border bg-background p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex -space-x-2">
          {[
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
            "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=face",
          ].map((src, i) => (
            <Avatar key={i} className="size-8 ring-2 ring-background">
              <AvatarImage src={src} alt="" />
              <AvatarFallback />
            </Avatar>
          ))}
          <div className="flex size-8 items-center justify-center rounded-full bg-muted ring-2 ring-background font-mono text-[10px] text-muted-foreground">
            +97
          </div>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] transition-colors duration-500",
            checkedCount === VETTING_STEPS.length
              ? "border-emerald-500/30 text-emerald-600"
              : "text-muted-foreground",
          )}
        >
          {checkedCount} / {VETTING_STEPS.length} Passed
        </Badge>
      </div>

      {VETTING_STEPS.map((step, i) => {
        const isPassed = i < checkedCount;
        const isActive = i === checkedCount;
        return (
          <div key={step} className="flex items-center gap-3">
            <span
              className={cn(
                "flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-400",
                isPassed
                  ? "border-transparent bg-pulse"
                  : isActive
                    ? "border-pulse animate-pulse"
                    : "border-border",
              )}
            >
              {isPassed && (
                <svg
                  viewBox="0 0 8 8"
                  className="size-2 fill-none stroke-background"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1.5 4l2 2 3-3" />
                </svg>
              )}
            </span>
            <span
              className={cn(
                "flex-1 text-sm transition-colors duration-300",
                isPassed ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {step}
            </span>
            <span
              className={cn(
                "font-mono text-[10px] uppercase tracking-wider transition-all duration-300",
                isPassed ? "text-pulse opacity-100" : "opacity-0",
              )}
            >
              passed
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Testimonial carousel
// ---------------------------------------------------------------------------

function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const next = () => {
    setAnimKey((k) => k + 1);
    setIndex((i) => (i + 1) % testimonials.length);
  };

  const prev = () => {
    setAnimKey((k) => k + 1);
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  };

  const t = testimonials[index];

  return (
    <>
      <div className="flex items-center gap-4 md:gap-6">
        <Button
          variant="outline"
          size="icon"
          onClick={prev}
          className="rounded-full size-11 shrink-0"
          aria-label="Previous testimonial"
        >
          <ArrowRight className="size-4 rotate-180" />
        </Button>

        <div className="flex-1 overflow-hidden rounded-3xl border border-border bg-card">
          <div
            key={animKey}
            className="p-8 md:p-10 animate-in fade-in duration-300"
          >
            <div className="grid gap-8 md:grid-cols-[1fr_180px]">
              <div className="space-y-6">
                <blockquote className="text-xl font-medium leading-relaxed lg:text-2xl">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <Avatar className="size-11 ring-2 ring-border shrink-0">
                    <AvatarImage src={t.avatar} alt={t.name} />
                    <AvatarFallback>{t.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.role}, {t.company}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-muted/30 p-6">
                <p className="font-mono text-4xl font-semibold text-pulse">
                  {t.stat.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground text-center">
                  {t.stat.label}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={next}
          className="rounded-full size-11 shrink-0"
          aria-label="Next testimonial"
        >
          <ArrowRight className="size-4" />
        </Button>
      </div>

      {/* Dot indicators */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {testimonials.map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === index ? "bg-foreground w-6" : "bg-border w-1.5",
            )}
          />
        ))}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// FAQ Accordion
// ---------------------------------------------------------------------------

function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-2xl border-t border-border">
      {faqs.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="border-b border-border">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-start justify-between gap-4 py-6 text-left"
            >
              <span className="text-base font-medium leading-snug">
                {item.q}
              </span>
              <ChevronDown
                className={cn(
                  "size-4 text-muted-foreground shrink-0 mt-0.5 transition-transform duration-300",
                  isOpen && "rotate-180",
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-all duration-300 ease-in-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="pb-6 text-sm text-muted-foreground leading-relaxed">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hero profile peek cards
// ---------------------------------------------------------------------------

function ProfilePeekCard({
  d,
}: {
  d: (typeof matchData)[number] & { location?: string };
}) {
  return (
    <div className="w-[230px] shrink-0 overflow-hidden rounded-3xl border border-border bg-card text-left shadow-sm transition-transform hover:-translate-y-1">
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-muted to-background">
        <Avatar className="size-full rounded-none">
          <AvatarImage src={d.avatar} alt={d.name} className="object-cover" />
          <AvatarFallback className="rounded-none text-2xl">{d.name[0]}</AvatarFallback>
        </Avatar>
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/45 px-2 py-1 backdrop-blur">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          <span className="font-mono text-[9px] uppercase tracking-wider text-white">
            Available
          </span>
        </span>
        <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/45 px-2 py-1 backdrop-blur">
          <span className="size-1.5 rounded-full bg-pulse" />
          <span className="font-mono text-[9px] uppercase tracking-wider text-white">
            AI Native
          </span>
        </span>
      </div>
      <div className="flex flex-col gap-2.5 p-4">
        <div>
          <div className="text-sm font-semibold">{d.name}</div>
          <div className="mt-0.5 text-xs text-pulse">{d.role}</div>
        </div>
        <div className="flex items-center gap-1.5">
          {d.stack.map((icon, si) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={si} src={icon} alt="" className="size-3.5" />
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-border pt-2.5">
          <span className="font-mono text-sm font-semibold">{d.rate}</span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-pulse">
            {d.score} match
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function HirePageLayout({
  label,
  title,
  titleAccent,
  description,
  benefits,
  crossLinks,
  techCrossLinks,
  countryCrossLinks,
  roleCrossLinks,
  applySlug,
  children,
}: HirePageLayoutProps) {
  const allCrossLinks: CrossLink[] = [
    ...(applySlug
      ? [{ label: "Apply for this role", href: `/apply/${applySlug}` }]
      : []),
    ...(crossLinks ?? []),
    ...(techCrossLinks ?? []).map((tech) => ({
      label: `Hire ${tech} Developers`,
      href: `/hire/${techToSlug(tech)}`,
    })),
    ...(countryCrossLinks ?? []).map((country) => ({
      label: `Hire Developers in ${country}`,
      href: `/hire/developers-in/${countryToSlug(country)}`,
    })),
    ...(roleCrossLinks ?? []).map((role) => ({
      label: `Hire a ${role}`,
      href: `/hire/${roleToSlug(role)}`,
    })),
  ];

  // ── Brief wizard state + prefill derived from the page context ──
  const [wizardOpen, setWizardOpen] = useState(false);
  const openBrief = () => setWizardOpen(true);

  const accent = titleAccent?.trim();
  const isTech = !!accent && BRIEF_TECH_NAMES.includes(accent);
  const briefTech = isTech ? [accent as string] : [];
  const briefRoleChips = isTech
    ? [
        `Senior ${accent} Engineer`,
        `Full-Stack (${accent}) Engineer`,
        "Frontend Engineer",
        "Backend Engineer",
      ]
    : undefined;

  return (
    <>
      <Navbar />
      <main>
        {/* ── 1. Hero — v2 centered brief CTA ──────────────────── */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[-120px] h-[460px] w-[820px] -translate-x-1/2"
            style={{
              background:
                "radial-gradient(ellipse, color-mix(in oklab, var(--pulse) 13%, transparent), transparent 65%)",
            }}
          />
          <div className="container relative mx-auto flex flex-col items-center px-6 pb-12 pt-14 text-center lg:pt-20">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-border bg-muted/60 px-4 py-1.5">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/70" />
                <span className="relative size-2 rounded-full bg-emerald-400" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                {label} · available this week
              </span>
            </span>

            <h1 className="mt-7 max-w-3xl text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl">
              {renderTitle(title, titleAccent)}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {description}
            </p>

            <div className="mt-8 flex flex-col items-center gap-3.5">
              <Button
                size="lg"
                onClick={openBrief}
                className="h-14 gap-2.5 rounded-full px-8 text-base"
              >
                Start your brief — it takes 60 seconds
                <ArrowRight className="size-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Free to start · No JD needed · No recruitment fees
              </span>
            </div>

            {/* Trust row */}
            <div className="mt-9 flex items-center gap-4">
              <div className="flex -space-x-2.5">
                {matchData.map((d) => (
                  <Avatar key={d.name} className="size-9 ring-2 ring-background">
                    <AvatarImage src={d.avatar} alt="" />
                    <AvatarFallback>{d.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-0.5 text-pulse">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="size-3.5 fill-current" />
                  ))}
                  <span className="ml-1.5 text-sm font-semibold text-foreground">
                    4.9
                  </span>
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  Trusted by 500+ engineering teams
                </div>
              </div>
            </div>

            {/* Profile peek cards */}
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              {matchData.map((d) => (
                <ProfilePeekCard key={d.name} d={d} />
              ))}
            </div>
            <button
              onClick={openBrief}
              className="mt-5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Start a brief to unlock your full shortlist →
            </button>
          </div>
        </section>

        {/* ── 3. Features showcase — match + vetting mockups ──── */}
        <section className="container mx-auto px-6 py-24">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            How it works
          </span>
          <h2 className="mt-4 max-w-2xl text-4xl font-medium tracking-tight lg:text-5xl">
            Hire world-class engineers in three simple steps
          </h2>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {/* Card 1 — Matching */}
            <div className="rounded-3xl border border-border bg-muted/30 p-6 space-y-5">
              <div className="rounded-2xl bg-background border border-border p-4">
                <MatchMockup />
              </div>
              <div className="space-y-2 px-2">
                <h3 className="text-lg font-semibold">
                  3–5 Vetted Profiles in 48 Hours
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Post a role and receive 3&ndash;5 curated profiles from our
                  1,000+ engineer network within 48 hours. Every match has
                  passed a 5-stage vetting process — 25,000+ reviewed, 1,000 accepted.
                </p>
              </div>
            </div>

            {/* Card 2 — Steps */}
            <div className="rounded-3xl border border-border bg-muted/30 p-6 space-y-5">
              <div className="grid gap-4">
                {[
                  {
                    num: 1,
                    title: "Tell Us What You Need",
                    desc: "Describe your role, tech stack, and timeline. Takes less than 5 minutes.",
                  },
                  {
                    num: 2,
                    title: "Get Matched in Days",
                    desc: "Our team hand-picks pre-vetted profiles matched to your exact requirements.",
                  },
                  {
                    num: 3,
                    title: "Start Building",
                    desc: "Interview, select, and onboard instantly. We handle contracts and compliance.",
                  },
                ].map((step) => (
                  <div
                    key={step.num}
                    className="flex gap-4 rounded-xl border border-border bg-background p-4"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background text-sm font-semibold">
                      {step.num}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">{step.title}</h4>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-2">
                <Button onClick={openBrief} className="rounded-full gap-2">
                  Start your brief
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Full-width vetting card */}
          <div className="mt-4 rounded-3xl border border-border bg-muted/30 p-8 md:p-12">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Shield className="size-4 text-muted-foreground" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Verified Network
                  </span>
                </div>
                <h3 className="text-3xl font-medium tracking-tight">
                  Only <span className="text-pulse">1 in 25</span> make the
                  cut
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our 5-stage vetting process has screened over 25,000
                  applicants — only 1,000 have been accepted. Every developer on
                  your shortlist has been technically assessed, interviewed, and
                  background-checked &mdash; before they ever reach you.
                </p>
                <ul className="space-y-3">
                  {[
                    "Multi-stage technical assessments",
                    "Live system design interviews",
                    "Background & reference checks",
                    "Ongoing performance monitoring",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-sm"
                    >
                      <CheckCircle className="size-4 text-pulse shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="rounded-full gap-2">
                  <Link href="/marketplace">
                    View Developer Profiles
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>

              <VettingMockup />
            </div>
          </div>
        </section>

        {/* ── 4. Benefits grid with icons ──────────────────────── */}
        <section className="container mx-auto px-6 pb-24">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Why OctogleHire
          </span>
          <h2 className="mt-4 text-lg font-semibold tracking-tight sm:text-2xl">
            Why companies choose OctogleHire
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
            {benefits.map((benefit, i) => {
              const Icon = BENEFIT_ICONS[i % BENEFIT_ICONS.length];
              return (
                <div
                  key={benefit.title}
                  className="bg-background p-8 space-y-4"
                >
                  <div className="size-10 rounded-xl border border-border flex items-center justify-center">
                    <Icon
                      className="size-5 text-foreground"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="text-base font-semibold">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 4b. Comparison table ──────────────────────────────── */}
        <HireComparison />

        {/* ── 5. Social proof — testimonial carousel ───────────── */}
        <section className="container mx-auto px-6 pb-24">
          <div className="mb-12 flex flex-col gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Testimonials
            </span>
            <h2 className="text-4xl font-medium tracking-tight lg:text-5xl">
              You&apos;re in good company.
            </h2>
          </div>

          <TestimonialCarousel />
        </section>

        {/* ── 6. FAQ ───────────────────────────────────────────── */}
        <section className="container mx-auto px-6 pb-24">
          <div className="mx-auto mb-14 max-w-xl text-center">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              FAQ
            </span>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight lg:text-5xl">
              Frequently asked questions
            </h2>
          </div>
          <FaqAccordion />
        </section>

        {/* Extra content slot */}
        {children}

        {/* ── 7. Cross-links ───────────────────────────────────── */}
        {allCrossLinks.length > 0 && (
          <section className="container mx-auto px-6 pb-20">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Related
            </p>
            <h2 className="mt-3 text-lg font-semibold tracking-tight">
              Explore more
            </h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {allCrossLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── 9. Bottom CTA — dark section ─────────────────────── */}
        <section className="dark bg-background py-16 text-foreground">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 gap-10 xl:grid-cols-2 xl:items-center">
              <div className="flex flex-col gap-6">
                <h2 className="text-4xl tracking-tight md:text-5xl">
                  <span className="font-semibold">
                    Don&apos;t hire harder.
                  </span>
                  <br />
                  <span className="text-pulse font-semibold">
                    Hire smarter.
                  </span>
                </h2>
                <p className="text-lg text-white/70">
                  Join 300+ companies hiring pre-vetted engineers in days, not
                  months. No recruitment fees, no long-term contracts.
                </p>
                <ul className="grid max-w-lg grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-2">
                  {[
                    { icon: Shield, text: "Rigorously vetted engineers" },
                    { icon: Globe, text: "Talent from 30+ countries" },
                    { icon: Scale, text: "Compliance & payroll handled" },
                    { icon: Zap, text: "48-hour candidate delivery" },
                    { icon: Users, text: "Dedicated account management" },
                    { icon: Clock, text: "Flexible engagement models" },
                  ].map((item) => (
                    <li
                      key={item.text}
                      className="flex items-center gap-3 text-xs font-mono tracking-[0.06em] text-white"
                    >
                      <item.icon className="size-4 shrink-0 stroke-white" />
                      {item.text}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    onClick={openBrief}
                    className="rounded-full hover:bg-pulse hover:text-pulse-foreground"
                  >
                    Start your brief
                    <ArrowRight className="ml-2 size-4 -rotate-45" />
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="rounded-full"
                  >
                    <Link href="/apply">Apply as a Developer</Link>
                  </Button>
                </div>
              </div>

              {/* Stat grid — desktop */}
              <div className="hidden xl:flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                  {[
                    { value: "30+", label: "Countries" },
                    { value: "1,000+", label: "Developers" },
                    { value: "48h", label: "Delivery" },
                    { value: "4%", label: "Acceptance rate" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-lg border border-white/10 bg-white/5 p-6 text-center"
                    >
                      <p className="text-2xl font-semibold font-mono text-pulse lg:text-3xl whitespace-nowrap">
                        {s.value}
                      </p>
                      <p className="mt-1 text-xs font-mono uppercase tracking-wider text-white/60">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <BriefWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        defaultTech={briefTech}
        roleChips={briefRoleChips}
        sourcePage={label}
      />
    </>
  );
}
