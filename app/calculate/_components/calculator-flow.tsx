"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Bolt,
  Calculator,
  CheckCircle,
  Clock,
  Code2,
  Container,
  Figma,
  Flame,
  Laptop,
  Layers,
  Loader2,
  Search,
  Shield,
  Smartphone,
  Sparkles,
  Star,
  TestTube,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";

import { Logo } from "@/components/logo";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/phone-input";
import { Slider } from "@/components/ui/slider";
import {
  companyLeadSchema,
  type CompanyLead,
} from "@/lib/schemas/company-enquiry";
import { trackMetaEvent } from "@/lib/analytics/meta-events";
import { useCalendlyLead } from "@/lib/analytics/use-calendly-lead";
import { BlurredCounter } from "./blurred-counter";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
const CALENDLY_URL = "https://calendly.com/yaseen-octogle/30min";

/* ── Data ────────────────────────────────────────────────────────────────── */

const roles = [
  { id: "frontend", label: "Frontend", icon: Laptop, rateKey: "Frontend Engineer" },
  { id: "backend", label: "Backend", icon: Code2, rateKey: "Backend Engineer" },
  { id: "fullstack", label: "Full-Stack", icon: Layers, rateKey: "Full-Stack Engineer" },
  { id: "devops", label: "DevOps", icon: Container, rateKey: "DevOps Engineer" },
  { id: "mobile", label: "Mobile", icon: Smartphone, rateKey: "Full-Stack Engineer" },
  { id: "designer", label: "Designer", icon: Figma, rateKey: "Frontend Engineer" },
  { id: "qa", label: "QA", icon: TestTube, rateKey: "Backend Engineer" },
  { id: "other", label: "Other", icon: Search, rateKey: "Full-Stack Engineer" },
] as const;

const seniorities = [
  { id: "junior", label: "Junior", sub: "1-2 years", emoji: "🌱" },
  { id: "mid", label: "Mid-Level", sub: "3-5 years", emoji: "⚡" },
  { id: "senior", label: "Senior", sub: "6+ years", emoji: "🚀" },
] as const;

const markets = [
  { id: "UK", label: "United Kingdom", flag: "gb", currency: "£" },
  { id: "US", label: "United States", flag: "us", currency: "$" },
  { id: "Germany", label: "Germany", flag: "de", currency: "€" },
  { id: "Australia", label: "Australia", flag: "au", currency: "A$" },
] as const;

const timelines = [
  { id: "immediate", label: "Immediately", sub: "ASAP", emoji: "🔥" },
  { id: "2-4-weeks", label: "2-4 Weeks", sub: "Soon", emoji: "⏱️" },
  { id: "1-2-months", label: "1-2 Months", sub: "Planning", emoji: "📅" },
  { id: "exploring", label: "Just Exploring", sub: "No rush", emoji: "👀" },
] as const;

type RoleKey = "Frontend Engineer" | "Backend Engineer" | "Full-Stack Engineer" | "DevOps Engineer";
type Seniority = "junior" | "mid" | "senior";
type MarketKey = "US" | "UK" | "Germany" | "Australia";

const RATE_DATA: Record<
  RoleKey,
  Record<Seniority, Record<MarketKey, { local: number; octogle: number }>>
