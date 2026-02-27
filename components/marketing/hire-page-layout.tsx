"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Clock,
  Globe,
  Scale,
  Shield,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { companyLeadSchema, type CompanyLead } from "@/lib/schemas/company-enquiry";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { techToSlug, roleToSlug, countryToSlug } from "@/lib/seo-data";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

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
  children?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

const BENEFIT_ICONS: LucideIcon[] = [Shield, Zap, Globe, Scale, Users, Clock];

const stats = [
  { value: 150, suffix: "+", label: "Countries" },
  { value: 3, suffix: "%", prefix: "Top ", label: "Talent" },
  { value: 48, suffix: "h", label: "First Match" },
  { value: 60, suffix: "%", label: "Cost Savings" },
];

const faqs = [
  {
    q: "How are developers vetted on OctogleHire?",
    a: "Every developer goes through a rigorous 5-stage process: application review, stack-specific technical assessment, live system design interview, background check, and reference verification. Only the top 3% of applicants are approved.",
  },
  {
    q: "How fast can I get matched with a developer?",
    a: "Most companies receive 3\u20135 vetted candidate profiles within 48 hours of posting a role. The average time from posting to signed contract is 5 business days.",
  },
  {
    q: "How does pricing work?",
    a: "On the free Pay Per Hire plan, there are no upfront costs \u2014 you only pay a one-time success fee when you make a hire. The Scale plan is a flat monthly subscription with no per-hire fees. Enterprise pricing is available for large teams.",
  },
  {
    q: "Is there a trial period?",
    a: "Yes. All placements come with a talent guarantee. If a developer doesn\u2019t meet your expectations within the guarantee period, we replace them at no additional cost.",
  },
];

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
// Animated stat counter (counts up on scroll)
// ---------------------------------------------------------------------------

function AnimatedStat({
  value,
  prefix,
  suffix,
  label,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1200;
          const start = performance.now();

          const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * value));
            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-border bg-background p-5 text-center"
    >
      <span className="text-pulse text-3xl font-semibold tracking-tight font-mono lg:text-4xl">
        {prefix}
        {display}
        {suffix}
      </span>
      <span className="mt-2 block text-sm text-muted-foreground">{label}</span>
    </div>
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
// Inline lead capture form
// ---------------------------------------------------------------------------

function HeroForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CompanyLead>({
    resolver: zodResolver(companyLeadSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: CompanyLead) => {
    setApiError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/company-enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { message?: string };
        setApiError(body.message ?? "Something went wrong. Please try again.");
        return;
      }

      setSubmittedName(data.contactName.split(" ")[0]);
      setSubmitted(true);
    } catch {
      setApiError("Unable to connect. Please check your connection and try again.");
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm animate-in fade-in duration-500">
        <div className="flex flex-col items-center text-center space-y-4 py-6">
          <CheckCircle className="size-10 text-pulse" />
          <h3 className="text-lg font-semibold">
            Thanks {submittedName}!
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            We&apos;ll match you with vetted developers within 48 hours.
          </p>
          <Button asChild variant="outline" className="rounded-full gap-2">
            <Link href="/marketplace">
              Browse Developers
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Get matched in 48 hours
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4 space-y-3">
        <Field>
          <FieldLabel htmlFor="hero-contactName">Full Name</FieldLabel>
          <Input
            id="hero-contactName"
            placeholder="Jane Smith"
            className="h-11 rounded-lg"
            {...register("contactName")}
          />
          {errors.contactName && (
            <FieldError>{errors.contactName.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="hero-companyName">Company Name</FieldLabel>
          <Input
            id="hero-companyName"
            placeholder="Acme Labs"
            className="h-11 rounded-lg"
            {...register("companyName")}
          />
          {errors.companyName && (
            <FieldError>{errors.companyName.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="hero-email">Work Email</FieldLabel>
          <Input
            id="hero-email"
            type="email"
            placeholder="jane@acme.com"
            className="h-11 rounded-lg"
            {...register("email")}
          />
          {errors.email && (
            <FieldError>{errors.email.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="hero-phone">Phone Number</FieldLabel>
          <Input
            id="hero-phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            className="h-11 rounded-lg"
            {...register("phone")}
          />
          {errors.phone && (
            <FieldError>{errors.phone.message}</FieldError>
          )}
        </Field>

        {apiError && (
          <p className="text-sm text-destructive">{apiError}</p>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full rounded-full gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Get Matched"}
          {!isSubmitting && <ArrowRight className="size-4" />}
        </Button>
      </form>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        No fees until you hire. Cancel anytime.
      </p>
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
  children,
}: HirePageLayoutProps) {
  const allCrossLinks: CrossLink[] = [
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

  return (
    <>
      <Navbar />
      <main>
        {/* ── 1. Hero — split layout with embedded form ────────── */}
        <section className="container mx-auto px-6 py-20 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16 lg:items-start">
            {/* Left */}
            <div>
              {/* Trust badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-4 py-1.5">
                <span className="size-2 rounded-full bg-pulse animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Pre-vetted &amp; ready to start
                </span>
              </div>

              {/* Section label */}
              <p className="mt-6 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {label}
              </p>

              {/* Heading */}
              <h1 className="mt-3 text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl">
                {renderTitle(title, titleAccent)}
              </h1>

              {/* Description */}
              <p className="mt-4 max-w-xl text-lg text-muted-foreground">
                {description}
              </p>

              {/* CTAs — visible on mobile, hidden on lg (form takes over) */}
              <div className="mt-8 flex flex-wrap gap-3 lg:hidden">
                <Button asChild size="lg" className="rounded-full gap-2">
                  <Link href="/companies/signup">
                    Start Hiring
                    <ArrowRight className="size-4 -rotate-45" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full"
                >
                  <Link href="/marketplace">Browse Developers</Link>
                </Button>
              </div>

              {/* Trust line */}
              <p className="mt-10 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Trusted by 500+ companies worldwide
              </p>
            </div>

            {/* Right — embedded form */}
            <div className="hidden lg:block lg:sticky lg:top-24">
              <HeroForm />
            </div>
          </div>
        </section>

        {/* ── 2. Stats strip with count-up animation ───────────── */}
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {stats.map((stat) => (
                <AnimatedStat
                  key={stat.label}
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  label={stat.label}
                />
              ))}
            </div>
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
                  Your Matches, Delivered in 48 Hours
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Post a role and receive 3&ndash;5 curated, vetted profiles
                  within 48 hours. Review skills, rates, availability, and
                  previous work.
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
                <Button asChild className="rounded-full gap-2">
                  <Link href="/companies/signup">
                    Post a Role Free
                    <ArrowRight className="size-4" />
                  </Link>
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
                  Only the <span className="text-pulse">top 3%</span> make the
                  cut
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our 5-stage vetting process means every developer on your
                  shortlist has been technically assessed, interviewed, and
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

        {/* ── 8. Mobile form (visible below cross-links on small) */}
        <section className="container mx-auto px-6 pb-20 lg:hidden">
          <HeroForm />
        </section>

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
                  Get matched with pre-vetted engineers in days, not months. No
                  recruitment fees, no long-term contracts.
                </p>
                <ul className="grid max-w-lg grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-2">
                  {[
                    { icon: Shield, text: "Pre-vetted top 3% engineers" },
                    { icon: Globe, text: "Talent from 150+ countries" },
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
                    className="rounded-full hover:bg-pulse hover:text-pulse-foreground"
                    asChild
                  >
                    <Link href="/companies/signup">
                      Start Hiring Today
                      <ArrowRight className="ml-2 size-4 -rotate-45" />
                    </Link>
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
                    { value: "150+", label: "Countries" },
                    { value: "1,000+", label: "Developers" },
                    { value: "48h", label: "Delivery" },
                    { value: "Top 3%", label: "Engineers" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-lg border border-white/10 bg-white/5 p-6 text-center"
                    >
                      <p className="text-3xl font-semibold font-mono text-pulse">
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
    </>
  );
}
