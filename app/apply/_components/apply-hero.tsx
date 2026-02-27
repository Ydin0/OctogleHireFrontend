"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AutoScroll from "embla-carousel-auto-scroll";
import {
  ArrowRight,
  Brain,
  CheckCircle,
  ChevronDown,
  Clock,
  Code,
  Globe,
  HandCoins,
  Layers,
  Rocket,
  Scale,
  Shield,
  Smartphone,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { EarningsCalculator } from "@/app/developers/join/_components/earnings-calculator";
import { REGIONAL_COUNTRIES } from "@/lib/seo-data";

interface ApplyHeroProps {
  onStart: () => void;
}

// ── Developer source countries for flag carousel ─────────────────────────────
const EXPENSIVE_MARKETS = new Set(["GB", "US", "CA", "DE", "FR", "NL", "IT", "AU"]);
const devCountries = REGIONAL_COUNTRIES.filter((c) => !EXPENSIVE_MARKETS.has(c.isoCode));
const allCountries = [...devCountries, ...devCountries];

// ── Logo carousel ─────────────────────────────────────────────────────────────
// ── Bento data ────────────────────────────────────────────────────────────────
const DI = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

const rateRoles = [
  {
    title: "Senior Full-Stack Engineer",
    tags: [
      { label: "React", icon: `${DI}/react/react-original.svg` },
      { label: "Node.js", icon: `${DI}/nodejs/nodejs-original.svg` },
      { label: "TypeScript", icon: `${DI}/typescript/typescript-original.svg` },
    ],
    uplift: 28,
    type: "Full-Time",
  },
  {
    title: "Backend Engineer",
    tags: [
      { label: "Python", icon: `${DI}/python/python-original.svg` },
      { label: "Django", icon: `${DI}/django/django-plain.svg` },
      { label: "PostgreSQL", icon: `${DI}/postgresql/postgresql-original.svg` },
    ],
    uplift: 22,
    type: "Monthly",
  },
  {
    title: "DevOps Engineer",
    tags: [
      { label: "AWS", icon: `${DI}/amazonwebservices/amazonwebservices-original-wordmark.svg` },
      { label: "Kubernetes", icon: `${DI}/kubernetes/kubernetes-original.svg` },
      { label: "Terraform", icon: `${DI}/terraform/terraform-original.svg` },
    ],
    uplift: 25,
    type: "Hourly",
  },
];

const opportunities = [
  { company: "Vercel", role: "Senior Full-Stack", type: "Full-Time", match: "98%", logo: "https://assets.vercel.com/image/upload/front/favicon/vercel/60x60.png" },
  { company: "Stripe", role: "Backend Engineer", type: "Part-Time", match: "94%", logo: "https://images.stripeassets.com/fzn2n1nzq965/HTTOloNPhisV9P4hlMPNA/cacf1bb88b9fc492dfad34378d844280/Stripe_icon_-_square.svg" },
  { company: "Linear", role: "ML Engineer", type: "Hourly", match: "91%", logo: "https://linear.app/static/apple-touch-icon.png" },
];

const JOURNEY_STEPS = [
  { title: "Submit your profile", detail: "10 minutes, applied once" },
  { title: "Reviewed within 48h", detail: "Our team verifies and approves" },
  { title: "Receive matched roles", detail: "Curated opportunities, no noise" },
  { title: "Start and get paid", detail: "Contracts, payroll, compliance handled" },
];

// ── How it works data ─────────────────────────────────────────────────────────
const DEV_STEPS = [
  { value: "apply", label: "Apply" },
  { value: "review", label: "Get Reviewed" },
  { value: "match", label: "Get Matched" },
] as const;

type DevStepValue = (typeof DEV_STEPS)[number]["value"];

// ── Role tracks ───────────────────────────────────────────────────────────────
const roleTracks = [
  {
    icon: Layers,
    label: "Full-Stack",
    title: "Own features end-to-end",
    summary: "Best fit for engineers who can move from UI to APIs and ship fast with product teams.",
    focus: ["React / Next.js delivery", "API + DB ownership", "System thinking"],
    stack: [
      { label: "React", icon: `${DI}/react/react-original.svg` },
      { label: "Next.js", icon: `${DI}/nextjs/nextjs-original.svg` },
      { label: "TypeScript", icon: `${DI}/typescript/typescript-original.svg` },
      { label: "Node.js", icon: `${DI}/nodejs/nodejs-original.svg` },
      { label: "PostgreSQL", icon: `${DI}/postgresql/postgresql-original.svg` },
      { label: "Tailwind", icon: `${DI}/tailwindcss/tailwindcss-original.svg` },
    ],
  },
  {
    icon: Code,
    label: "Backend",
    title: "Build scalable core systems",
    summary: "For engineers who enjoy architecture, reliability, and high-throughput service design.",
    focus: ["Distributed systems", "Cloud + observability", "Performance tuning"],
    stack: [
      { label: "Python", icon: `${DI}/python/python-original.svg` },
      { label: "Go", icon: `${DI}/go/go-original.svg` },
      { label: "Java", icon: `${DI}/java/java-original.svg` },
      { label: "Node.js", icon: `${DI}/nodejs/nodejs-original.svg` },
      { label: "PostgreSQL", icon: `${DI}/postgresql/postgresql-original.svg` },
      { label: "Redis", icon: `${DI}/redis/redis-original.svg` },
    ],
  },
  {
    icon: Brain,
    label: "AI / Data",
    title: "Ship applied AI products",
    summary: "Work on LLM pipelines, data infrastructure, and production machine learning systems.",
    focus: ["LLM integrations", "Data modeling", "Evaluation frameworks"],
    stack: [
      { label: "Python", icon: `${DI}/python/python-original.svg` },
      { label: "PyTorch", icon: `${DI}/pytorch/pytorch-original.svg` },
      { label: "TensorFlow", icon: `${DI}/tensorflow/tensorflow-original.svg` },
      { label: "Pandas", icon: `${DI}/pandas/pandas-original.svg` },
      { label: "Jupyter", icon: `${DI}/jupyter/jupyter-original.svg` },
    ],
  },
  {
    icon: Smartphone,
    label: "Mobile",
    title: "Build product experiences people keep",
    summary: "Own modern mobile app development with fast release loops and meaningful user impact.",
    focus: ["React Native / Swift / Kotlin", "Performance + UX polish", "App store lifecycle"],
    stack: [
      { label: "React Native", icon: `${DI}/react/react-original.svg` },
      { label: "Swift", icon: `${DI}/swift/swift-original.svg` },
      { label: "Kotlin", icon: `${DI}/kotlin/kotlin-original.svg` },
      { label: "Flutter", icon: `${DI}/flutter/flutter-original.svg` },
      { label: "TypeScript", icon: `${DI}/typescript/typescript-original.svg` },
    ],
  },
];

// ── Benefits ──────────────────────────────────────────────────────────────────
const devBenefits = [
  {
    icon: Globe,
    title: "Work with Global Teams",
    description: "Access roles at companies in the US, EU, UK, and Australia — without relocating. Build your career at scale.",
  },
  {
    icon: HandCoins,
    title: "Transparent Compensation",
    description: "Rates are shared before any interview. No surprises, no drawn-out negotiations — just clarity from the start.",
  },
  {
    icon: Zap,
    title: "Fast Role Matching",
    description: "Approved developers receive their first matched role within 48 hours. Less waiting, more building.",
  },
  {
    icon: Scale,
    title: "Zero Admin Overhead",
    description: "Contracts, invoicing, payroll, and compliance — fully handled by OctogleHire so you can focus on your work.",
  },
  {
    icon: Shield,
    title: "Vetted Companies Only",
    description: "Every company is screened before they can access the network. Your time is spent on real opportunities.",
  },
  {
    icon: Clock,
    title: "Hourly, Monthly, or Annual Contracts",
    description: "Choose the engagement model that fits you — from short-term hourly projects to stable annual contracts with experience letters provided.",
  },
];

// ── Testimonials ──────────────────────────────────────────────────────────────
const testimonials = [
  {
    name: "Pratteek Shaurya",
    title: "Software Engineer",
    quote: "Applied once, started my first client project within two weeks.",
    image: "https://media.licdn.com/dms/image/v2/D4D03AQHq-t4Dd0zoug/profile-displayphoto-shrink_800_800/B4DZSdNblZGcAc-/0/1737804331792?e=1773878400&v=beta&t=aio0pJ_ARRaiXzF5qA0cneSDRLIBrJJyTs2ImdiyADI",
  },
  {
    name: "Anil Wadghule",
    title: "Solutions Architect",
    quote: "They matched me with a project that actually needed my Elixir expertise.",
    image: "https://media.licdn.com/dms/image/v2/C4E03AQGQaEZ5cwQnpA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1641360584592?e=1773878400&v=beta&t=lvIRhWnRA7GHoOmIY2_y7ZoYK1gpq1DYulFP8UqoODk",
  },
  {
    name: "Mahindra Danane",
    title: "Software Engineer",
    quote: "I get to work with international teams I wouldn't have had access to otherwise.",
    image: "https://media.licdn.com/dms/image/v2/D4D03AQFEoQR7Nvvv9g/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1729739461690?e=1773878400&v=beta&t=jbwJDsgsH73JA3MF1gjqqHMVHdZoibZsSojf6ZlqZN0",
  },
  {
    name: "Prasanna Wagh",
    title: "Fullstack Developer",
    quote: "As a junior, getting access to global clients felt impossible — until OctogleHire.",
    image: "https://media.licdn.com/dms/image/v2/D4D03AQGXvk1r3zg35Q/profile-displayphoto-crop_800_800/B4DZpvFnA8IkAI-/0/1762800335197?e=1773878400&v=beta&t=HIEcMS-LgRWHo6cWNalpP4EwqfYhD-e-FIDVDX3xdfw",
  },
  {
    name: "Yash Chavan",
    title: "Frontend Developer",
    quote: "Compensation was transparent and I started building from day one.",
    image: "https://media.licdn.com/dms/image/v2/D4D03AQF0dQB7XJcuwg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1709399954775?e=1773878400&v=beta&t=CAorsQS2n78aS4UgQ5LBDmnWVJmDtPT42a7jkvkk3r8",
  },
  {
    name: "Neha Shirsat",
    title: "QA Engineer",
    quote: "The onboarding was seamless — I was writing production code within my first week.",
    image: "https://media.licdn.com/dms/image/v2/D4D03AQEyX_RPVHe7PA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1696576746610?e=1773878400&v=beta&t=nx0WhyC1gZv9LZgpi46cZ1SCEpYKAQP9Jbk75D2wK7k",
  },
];

// ── CTA feature list ──────────────────────────────────────────────────────────
const ctaList = [
  { icon: Zap, text: "Reviewed within 48 hours" },
  { icon: HandCoins, text: "Transparent rates, always" },
  { icon: Globe, text: "Global companies, remote-first" },
  { icon: Scale, text: "Contracts & compliance handled" },
  { icon: Users, text: "Dedicated account support" },
  { icon: Rocket, text: "Career-defining opportunities" },
];

// ── FAQ ───────────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: "What does the vetting process involve?",
    a: "Every application goes through 5 stages: profile review, stack-specific technical assessment, live system design interview, background check, and reference verification. Only the top 3% of applicants are approved.",
  },
  {
    q: "How long until I start receiving role matches?",
    a: "Once your application is approved — typically within 48 hours — we begin matching you to relevant roles. Most approved developers receive their first match within 48 hours of approval.",
  },
  {
    q: "What rates can I expect?",
    a: "Rates vary by stack and experience level but are consistently 40–60% higher than typical local market rates. All rates are disclosed up front before any interview takes place.",
  },
  {
    q: "Who are the companies I would work with?",
    a: "We work with funded startups, scale-ups, and enterprise teams primarily based in the US, UK, EU, and Australia. Every company is vetted before they can access the developer network.",
  },
  {
    q: "What engagement types are available?",
    a: "We support hourly, part-time, full-time, and project-based engagements. You specify your preferences during the application and we match you accordingly.",
  },
  {
    q: "How does payment work for developers?",
    a: "OctogleHire acts as your employer of record. You receive a single monthly payment from us regardless of how many roles you're engaged on. No invoicing, no chasing clients.",
  },
];