> = {
  "Frontend Engineer": {
    junior: { US: { local: 6500, octogle: 2500 }, UK: { local: 4800, octogle: 2250 }, Germany: { local: 4500, octogle: 2125 }, Australia: { local: 5200, octogle: 2375 } },
    mid: { US: { local: 9500, octogle: 4000 }, UK: { local: 7500, octogle: 3500 }, Germany: { local: 7000, octogle: 3250 }, Australia: { local: 8000, octogle: 3750 } },
    senior: { US: { local: 12500, octogle: 5625 }, UK: { local: 9500, octogle: 4750 }, Germany: { local: 8500, octogle: 4375 }, Australia: { local: 10000, octogle: 5000 } },
  },
  "Full-Stack Engineer": {
    junior: { US: { local: 6000, octogle: 2375 }, UK: { local: 4500, octogle: 2125 }, Germany: { local: 4200, octogle: 2000 }, Australia: { local: 5000, octogle: 2250 } },
    mid: { US: { local: 9000, octogle: 3750 }, UK: { local: 7000, octogle: 3250 }, Germany: { local: 6500, octogle: 3000 }, Australia: { local: 7500, octogle: 3500 } },
    senior: { US: { local: 12000, octogle: 5250 }, UK: { local: 9000, octogle: 4375 }, Germany: { local: 8000, octogle: 4000 }, Australia: { local: 9500, octogle: 4750 } },
  },
  "Backend Engineer": {
    junior: { US: { local: 6200, octogle: 2250 }, UK: { local: 4600, octogle: 2000 }, Germany: { local: 4300, octogle: 1875 }, Australia: { local: 5000, octogle: 2125 } },
    mid: { US: { local: 9200, octogle: 3750 }, UK: { local: 7200, octogle: 3250 }, Germany: { local: 6800, octogle: 3000 }, Australia: { local: 7800, octogle: 3500 } },
    senior: { US: { local: 12500, octogle: 5375 }, UK: { local: 9200, octogle: 4500 }, Germany: { local: 8500, octogle: 4125 }, Australia: { local: 10000, octogle: 4875 } },
  },
  "DevOps Engineer": {
    junior: { US: { local: 6800, octogle: 2625 }, UK: { local: 5000, octogle: 2375 }, Germany: { local: 4800, octogle: 2250 }, Australia: { local: 5500, octogle: 2500 } },
    mid: { US: { local: 10000, octogle: 4250 }, UK: { local: 8000, octogle: 3750 }, Germany: { local: 7500, octogle: 3500 }, Australia: { local: 8500, octogle: 4000 } },
    senior: { US: { local: 13500, octogle: 6000 }, UK: { local: 10000, octogle: 5000 }, Germany: { local: 9500, octogle: 4625 }, Australia: { local: 11000, octogle: 5375 } },
  },
};

const avatars = [
  { src: "/review-1.jpg", alt: "Client" },
  { src: "/review-2.jpg", alt: "Client" },
  { src: "/review-3.jpg", alt: "Client" },
  { src: "/review-4.jpg", alt: "Client" },
];

/* Step badges — show what was just locked in */
const stepRewards = [
  { label: "Role locked in", icon: CheckCircle },
  { label: "Seniority confirmed", icon: CheckCircle },
  { label: "Market set", icon: CheckCircle },
  { label: "Team size locked", icon: CheckCircle },
  { label: "Timeline added", icon: CheckCircle },
];

/* ── Component ───────────────────────────────────────────────────────────── */

