"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { Rating } from "@/components/shadcnblocks/rating";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { EarningsCalculator } from "@/app/developers/join/_components/earnings-calculator";

interface ApplyHeroProps {
  onStart: () => void;
}

// ── Orbiting circles ──────────────────────────────────────────────────────────
const circle1Images = [
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
];
const circle2Images = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
];
const circle3Images = [
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face",
];

// ── Logo carousel ─────────────────────────────────────────────────────────────
const logos = [
  { id: "l1", src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-1.svg", h: "h-6" },
  { id: "l2", src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-2.svg", h: "h-6" },
  { id: "l3", src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-3.svg", h: "h-6" },
  { id: "l4", src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-4.svg", h: "h-6" },
  { id: "l5", src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-5.svg", h: "h-5" },
  { id: "l6", src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-6.svg", h: "h-6" },
  { id: "l7", src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-7.svg", h: "h-6" },
  { id: "l8", src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/astro-wordmark.svg", h: "h-6" },
];

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
    ourRate: 65,
    localRate: 30,
  },
  {
    title: "Backend Engineer",
    tags: [
      { label: "Python", icon: `${DI}/python/python-original.svg` },
      { label: "Django", icon: `${DI}/django/django-plain.svg` },
      { label: "PostgreSQL", icon: `${DI}/postgresql/postgresql-original.svg` },
    ],
    ourRate: 55,
    localRate: 24,
  },
  {
    title: "DevOps Engineer",
    tags: [
      { label: "AWS", icon: `${DI}/amazonwebservices/amazonwebservices-original-wordmark.svg` },
      { label: "Kubernetes", icon: `${DI}/kubernetes/kubernetes-original.svg` },
      { label: "Terraform", icon: `${DI}/terraform/terraform-original.svg` },
    ],
    ourRate: 70,
    localRate: 33,
  },
];

const opportunities = [
  { company: "Vercel", role: "Senior Full-Stack", rate: "$65/hr", match: "98%", logo: "https://assets.vercel.com/image/upload/front/favicon/vercel/60x60.png" },
  { company: "Stripe", role: "Backend Engineer", rate: "$60/hr", match: "94%", logo: "https://images.stripeassets.com/fzn2n1nzq965/HTTOloNPhisV9P4hlMPNA/cacf1bb88b9fc492dfad34378d844280/Stripe_icon_-_square.svg" },
  { company: "Linear", role: "ML Engineer", rate: "$75/hr", match: "91%", logo: "https://linear.app/static/apple-touch-icon.png" },
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
  },
  {
    icon: Code,
    label: "Backend",
    title: "Build scalable core systems",
    summary: "For engineers who enjoy architecture, reliability, and high-throughput service design.",
    focus: ["Distributed systems", "Cloud + observability", "Performance tuning"],
  },
  {
    icon: Brain,
    label: "AI / Data",
    title: "Ship applied AI products",
    summary: "Work on LLM pipelines, data infrastructure, and production machine learning systems.",
    focus: ["LLM integrations", "Data modeling", "Evaluation frameworks"],
  },
  {
    icon: Smartphone,
    label: "Mobile",
    title: "Build product experiences people keep",
    summary: "Own modern mobile app development with fast release loops and meaningful user impact.",
    focus: ["React Native / Swift / Kotlin", "Performance + UX polish", "App store lifecycle"],
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
    title: "Flexible Engagements",
    description: "Hourly, contract, or full-time. Build the working arrangement that suits your life, not the other way around.",
  },
];

// ── Testimonials ──────────────────────────────────────────────────────────────
const testimonials = [
  {
    name: "Aisha M.",
    title: "Senior Backend Engineer",
    quote: "I stopped mass-applying and got two strong interview loops in my first week after approval.",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Mateo R.",
    title: "Full-Stack Developer",
    quote: "The role briefs were clear, compensation was transparent, and the process respected my time.",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Nina K.",
    title: "ML Engineer",
    quote: "I joined for contract work and ended up in a long-term, high-impact AI product team.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1542204625-de293a2f3d29?w=400&h=400&fit=crop&crop=face",
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
    a: "Every application goes through 5 stages: profile review, stack-specific technical assessment, live system design interview, background check, and reference verification. Only the top 5% of applicants are approved.",
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
  const uplift = Math.round(((role.ourRate - role.localRate) / role.localRate) * 100);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
      <div key={key} className="space-y-4 animate-in fade-in duration-300">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">{role.title}</p>
          <Badge variant="secondary" className="font-mono text-[10px]">+{uplift}% vs local</Badge>
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
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-muted/60 p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Local market</p>
            <p className="mt-1 font-mono text-lg font-medium text-muted-foreground line-through decoration-muted-foreground/40">${role.localRate}/hr</p>
          </div>
          <div className="rounded-lg border border-border bg-muted/20 p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">OctogleHire</p>
            <p className="mt-1 font-mono text-lg font-semibold text-pulse">${role.ourRate}/hr</p>
          </div>
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
                <p className="text-xs font-mono font-medium">{o.rate}</p>
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

const ProfileMockup = () => (
  <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
    <p className="text-sm font-semibold">Developer Profile</p>
    <div className="space-y-3">
      <div className="rounded-lg bg-muted px-4 py-3">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Full name</p>
        <p className="text-sm font-medium">Arjun Kumar</p>
      </div>
      <div className="rounded-lg bg-muted px-4 py-3">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Tech stack</p>
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
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-muted px-4 py-3">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Experience</p>
          <p className="text-sm font-medium">6 years</p>
        </div>
        <div className="rounded-lg bg-muted px-4 py-3">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Rate</p>
          <p className="text-sm font-mono font-medium">$65/hr</p>
        </div>
      </div>
    </div>
    <Button className="w-full rounded-full" size="sm">Submit Application</Button>
  </div>
);

const ReviewMockup = () => (
  <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
    <div className="flex items-center justify-between">
      <p className="text-sm font-semibold">Application Review</p>
      <Badge variant="outline" className="text-[10px]">In Progress</Badge>
    </div>
    <div className="space-y-2">
      {[
        { step: "Application received", done: true, active: false },
        { step: "Technical review", done: true, active: false },
        { step: "Experience verification", done: false, active: true },
        { step: "Final approval", done: false, active: false },
      ].map(({ step, done, active }) => (
        <div key={step} className={cn("flex items-center gap-3 rounded-lg px-4 py-2.5 transition-colors",
          done ? "bg-pulse/10" : active ? "bg-muted border border-border" : "bg-muted/50")}>
          <div className={cn("size-2 rounded-full shrink-0", done ? "bg-pulse" : active ? "bg-foreground animate-pulse" : "bg-border")} />
          <span className={cn("text-sm", !done && !active && "text-muted-foreground")}>{step}</span>
          {done && <span className="ml-auto text-[10px] font-mono text-pulse uppercase tracking-wider">Done</span>}
          {active && <span className="ml-auto text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Active</span>}
        </div>
      ))}
    </div>
    <div className="rounded-xl border bg-muted/40 p-4 text-center">
      <p className="text-xs text-muted-foreground">Expected response</p>
      <p className="mt-1 font-mono text-3xl font-semibold">48h</p>
    </div>
  </div>
);

const RoleMatchMockup = () => {
  const roles = [
    { company: "Vercel", role: "Senior Full-Stack", rate: "$65/hr", score: "98%", logo: "https://assets.vercel.com/image/upload/front/favicon/vercel/60x60.png" },
    { company: "Stripe", role: "Backend Engineer", rate: "$60/hr", score: "94%", logo: "https://images.stripeassets.com/fzn2n1nzq965/HTTOloNPhisV9P4hlMPNA/cacf1bb88b9fc492dfad34378d844280/Stripe_icon_-_square.svg" },
    { company: "Linear", role: "ML Engineer", rate: "$75/hr", score: "91%", logo: "https://linear.app/static/apple-touch-icon.png" },
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
            <p className="font-mono text-sm font-medium">{r.rate}</p>
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
  const allLogos = [...logos, ...logos];

  return (
    <>
      <Navbar />

      {/* ── 1. Hero ── */}
      <section className="pt-8 pb-0">
        <div className="container mx-auto px-6">
          <div className="relative">
            <div className="flex w-full items-center justify-center">
              {/* Center overlay */}
              <div className="absolute z-99 flex h-full w-full flex-col items-center justify-center gap-4">
                <div className="pointer-events-none absolute inset-y-0 top-1/2 left-1/2 h-1/3 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-background blur-2xl" />

                <Button variant="secondary" className="group relative z-10 flex w-fit items-center justify-center gap-3 rounded-full bg-muted/70 px-5 py-1">
                  <span className="size-2.5 rounded-full bg-pulse animate-pulse" />
                  <span className="text-xs">Join 1,000+ Engineers Worldwide</span>
                </Button>

                <h1 className="relative z-10 max-w-3xl text-center text-5xl font-medium tracking-tight md:text-7xl">
                  Earn More. Work
                  <br />
                  <span className="text-pulse">On Your Terms.</span>
                </h1>

                <p className="relative z-10 mt-3 max-w-xl text-center text-muted-foreground/80">
                  Get matched to top global companies at rates that reflect your
                  skills. We handle contracts, payroll, and compliance — you
                  focus on building.
                </p>

                <div className="relative z-10 mt-4 flex gap-4">
                  <Button variant="secondary" className="group flex w-fit items-center justify-center gap-2 rounded-full px-4 py-1 tracking-tight" asChild>
                    <a href="#process">
                      <span>How it works</span>
                      <ArrowRight className="size-4 -rotate-45 transition-all ease-out group-hover:ml-3 group-hover:rotate-0" />
                    </a>
                  </Button>
                  <Button variant="default" className="group flex w-fit items-center justify-center gap-2 rounded-full px-4 py-1 tracking-tight" onClick={onStart}>
                    <span>Apply Now</span>
                    <ArrowRight className="size-4 -rotate-45 transition-all ease-out group-hover:ml-3 group-hover:rotate-0" />
                  </Button>
                </div>
              </div>

              {/* Orbiting circles */}
              <div className="pointer-events-none relative z-0 flex h-[840px] w-full flex-col items-center justify-center overflow-x-clip">
                <OrbitingCircles iconSize={44} radius={180} speed={0.5}>
                  {circle1Images.map((src, i) => (
                    <div key={i} className="size-11 overflow-hidden rounded-full">
                      <img src={src} className="size-full object-cover" alt="" />
                    </div>
                  ))}
                </OrbitingCircles>
                <OrbitingCircles iconSize={44} radius={280} reverse speed={0.4}>
                  {circle2Images.map((src, i) => (
                    <div key={i} className="size-11 overflow-hidden rounded-full">
                      <img src={src} className="size-full object-cover" alt="" />
                    </div>
                  ))}
                </OrbitingCircles>
                <OrbitingCircles iconSize={44} radius={380} speed={0.3}>
                  {circle3Images.map((src, i) => (
                    <div key={i} className="size-11 overflow-hidden rounded-full">
                      <img src={src} className="size-full object-cover" alt="" />
                    </div>
                  ))}
                </OrbitingCircles>
              </div>
            </div>
          </div>
        </div>

        {/* ── Logo carousel ── */}
        <div className="pb-20">
          <p className="mb-6 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Work with teams at
          </p>
          <div className="relative">
            <Carousel plugins={[AutoScroll({ playOnInit: true, speed: 0.6 })]} opts={{ loop: true, align: "start" }}>
              <CarouselContent className="ml-0">
                {allLogos.map((logo, i) => (
                  <CarouselItem key={`${logo.id}-${i}`} className="basis-1/3 pl-0 pr-10 sm:basis-1/4 md:basis-1/5 lg:basis-1/7 xl:basis-1/8">
                    <div className="flex h-12 items-center justify-center opacity-30">
                      <img src={logo.src} alt="" className={cn("w-auto", logo.h)} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-linear-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-linear-to-l from-background to-transparent" />
          </div>
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
                Get matched to global companies at rates that reflect your seniority and stack — typically 40–60% above local market, with full transparency before any interview.
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
          <div className="mb-16 flex flex-col gap-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Earnings</span>
            <h2 className="max-w-2xl text-4xl font-medium tracking-tight lg:text-5xl">
              Estimate your rate by role, stack, and experience
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
          <p className="text-muted-foreground">You don&apos;t have to trust our word.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <Card key={item.name} className="border-border/70 bg-card/90">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-11 w-11 overflow-hidden rounded-full border border-border/70">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{item.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">{item.title}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Rating rate={item.rating} showScore />
                <p className="mt-3 text-sm text-muted-foreground">{item.quote}</p>
              </CardContent>
            </Card>
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
                  { value: "$65+", label: "Avg. hourly rate" },
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