// ── Bento sub-components ──────────────────────────────────────────────────────
const RateShowcase = () => {
  const [idx, setIdx] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % rateRoles.length);
      setKey((k) => k + 1);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  const role = rateRoles[idx];

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
      <div key={key} className="space-y-4 animate-in fade-in duration-300">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">{role.title}</p>
          <Badge variant="secondary" className="text-[10px]">{role.type}</Badge>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {role.tags.map((tag) => (
            <Badge key={tag.label} variant="outline" className="text-[10px] gap-1.5 px-2 py-0.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={tag.icon} alt="" className="size-3" />
              {tag.label}
            </Badge>
          ))}
        </div>
        <div className="rounded-lg border border-pulse bg-pulse/5 p-4 text-center">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Earnings uplift</p>
          <p className="mt-1 font-mono text-2xl font-semibold text-pulse">+{role.uplift}%</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">above local market rate</p>
        </div>
      </div>
      <div className="flex justify-center gap-1.5">
        {rateRoles.map((_, i) => (
          <span key={i} className={cn("h-1 rounded-full transition-all duration-300", i === idx ? "w-4 bg-foreground" : "w-1.5 bg-border")} />
        ))}
      </div>
    </div>
  );
};

const OpportunityFeed = () => {
  const [phase, setPhase] = useState<"loading" | "results">("loading");
  const [cycleKey, setCycleKey] = useState(0);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const run = () => {
      setPhase("loading");
      setCycleKey((k) => k + 1);
      t = setTimeout(() => { setPhase("results"); t = setTimeout(run, 4200); }, 900);
    };
    run();
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Your Opportunities</p>
        <Badge variant="outline" className="text-[10px]">Live matches</Badge>
      </div>
      {phase === "loading" ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="size-8 rounded-lg bg-muted shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-2.5 rounded-full bg-muted w-24" />
                <div className="h-2 rounded-full bg-muted w-16" />
              </div>
              <div className="space-y-1.5 shrink-0">
                <div className="h-2.5 rounded-full bg-muted w-12 ml-auto" />
                <div className="h-2 rounded-full bg-muted w-8 ml-auto" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3" key={cycleKey}>
          {opportunities.map((o, i) => (
            <div key={o.company} className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-1 duration-300"
              style={{ animationDelay: `${i * 110}ms`, animationFillMode: "backwards" }}>
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={o.logo} alt={o.company} className="size-5 object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{o.company}</p>
                <p className="text-[10px] text-muted-foreground">{o.role}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-mono font-medium">{o.type}</p>
                <p className="text-[10px] font-mono text-pulse">{o.match} match</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const JourneyMockup = () => {
  const [checkedCount, setCheckedCount] = useState(0);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (checkedCount >= JOURNEY_STEPS.length) {
      t = setTimeout(() => setCheckedCount(0), 2200);
    } else {
      t = setTimeout(() => setCheckedCount((c) => c + 1), checkedCount === 0 ? 600 : 520);
    }
    return () => clearTimeout(t);
  }, [checkedCount]);

  return (
    <div className="rounded-2xl border border-border bg-background p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <p className="text-sm font-semibold">Developer Journey</p>
        <Badge variant="outline" className={cn("text-[10px] transition-colors duration-500",
          checkedCount === JOURNEY_STEPS.length ? "border-emerald-500/30 text-emerald-600" : "text-muted-foreground")}>
          {checkedCount === JOURNEY_STEPS.length ? "Ready to match" : `Step ${Math.min(checkedCount + 1, JOURNEY_STEPS.length)} of ${JOURNEY_STEPS.length}`}
        </Badge>
      </div>
      {JOURNEY_STEPS.map((step, i) => {
        const isPassed = i < checkedCount;
        const isActive = i === checkedCount;
        return (
          <div key={step.title} className="flex items-start gap-3">
            <span className={cn("mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
              isPassed ? "border-transparent bg-pulse" : isActive ? "border-pulse animate-pulse" : "border-border")}>
              {isPassed && (
                <svg viewBox="0 0 8 8" className="size-2 fill-none stroke-background" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1.5 4l2 2 3-3" />
                </svg>
              )}
            </span>
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm font-medium leading-snug transition-colors duration-300", isPassed ? "text-foreground" : "text-muted-foreground")}>{step.title}</p>
              <p className={cn("text-xs text-muted-foreground transition-opacity duration-300", isPassed || isActive ? "opacity-100" : "opacity-40")}>{step.detail}</p>
            </div>
            <span className={cn("shrink-0 font-mono text-[10px] uppercase tracking-wider text-pulse transition-all duration-300", isPassed ? "opacity-100" : "opacity-0")}>done</span>
          </div>
        );
      })}
    </div>
  );
};

// ── How it works mockups ──────────────────────────────────────────────────────
const profileStack = [
  { label: "React", icon: `${DI}/react/react-original.svg` },
  { label: "TypeScript", icon: `${DI}/typescript/typescript-original.svg` },
  { label: "Node.js", icon: `${DI}/nodejs/nodejs-original.svg` },
];

const ENGAGEMENT_TYPES = [
  { label: "Hourly", description: "Flexible, project-based" },
  { label: "Part-Time", description: "20 hrs/week" },
  { label: "Full-Time", description: "Stable, long-term" },
] as const;

const ProfileMockup = () => {
  const [activeEngagement, setActiveEngagement] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveEngagement((i) => (i + 1) % ENGAGEMENT_TYPES.length), 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <p className="text-sm font-semibold">Developer Profile</p>
        <Badge variant="outline" className="text-[10px] border-pulse/30 text-pulse animate-in fade-in">
          Verified
        </Badge>
      </div>

      {/* Avatar + name */}
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-full bg-muted ring-2 ring-border">
          <span className="text-sm font-semibold">AK</span>
        </div>
        <div>
          <p className="text-sm font-semibold">Arjun Kumar</p>
          <p className="text-xs text-muted-foreground">Full-Stack Engineer · India</p>
        </div>
      </div>

      {/* Tech stack */}
      <div className="rounded-lg bg-muted/50 px-4 py-3">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Tech stack</p>
        <div className="flex flex-wrap gap-1.5">
          {profileStack.map((s) => (
            <Badge key={s.label} variant="secondary" className="text-[10px] gap-1.5 px-2 py-0.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.icon} alt="" className="size-3" />
              {s.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-muted/50 p-3 text-center">
          <p className="font-mono text-lg font-semibold">6</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Years</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-3 text-center">
          <p className="font-mono text-lg font-semibold">12</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Projects</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-3 text-center">
          <p className="font-mono text-lg font-semibold text-pulse">98%</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Score</p>
        </div>
      </div>

      {/* Engagement type — animated cycling */}
      <div className="space-y-2">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Preferred arrangement</p>
        <div className="flex gap-2">
          {ENGAGEMENT_TYPES.map((type, i) => (
            <div
              key={type.label}
              className={cn(
                "flex-1 rounded-lg border p-2.5 text-center transition-all duration-500",
                i === activeEngagement
                  ? "border-pulse bg-pulse/5 scale-[1.02]"
                  : "border-border bg-muted/30 opacity-50",
              )}
            >
              <p className={cn("text-xs font-semibold transition-colors duration-500", i === activeEngagement ? "text-pulse" : "text-muted-foreground")}>{type.label}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{type.description}</p>
            </div>
          ))}
        </div>
      </div>

      <Button className="w-full rounded-full" size="sm">Submit Application</Button>
    </div>
  );
};

const REVIEW_STEPS = [
  { step: "Application received", day: "Day 1" },
  { step: "Technical assessment", day: "Day 3" },
  { step: "Experience verification", day: "Day 7" },
  { step: "Final approval", day: "Day 10" },
  { step: "First role match", day: "Day 14" },
];

const ReviewMockup = () => {
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (completedCount >= REVIEW_STEPS.length) {
      t = setTimeout(() => setCompletedCount(0), 2000);
    } else {
      t = setTimeout(() => setCompletedCount((c) => c + 1), completedCount === 0 ? 800 : 600);
    }
    return () => clearTimeout(t);
  }, [completedCount]);

  const allDone = completedCount >= REVIEW_STEPS.length;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <p className="text-sm font-semibold">Application Review</p>
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] transition-all duration-500",
            allDone ? "border-pulse/30 text-pulse" : "text-muted-foreground",
          )}
        >
          {allDone ? "Approved" : "In Progress"}
        </Badge>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Progress</span>
          <span className="font-mono">{Math.min(completedCount, REVIEW_STEPS.length)}/{REVIEW_STEPS.length}</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-pulse transition-all duration-500 ease-out"
            style={{ width: `${(Math.min(completedCount, REVIEW_STEPS.length) / REVIEW_STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-1.5">
        {REVIEW_STEPS.map(({ step, day }, i) => {
          const isDone = i < completedCount;
          const isActive = i === completedCount;
          return (
            <div
              key={step}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-2.5 transition-all duration-400",
                isDone ? "bg-pulse/8" : isActive ? "bg-muted border border-border" : "bg-muted/30",
              )}
            >
              <div className={cn(
                "size-5 shrink-0 rounded-full flex items-center justify-center transition-all duration-400",
                isDone ? "bg-pulse" : isActive ? "border-2 border-pulse animate-pulse" : "border-2 border-border",
              )}>
                {isDone && (
                  <svg viewBox="0 0 8 8" className="size-2.5 fill-none stroke-background animate-in fade-in zoom-in duration-300" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1.5 4l2 2 3-3" />
                  </svg>
                )}
              </div>
              <span className={cn("text-sm flex-1 transition-colors duration-400", isDone ? "font-medium" : isActive ? "font-medium" : "text-muted-foreground")}>{step}</span>
              <span className={cn(
                "font-mono text-[10px] uppercase tracking-wider transition-all duration-400",
                isDone ? "text-pulse" : isActive ? "text-muted-foreground" : "text-muted-foreground/40",
              )}>
                {isDone ? "Done" : day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="rounded-xl border border-border bg-muted/40 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Average timeline</p>
            <p className="mt-0.5 font-mono text-2xl font-semibold">2 weeks</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">From application to</p>
            <p className="mt-0.5 text-sm font-semibold text-pulse">first role match</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const RoleMatchMockup = () => {
  const roles = [
    { company: "Vercel", role: "Senior Full-Stack", rate: "Full-Time", score: "98%", logo: "https://assets.vercel.com/image/upload/front/favicon/vercel/60x60.png" },
    { company: "Stripe", role: "Backend Engineer", rate: "Part-Time", score: "94%", logo: "https://images.stripeassets.com/fzn2n1nzq965/HTTOloNPhisV9P4hlMPNA/cacf1bb88b9fc492dfad34378d844280/Stripe_icon_-_square.svg" },
    { company: "Linear", role: "ML Engineer", rate: "Hourly", score: "91%", logo: "https://linear.app/static/apple-touch-icon.png" },
  ];
  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Your Matches</p>
        <span className="font-mono text-[10px] text-muted-foreground">Live</span>
      </div>
      {roles.map((r) => (
        <div key={r.company} className="flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-muted/40">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={r.logo} alt={r.company} className="size-6 object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{r.company}</p>
            <p className="text-xs text-muted-foreground">{r.role}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-medium">{r.rate}</p>
            <p className="font-mono text-[10px] font-semibold text-pulse">{r.score} match</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Tabbed how-it-works ───────────────────────────────────────────────────────
const devStepContent: Record<DevStepValue, { num: string; title: string; description: string; cta: string; mockup: React.ReactNode }> = {
  apply: {
    num: "01",
    title: "Submit once. No repetitive applications.",
    description: "Complete your developer profile in under 10 minutes — stack, experience, portfolio, and working preferences. We handle matching from there.",
    cta: "Start Your Application",
    mockup: <ProfileMockup />,
  },
  review: {
    num: "02",
    title: "We review and verify within 48 hours.",
    description: "Every application goes through technical review, experience verification, and profile assessment. We'll confirm your status within 48 hours of submission.",
    cta: "View Our Standards",
    mockup: <ReviewMockup />,
  },
  match: {
    num: "03",
    title: "Matched roles arrive — you choose what fits.",
    description: "Once approved, we match you to relevant roles from vetted companies. Every opportunity includes the full role brief, rate, and company details before you commit.",
    cta: "Start Your Application",
    mockup: <RoleMatchMockup />,
  },
};

const DevHowItWorks = ({ onStart }: { onStart: () => void }) => {
  const [active, setActive] = useState<DevStepValue>("apply");
  const content = devStepContent[active];

  return (
    <section className="py-24 container mx-auto px-6">
      <div className="mb-12 flex flex-col gap-4">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Process</span>
        <h2 className="max-w-2xl text-4xl font-medium tracking-tight lg:text-5xl">
          Go from application to active developer in three steps
        </h2>
      </div>

      {/* Tab selector */}
      <div className="mb-10 flex gap-0 border-b border-border">
        {DEV_STEPS.map((step) => (
          <button key={step.value} onClick={() => setActive(step.value)}
            className={cn("relative px-6 py-3 text-sm font-mono uppercase tracking-[0.06em] transition-colors duration-200",
              active === step.value ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
            {step.label}
            <span className={cn("absolute bottom-0 left-0 h-0.5 w-full bg-foreground transition-all duration-300",
              active === step.value ? "opacity-100" : "opacity-0")} />
          </button>
        ))}
      </div>

      {/* Content */}
      <div key={active} className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 lg:items-center animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="space-y-6">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Step {content.num}</span>
          <h3 className="text-3xl font-medium tracking-tight">{content.title}</h3>
          <p className="leading-relaxed text-muted-foreground">{content.description}</p>
          <Button className="rounded-full gap-2" onClick={active !== "review" ? onStart : undefined}
            {...(active === "review" ? { asChild: true } : {})}>
            {active === "review"
              ? <a href="#what-you-get">{content.cta}<ArrowRight className="size-4" /></a>
              : <>{content.cta}<ArrowRight className="size-4" /></>
            }
          </Button>
          <p className="text-xs text-muted-foreground">
            Trusted by{" "}
            <span className="font-mono font-medium text-foreground">1,000+</span>{" "}
            engineers worldwide
          </p>
        </div>
        <div>{content.mockup}</div>
      </div>
    </section>
  );
};

// ── FAQ accordion ─────────────────────────────────────────────────────────────
const DevFaq = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-24 container mx-auto px-6">
      <div className="mx-auto mb-14 max-w-xl text-center">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">FAQ</span>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight lg:text-5xl">Frequently asked questions</h2>
      </div>
      <div className="mx-auto max-w-2xl border-t border-border">
        {faqs.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="border-b border-border">
              <button onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-start justify-between gap-4 py-6 text-left">
                <span className="text-base font-medium leading-snug">{item.q}</span>
                <ChevronDown className={cn("size-4 text-muted-foreground shrink-0 mt-0.5 transition-transform duration-300", isOpen && "rotate-180")} />
              </button>
              <div className={cn("grid transition-all duration-300 ease-in-out", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                <div className="overflow-hidden">
                  <p className="pb-6 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const ApplyHero = ({ onStart }: ApplyHeroProps) => {
  return (
    <>
      <Navbar />

      {/* ── 1. Hero ── */}
      <section className="pt-20 pb-0">
        <div className="container mx-auto px-6">
          {/* Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-4 py-1.5">
              <span className="size-2 rounded-full bg-pulse animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Join 1,000+ Engineers Worldwide
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="mt-8 text-center text-5xl font-medium tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
            Earn Above Your
            <br />
            Local Market.
            <br />
            <span className="text-pulse">Build Global Products.</span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-8 max-w-xl text-center text-base text-muted-foreground sm:text-lg">
            Join our network and get matched with top companies in the US, UK,
            and Europe. Hourly, monthly, or annual contracts — you choose what
            works for you.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" className="rounded-full px-6 gap-2" onClick={onStart}>
              Apply Now
              <ArrowRight className="size-4 -rotate-45" />
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-6">
              <a href="#process">How It Works</a>
            </Button>
          </div>

          {/* Country label */}
          <p className="mt-16 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Engineers from 30+ countries
          </p>
        </div>

        {/* Country flag carousel — full width */}
        <div className="relative mt-6 pb-20">
          <Carousel
            plugins={[AutoScroll({ playOnInit: true, speed: 0.4, stopOnInteraction: false })]}
            opts={{ loop: true, align: "start" }}
          >
            <CarouselContent className="ml-0">
              {allCountries.map((country, i) => (
                <CarouselItem
                  key={`${country.isoCode}-${i}`}
                  className="basis-1/4 pl-0 pr-4 sm:basis-1/5 md:basis-1/6 lg:basis-1/8 xl:basis-1/10"
                >
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={`https://flagcdn.com/w40/${country.isoCode.toLowerCase()}.png`}
                      srcSet={`https://flagcdn.com/w80/${country.isoCode.toLowerCase()}.png 2x`}
                      alt={country.name}
                      className="h-8 w-auto rounded-sm shadow-sm"
                      width={40}
                      height={27}
                    />
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {country.name}
                    </span>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-linear-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-linear-to-l from-background to-transparent" />
        </div>
      </section>

      {/* ── 2. Features bento ── */}
      <section id="what-you-get" className="py-24 container mx-auto px-6">
        <div className="mb-16 flex flex-col gap-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            What You Get
          </span>
          <h2 className="max-w-2xl text-4xl font-medium tracking-tight lg:text-5xl xl:text-6xl">
            The network built to match, pay, and support at scale
          </h2>
        </div>

        {/* Top row */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-border bg-muted/30 p-6 space-y-5">
            <div className="rounded-2xl bg-background border border-border p-4">
              <RateShowcase />
            </div>
            <div className="space-y-2 px-2">
              <h3 className="text-lg font-semibold">Earn what your skills are worth</h3>
              <p className="text-sm text-muted-foreground">
                Get matched to global companies at rates that reflect your seniority and stack — above your local market, with full transparency before any interview.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-muted/30 p-6 space-y-5">
            <div className="rounded-2xl bg-background border border-border p-4">
              <OpportunityFeed />
            </div>
            <div className="space-y-2 px-2">
              <h3 className="text-lg font-semibold">Roles matched to your exact profile</h3>
              <p className="text-sm text-muted-foreground">
                No mass applications. Once approved, we match you to relevant roles from vetted companies — and you decide if you&apos;re interested.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-4 rounded-3xl border border-border bg-muted/30 p-8 md:p-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Your Journey</span>
              <h3 className="text-3xl font-medium tracking-tight">Apply once. Open multiple doors.</h3>
              <p className="text-muted-foreground">
                Submit your profile in under 10 minutes. We review, verify, and start matching you to roles — you focus on choosing what fits. Every opportunity comes with full rate transparency up front.
              </p>
              <ul className="space-y-3">
                {["One application, unlimited role matches", "Rates disclosed before any interview", "Contracts and compliance fully managed", "Ongoing support throughout your engagement"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm">
                    <CheckCircle className="size-4 shrink-0 text-pulse" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button className="rounded-full gap-2" onClick={onStart}>
                Start Your Application
                <ArrowRight className="size-4" />
              </Button>
            </div>
            <JourneyMockup />
          </div>
        </div>
      </section>

      {/* ── 3. How it works ── */}
      <div id="process">
        <DevHowItWorks onStart={onStart} />
      </div>

      {/* ── 4. Earnings calculator ── */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="mb-10 flex flex-col gap-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Earnings</span>
            <h2 className="max-w-2xl text-4xl font-medium tracking-tight lg:text-5xl">
              See what you could earn
            </h2>
          </div>
          <EarningsCalculator />
        </div>
      </section>

      {/* ── 5. Role tracks ── */}
      <section className="py-24 container mx-auto px-6">
        <div className="mb-16 flex flex-col gap-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Specialisations
          </span>
          <h2 className="max-w-2xl text-4xl font-medium tracking-tight lg:text-5xl">
            Pick the path that fits your strengths
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {roleTracks.map((item) => (
            <Card key={item.label} className="group border-border/70 transition-colors hover:border-pulse/40">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                    <item.icon className="size-5 text-pulse" />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{item.label}</p>
                    <CardTitle className="text-base">{item.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{item.summary}</p>

                {/* Tech stack icons */}
                <div className="flex flex-wrap gap-2">
                  {item.stack.map((s) => (
                    <div key={s.label} className="flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.icon} alt="" className="size-4" />
                      <span className="text-[11px] font-medium">{s.label}</span>
                    </div>
                  ))}
                </div>

                <ul className="space-y-1.5">
                  {item.focus.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Sparkles className="size-3.5 text-pulse" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button variant="ghost" size="sm" className="gap-1.5 px-0 text-pulse hover:text-pulse" onClick={onStart}>
                  Apply for this track
                  <ArrowRight className="size-3.5" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── 6. Benefits grid ── */}
      <section className="py-24 container mx-auto px-6">
        <div className="mb-16 flex flex-col gap-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Benefits</span>
          <h2 className="max-w-2xl text-4xl font-medium tracking-tight lg:text-5xl">
            Focus on your craft. We handle the rest.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {devBenefits.map(({ icon: Icon, title, description }) => (
            <div key={title} className="bg-background p-8 space-y-4">
              <div className="flex size-10 items-center justify-center rounded-xl border border-border">
                <Icon className="size-5 text-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. Testimonials ── */}
      <section className="py-24 container mx-auto px-6">
        <div className="mb-16 flex flex-col gap-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Testimonials</span>
          <h2 className="max-w-2xl text-4xl font-medium tracking-tight lg:text-5xl">
            You&apos;re in good company.
          </h2>
        </div>
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.name} className="bg-background p-8 flex flex-col justify-between gap-6">
              <blockquote className="text-xl font-medium leading-snug lg:text-2xl">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <Avatar className="size-10 ring-2 ring-border">
                  <AvatarImage src={item.image} alt={item.name} />
                  <AvatarFallback className="text-xs font-semibold">
                    {item.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 8. CTA band ── */}
      <section className="dark bg-background py-16 text-foreground">
        <div className="container mx-auto px-6">
          <div className="relative grid grid-cols-1 overflow-hidden rounded-[0.75rem] px-8 pt-10 pb-12 xl:grid-cols-2 xl:px-15.5 xl:pb-12">
            <div className="flex flex-col gap-5 md:gap-7">
              <h2 className="text-4xl tracking-tight md:text-5xl lg:text-6xl">
                <span className="block font-semibold text-pulse">Apply today.</span>
                <span className="font-normal">One profile, multiple global opportunities.</span>
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl">
                Join the network and let the right roles come to you.
              </p>
              <ul className="grid max-w-[36.25rem] grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                {ctaList.map((item) => (
                  <li key={item.text} className="flex items-center gap-3">
                    <item.icon className="size-5 stroke-white" />
                    <span className="font-mono text-xs tracking-[0.06em] text-white">{item.text}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="w-full md:w-fit hover:bg-pulse hover:text-pulse-foreground rounded-full gap-2" onClick={onStart}>
                  Apply as a Developer
                  <ArrowRight className="size-4" />
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full gap-2">
                  <Link href="/login">
                    Already in the network
                    <Trophy className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hidden xl:flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                {[
                  { value: "1,000+", label: "Engineers vetted" },
                  { value: "Top 3%", label: "Acceptance rate" },
                  { value: "48h", label: "Match timeline" },
                  { value: "30+", label: "Countries" },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg border border-white/10 bg-white/5 p-6 text-center">
                    <p className="font-mono text-3xl font-semibold text-pulse">{s.value}</p>
                    <p className="mt-1 font-mono text-xs uppercase tracking-wider text-white/60">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. FAQ ── */}
      <DevFaq />

      <Footer />
    </>
  );
};

export { ApplyHero };