export function CalculatorFlow() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<(typeof roles)[number] | null>(null);
  const [seniority, setSeniority] = useState<(typeof seniorities)[number] | null>(null);
  const [market, setMarket] = useState<(typeof markets)[number] | null>(null);
  const [teamSize, setTeamSize] = useState(2);
  const [timeline, setTimeline] = useState<(typeof timelines)[number] | null>(null);
  const [contactFirstName, setContactFirstName] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showReward, setShowReward] = useState(false);

  useCalendlyLead(step === 7);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CompanyLead>({
    resolver: zodResolver(companyLeadSchema),
    mode: "onTouched",
  });

  const phoneValue = watch("phone") ?? "";

  // Calculate annual savings (works after step 1 too — uses defaults)
  const { annualSavings, displayCurrency, monthlySavings, savingsPercent } = useMemo(() => {
    if (!role) return { annualSavings: 0, displayCurrency: "$", monthlySavings: 0, savingsPercent: 0 };

    const rateKey = role.rateKey as RoleKey;
    const sen = (seniority?.id ?? "mid") as Seniority;
    const mkt = (market?.id ?? "UK") as MarketKey;
    const cur = market?.currency ?? "£";
    const rates = RATE_DATA[rateKey][sen][mkt];
    const monthly = (rates.local - rates.octogle) * teamSize;
    const annual = monthly * 12;
    const pct = Math.round(((rates.local - rates.octogle) / rates.local) * 100);

    return {
      annualSavings: annual,
      displayCurrency: cur,
      monthlySavings: monthly,
      savingsPercent: pct,
    };
  }, [role, seniority, market, teamSize]);

  // Show counter from step 2 onwards
  const showCounter = step >= 2 && step !== 7;

  // Trigger reward badge animation when step changes
  useEffect(() => {
    if (step >= 2 && step <= 6) {
      setShowReward(true);
      const t = setTimeout(() => setShowReward(false), 2000);
      return () => clearTimeout(t);
    }
  }, [step]);

  const onSubmit = async (data: CompanyLead) => {
    setApiError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/public/company-enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { message?: string };
        setApiError(body.message ?? "Something went wrong. Please try again.");
        return;
      }

      trackMetaEvent("Lead", {
        content_name: "Calculator",
        content_category: "ad_landing",
        content_type: role?.id,
        seniority: seniority?.id,
        market: market?.id,
        team_size: teamSize,
        timeline: timeline?.id,
        annual_savings: annualSavings,
        currency: market?.currency,
      });

      setContactFirstName(data.contactName.split(" ")[0]);
      setRevealed(true);
      setStep(7);
    } catch {
      setApiError("Unable to connect. Please check your connection and try again.");
    }
  };

  const goBack = () => {
    if (step > 1 && step < 7) setStep(step - 1);
  };

  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-background overflow-x-hidden pb-28 lg:pb-32">
      {/* ── Decorative animated background ────────────────────── */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* Animated dot grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)] [background-size:20px_20px]" />
        {/* Floating orbs */}
        <div className="absolute -top-40 left-1/4 size-[500px] rounded-full bg-pulse-500/[0.04] blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 size-[600px] rounded-full bg-pulse/[0.03] blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-center px-6 py-5">
        {step > 1 && step < 7 && (
          <button
            onClick={goBack}
            className="absolute left-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Back
          </button>
        )}
        <Link href="/">
          <Logo width={120} height={28} />
        </Link>
      </header>

      {/* Reward popup — shows briefly when step changes */}
      {showReward && step >= 2 && step <= 6 && (
        <div className="pointer-events-none fixed inset-x-0 top-20 z-50 flex justify-center px-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2 rounded-full border border-pulse-500/30 bg-pulse-500/10 px-4 py-2 text-xs font-semibold text-pulse-500 shadow-lg backdrop-blur-md">
            <Sparkles className="size-3.5" />
            +{step === 2 ? "20" : step === 3 ? "20" : step === 4 ? "30" : step === 5 ? "20" : "10"}% accuracy unlocked
          </div>
        </div>
      )}

      {/* Floating savings counter */}
      {showCounter && (
        <BlurredCounter
          value={annualSavings}
          currency={displayCurrency}
          revealed={revealed}
          step={step - 1}
          totalSteps={5}
        />
      )}

      {/* Main content */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 pb-8 sm:px-6">
        <div className="w-full max-w-lg">
          {/* ═══════════════════════════════════════════
              STEP 1 — Hero + Role selection
              ═══════════════════════════════════════════ */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Hero */}
              <div className="mb-8 text-center sm:mb-10">
                {/* Main title */}
                <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
                  How much could{" "}
                  <span className="bg-gradient-to-r from-pulse-400 to-pulse-600 bg-clip-text text-transparent">
                    you save
                  </span>
                  ?
                </h1>
                <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
                  Take this <strong className="text-foreground">60-second quiz</strong> to see exactly how much your dev team could save with OctogleHire.
                </p>

                {/* Stats row */}
                <div className="mx-auto mt-6 flex max-w-sm items-center justify-center gap-4 text-[10px] sm:gap-6 sm:text-xs">
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-3 text-pulse-500" />
                    <span className="text-muted-foreground">
                      <strong className="font-mono text-foreground">60</strong>s
                    </span>
                  </div>
                  <div className="h-3 w-px bg-border" />
                  <div className="flex items-center gap-1.5">
                    <Trophy className="size-3 text-amber-500" />
                    <span className="text-muted-foreground">
                      Avg saving{" "}
                      <strong className="font-mono text-foreground">£127k</strong>
                    </span>
                  </div>
                  <div className="h-3 w-px bg-border" />
                  <div className="flex items-center gap-1.5">
                    <Bolt className="size-3 text-pulse" />
                    <span className="text-muted-foreground">
                      <strong className="font-mono text-foreground">300+</strong>{" "}
                      teams
                    </span>
                  </div>
                </div>
              </div>

              {/* Step badge */}
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-full bg-pulse-500/10 text-xs font-bold text-pulse-500">
                    1
                  </div>
                  <p className="text-sm font-semibold">Pick your role</p>
                </div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Step 1 / 6
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {roles.map((r, i) => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        setRole(r);
                        setStep(2);
                      }}
                      className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-border/60 bg-background/60 px-3.5 py-3.5 text-left transition-all hover:-translate-y-0.5 hover:border-pulse-500/40 hover:bg-muted/40 hover:shadow-lg hover:shadow-pulse-500/5 active:scale-[0.98] sm:px-4 sm:py-4"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted/60 transition-all group-hover:bg-pulse-500/15 group-hover:text-pulse-500">
                        <Icon className="size-4 text-muted-foreground transition-colors group-hover:text-pulse-500" />
                      </div>
                      <span className="text-sm font-medium">{r.label}</span>
                      <ArrowRight className="ml-auto size-3.5 text-muted-foreground/0 transition-all group-hover:translate-x-0.5 group-hover:text-pulse-500" />
                    </button>
                  );
                })}
              </div>

              {/* Trust line under tiles */}
              <div className="mt-6 flex items-center justify-center gap-2">
                <span className="inline-flex items-center -space-x-2">
                  {avatars.map((avatar, i) => (
                    <Avatar
                      key={i}
                      className="size-5 border-2 border-background ring-1 ring-border/30"
                    >
                      <AvatarImage src={avatar.src} alt={avatar.alt} />
                    </Avatar>
                  ))}
                </span>
                <p className="text-[10px] text-muted-foreground">
                  Joined by <strong className="text-foreground">300+</strong> companies this month
                </p>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-2.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════
              STEP 2 — Seniority
              ═══════════════════════════════════════════ */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <StepHeader stepNum={2} totalSteps={6} title="How experienced?" sub="Different levels = different savings." />

              <div className="grid grid-cols-1 gap-3">
                {seniorities.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSeniority(s);
                      setStep(3);
                    }}
                    className="group flex items-center gap-4 rounded-xl border border-border/60 bg-background/60 px-5 py-4 text-left transition-all hover:-translate-y-0.5 hover:border-pulse-500/40 hover:bg-muted/40 hover:shadow-lg hover:shadow-pulse-500/5 active:scale-[0.98]"
                  >
                    <span className="text-2xl">{s.emoji}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{s.label}</p>
                      <p className="text-xs text-muted-foreground">{s.sub}</p>
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-pulse-500" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════
              STEP 3 — Market
              ═══════════════════════════════════════════ */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <StepHeader stepNum={3} totalSteps={6} title="Where do you hire from?" sub="We'll compare your local market vs ours." />

              <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
                {markets.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setMarket(m);
                      setStep(4);
                    }}
                    className="group flex items-center gap-4 rounded-xl border border-border/60 bg-background/60 px-5 py-4 text-left transition-all hover:-translate-y-0.5 hover:border-pulse-500/40 hover:bg-muted/40 hover:shadow-lg hover:shadow-pulse-500/5 active:scale-[0.98]"
                  >
                    <img
                      src={`https://flagcdn.com/w80/${m.flag}.png`}
                      alt={m.label}
                      className="h-7 w-auto rounded shadow-md"
                      width={60}
                      height={40}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{m.label}</p>
                      <p className="text-xs text-muted-foreground">
                        Currency: <span className="font-mono">{m.currency}</span>
                      </p>
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-pulse-500" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════
              STEP 4 — Team size
              ═══════════════════════════════════════════ */}
          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <StepHeader stepNum={4} totalSteps={6} title="How many developers?" sub="More devs = exponentially bigger savings." />

              <div className="rounded-2xl border border-border/60 bg-background/60 p-6 backdrop-blur-sm">
                <div className="mb-6 text-center">
                  <p className="font-mono text-7xl font-bold tracking-tight tabular-nums bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                    {teamSize}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {teamSize === 1 ? "developer" : "developers"}
                  </p>
                </div>
                <Slider
                  min={1}
                  max={15}
                  step={1}
                  value={[teamSize]}
                  onValueChange={(v: number[]) => setTeamSize(v[0] ?? 1)}
                  className="my-4"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>1</span>
                  <span>15+</span>
                </div>
              </div>

              <Button
                size="lg"
                className="mt-6 w-full rounded-full bg-gradient-to-r from-pulse-500 to-pulse-600 text-white hover:from-pulse-600 hover:to-pulse-700"
                onClick={() => setStep(5)}
              >
                Continue
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          )}

          {/* ═══════════════════════════════════════════
              STEP 5 — Timeline
              ═══════════════════════════════════════════ */}
          {step === 5 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <StepHeader stepNum={5} totalSteps={6} title="When do you need them?" sub="Almost there — last question." />

              <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
                {timelines.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTimeline(t);
                      setStep(6);
                    }}
                    className="group flex items-center gap-4 rounded-xl border border-border/60 bg-background/60 px-5 py-4 text-left transition-all hover:-translate-y-0.5 hover:border-pulse-500/40 hover:bg-muted/40 hover:shadow-lg hover:shadow-pulse-500/5 active:scale-[0.98]"
                  >
                    <span className="text-2xl">{t.emoji}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{t.label}</p>
                      <p className="text-xs text-muted-foreground">{t.sub}</p>
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-pulse-500" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════
              STEP 6 — Reveal form
              ═══════════════════════════════════════════ */}
          {step === 6 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-6 text-center">
                {/* Trophy icon */}
                <div className="relative mx-auto mb-4 flex size-16 items-center justify-center">
                  <div className="absolute inset-0 animate-pulse rounded-full bg-amber-500/20 blur-2xl" />
                  <div className="relative flex size-16 items-center justify-center rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-400/10 to-amber-600/10">
                    <Trophy className="size-7 text-amber-500" />
                  </div>
                </div>

                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-pulse-500/30 bg-pulse-500/10 px-3 py-1">
                  <Sparkles className="size-3 text-pulse-500" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-pulse-500">
                    Quiz complete
                  </span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Your savings are{" "}
                  <span className="bg-gradient-to-r from-pulse-400 to-pulse-600 bg-clip-text text-transparent">
                    locked in
                  </span>
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Enter your details to{" "}
                  <strong className="text-foreground">unlock the full breakdown</strong>{" "}
                  + book a 15-min call.
                </p>
              </div>

              <form className="space-y-3.5" onSubmit={handleSubmit(onSubmit)} noValidate>
                <input type="text" className="hidden" tabIndex={-1} autoComplete="off" {...register("website")} />

                <div className="grid gap-3.5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="contactName" className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                      Full Name
                    </Label>
                    <Input id="contactName" placeholder="Jane Smith" className="h-11" {...register("contactName")} />
                    {errors.contactName && (
                      <p className="text-xs text-destructive">{errors.contactName.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="companyName" className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                      Company Name
                    </Label>
                    <Input id="companyName" placeholder="Acme Inc." className="h-11" {...register("companyName")} />
                    {errors.companyName && (
                      <p className="text-xs text-destructive">{errors.companyName.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                    Work Email
                  </Label>
                  <Input id="email" type="email" placeholder="jane@acme.com" className="h-11" {...register("email")} />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="leadPhone" className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                    Phone Number
                  </Label>
                  <PhoneInput
                    id="leadPhone"
                    value={phoneValue}
                    onChange={(v) => setValue("phone", v, { shouldValidate: true })}
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive">{errors.phone.message}</p>
                  )}
                </div>

                {apiError && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
                    <p className="text-sm text-destructive">{apiError}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-full bg-gradient-to-r from-pulse-500 to-pulse-600 text-base text-white hover:from-pulse-600 hover:to-pulse-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 size-4" fill="currentColor" />
                      Reveal My Savings
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-3 pt-1 text-[10px] text-muted-foreground sm:gap-4">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    Instant result
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield className="size-3" />
                    No commitment
                  </span>
                </div>
              </form>

              <CompactTrustBar />
            </div>
          )}

          {/* ═══════════════════════════════════════════
              STEP 7 — Reveal + Calendly
              ═══════════════════════════════════════════ */}
          {step === 7 && (
            <div className="animate-in fade-in zoom-in-95 duration-500">
              <div className="mb-6 text-center">
                <div className="relative mx-auto mb-4 flex size-14 items-center justify-center">
                  <div className="absolute inset-0 animate-ping rounded-full bg-pulse-500/30" />
                  <div className="relative flex size-14 items-center justify-center rounded-full bg-pulse-500/10">
                    <CheckCircle className="size-7 text-pulse-500" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  🎉 {contactFirstName}, here&rsquo;s the verdict
                </h1>
              </div>

              <div className="mb-6 overflow-hidden rounded-2xl border border-pulse-500/30 bg-gradient-to-br from-pulse-500/[0.08] to-pulse-500/0 p-6">
                <BlurredCounter
                  value={annualSavings}
                  currency={displayCurrency}
                  revealed={true}
                  variant="inline"
                />
                <div className="grid grid-cols-3 gap-3 border-t border-border/40 pt-4">
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Per Month
                    </p>
                    <p className="font-mono text-base font-bold sm:text-lg">
                      {displayCurrency}
                      {monthlySavings.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Cost Cut
                    </p>
                    <p className="font-mono text-base font-bold text-pulse-500 sm:text-lg">
                      -{savingsPercent}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Team Size
                    </p>
                    <p className="font-mono text-base font-bold sm:text-lg">
                      {teamSize}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-3 text-center">
                <p className="text-sm font-semibold">
                  📅 Book a 15-min call to claim these savings
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  We&rsquo;ll send your shortlist of pre-vetted developers within 48 hours.
                </p>
              </div>

              <div className="overflow-hidden rounded-xl border border-border/60">
                <div
                  className="calendly-inline-widget"
                  data-url={CALENDLY_URL}
                  style={{ minWidth: "100%", height: "580px" }}
                />
                <Script
                  src="https://assets.calendly.com/assets/external/widget.js"
                  strategy="lazyOnload"
                />
              </div>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Can&rsquo;t find a time?{" "}
                <a href="mailto:hello@octoglehire.com" className="underline hover:text-foreground">
                  Email us directly
                </a>
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ── Step header — used on steps 2-5 ─────────────────────────────────────── */

function StepHeader({
  stepNum,
  totalSteps,
  title,
  sub,
}: {
  stepNum: number;
  totalSteps: number;
  title: string;
  sub: string;
}) {
  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-full bg-pulse-500/10 text-xs font-bold text-pulse-500">
            {stepNum}
          </div>
          <p className="text-sm font-semibold">{title}</p>
        </div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Step {stepNum} / {totalSteps}
        </p>
      </div>
      <p className="mb-6 text-sm text-muted-foreground">{sub}</p>
    </>
  );
}

/* ── Compact trust bar (only shown at step 6) ────────────────────────────── */

function CompactTrustBar() {
  return (
    <div className="mt-8 flex flex-col items-center gap-2 border-t border-border/60 pt-6">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center -space-x-2">
          {avatars.map((avatar, i) => (
            <Avatar
              key={i}
              className="size-6 border-2 border-background ring-1 ring-border/30"
            >
              <AvatarImage src={avatar.src} alt={avatar.alt} />
            </Avatar>
          ))}
        </span>
        <p className="text-[11px] text-muted-foreground">
          Trusted by <strong className="text-foreground">300+</strong> businesses
        </p>
      </div>
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="size-2.5 fill-[#E62415] text-[#E62415]" />
        ))}
        <span className="ml-1 text-[10px] font-bold">5.0 on Clutch</span>
      </div>
    </div>
  );
}
