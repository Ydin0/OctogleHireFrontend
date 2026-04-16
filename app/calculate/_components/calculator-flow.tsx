"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  Code2,
  Container,
  Figma,
  Laptop,
  Layers,
  Loader2,
  Search,
  Shield,
  Smartphone,
  Sparkles,
  Star,
  TestTube,
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
  { id: "junior", label: "Junior", sub: "1-2 years" },
  { id: "mid", label: "Mid-Level", sub: "3-5 years" },
  { id: "senior", label: "Senior", sub: "6+ years" },
] as const;

const markets = [
  { id: "UK", label: "United Kingdom", flag: "gb", currency: "£" },
  { id: "US", label: "United States", flag: "us", currency: "$" },
  { id: "Germany", label: "Germany", flag: "de", currency: "€" },
  { id: "Australia", label: "Australia", flag: "au", currency: "A$" },
] as const;

const timelines = [
  { id: "immediate", label: "Immediately", sub: "ASAP" },
  { id: "2-4-weeks", label: "2-4 Weeks", sub: "Soon" },
  { id: "1-2-months", label: "1-2 Months", sub: "Planning" },
  { id: "exploring", label: "Just Exploring", sub: "No rush" },
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

  // Calculate annual savings
  const { annualSavings, displayCurrency, monthlySavings, savingsPercent } = useMemo(() => {
    if (!role || !seniority || !market) {
      return { annualSavings: 0, displayCurrency: "$", monthlySavings: 0, savingsPercent: 0 };
    }
    const rateKey = role.rateKey as RoleKey;
    const rates = RATE_DATA[rateKey][seniority.id as Seniority][market.id as MarketKey];
    const monthly = (rates.local - rates.octogle) * teamSize;
    const annual = monthly * 12;
    const pct = Math.round(((rates.local - rates.octogle) / rates.local) * 100);
    return {
      annualSavings: annual,
      displayCurrency: market.currency,
      monthlySavings: monthly,
      savingsPercent: pct,
    };
  }, [role, seniority, market, teamSize]);

  // Show counter from step 2 onward
  const showCounter = step >= 2 && step !== 7;

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
    <div className="flex min-h-[100dvh] flex-col bg-background overflow-x-hidden pb-24 lg:pb-0">
      {/* Header */}
      <header className="relative flex items-center justify-center px-6 py-5">
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

      {/* Progress dots */}
      {step < 7 && (
        <div className="flex justify-center gap-2 pb-2">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s === step ? "w-8 bg-foreground" : s < step ? "w-1.5 bg-foreground/40" : "w-1.5 bg-foreground/15"
              }`}
            />
          ))}
        </div>
      )}

      {/* Floating savings counter */}
      {showCounter && (
        <BlurredCounter value={annualSavings} currency={displayCurrency} revealed={revealed} />
      )}

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center justify-center px-5 pb-8 sm:px-6">
        <div className="w-full max-w-lg">
          {/* STEP 1 — Role */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-6 text-center sm:mb-8">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Step 1 of 6
                </p>
                <h1 className="text-xl font-semibold tracking-tight sm:text-3xl">
                  What kind of developer are you hiring?
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  This helps us calculate accurate market rates.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {roles.map((r) => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        setRole(r);
                        setStep(2);
                      }}
                      className="group flex items-center gap-3 rounded-xl border border-border/60 bg-background px-3.5 py-3.5 text-left transition-all hover:border-foreground/30 hover:bg-muted/50 active:scale-[0.98] sm:px-4 sm:py-4"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 transition-colors group-hover:bg-foreground/10 sm:size-9">
                        <Icon className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
                      </div>
                      <span className="text-sm font-medium">{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2 — Seniority */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-6 text-center sm:mb-8">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Step 2 of 6
                </p>
                <h1 className="text-xl font-semibold tracking-tight sm:text-3xl">
                  How experienced should they be?
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Different experience levels = different cost savings.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
                {seniorities.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSeniority(s);
                      setStep(3);
                    }}
                    className="group flex flex-col items-center gap-1 rounded-xl border border-border/60 bg-background px-4 py-5 text-center transition-all hover:border-foreground/30 hover:bg-muted/50 active:scale-[0.98]"
                  >
                    <span className="text-sm font-medium">{s.label}</span>
                    <span className="text-[11px] text-muted-foreground">{s.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3 — Market */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-6 text-center sm:mb-8">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Step 3 of 6
                </p>
                <h1 className="text-xl font-semibold tracking-tight sm:text-3xl">
                  Where would you normally hire from?
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  We&rsquo;ll compare your local market rates against ours.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {markets.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setMarket(m);
                      setStep(4);
                    }}
                    className="group flex items-center gap-3 rounded-xl border border-border/60 bg-background px-4 py-4 text-left transition-all hover:border-foreground/30 hover:bg-muted/50 active:scale-[0.98]"
                  >
                    <img
                      src={`https://flagcdn.com/w40/${m.flag}.png`}
                      alt={m.label}
                      className="h-6 w-auto rounded-sm shadow-sm"
                      width={40}
                      height={27}
                    />
                    <span className="text-sm font-medium">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4 — Team size */}
          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-8 text-center">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Step 4 of 6
                </p>
                <h1 className="text-xl font-semibold tracking-tight sm:text-3xl">
                  How many developers do you need?
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  More devs = bigger savings.
                </p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-muted/20 p-6">
                <div className="mb-6 text-center">
                  <p className="font-mono text-5xl font-bold tracking-tight">
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
                className="mt-6 w-full rounded-full"
                onClick={() => setStep(5)}
              >
                Continue
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          )}

          {/* STEP 5 — Timeline */}
          {step === 5 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-6 text-center sm:mb-8">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Step 5 of 6
                </p>
                <h1 className="text-xl font-semibold tracking-tight sm:text-3xl">
                  How soon do you need them?
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Almost there — last question.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {timelines.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTimeline(t);
                      setStep(6);
                    }}
                    className="group flex flex-col items-center gap-1 rounded-xl border border-border/60 bg-background px-4 py-5 text-center transition-all hover:border-foreground/30 hover:bg-muted/50 active:scale-[0.98]"
                  >
                    <span className="text-sm font-medium">{t.label}</span>
                    <span className="text-[11px] text-muted-foreground">{t.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6 — Reveal form */}
          {step === 6 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-6 text-center sm:mb-8">
                <div className="mx-auto mb-4 flex w-fit items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-500">
                  <Sparkles className="size-3" />
                  Your savings are ready
                </div>
                <h1 className="text-xl font-semibold tracking-tight sm:text-3xl">
                  Where should we send your savings report?
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Enter your details to reveal your personalised savings figure and book a call.
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
                  className="w-full rounded-full text-base"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      Reveal My Savings
                      <Sparkles className="ml-2 size-4" />
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-3 pt-1 text-[10px] text-muted-foreground sm:gap-4">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    60-second result
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

          {/* STEP 7 — Reveal + Calendly */}
          {step === 7 && (
            <div className="animate-in fade-in zoom-in-95 duration-500">
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-emerald-500/10">
                  <CheckCircle className="size-6 text-emerald-500" />
                </div>
                <h1 className="text-xl font-semibold tracking-tight sm:text-3xl">
                  Here&rsquo;s your potential savings, {contactFirstName}
                </h1>
              </div>

              <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-emerald-500/0 p-6">
                <BlurredCounter
                  value={annualSavings}
                  currency={displayCurrency}
                  revealed={true}
                  variant="inline"
                />
                <div className="grid grid-cols-3 gap-3 border-t border-border/60 pt-4">
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Per Month
                    </p>
                    <p className="font-mono text-sm font-semibold">
                      {displayCurrency}
                      {monthlySavings.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Cost Cut
                    </p>
                    <p className="font-mono text-sm font-semibold text-emerald-500">
                      -{savingsPercent}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Team Size
                    </p>
                    <p className="font-mono text-sm font-semibold">
                      {teamSize}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-3 text-center">
                <p className="text-sm font-medium">
                  Book a 15-min call to claim these savings
                </p>
                <p className="text-xs text-muted-foreground">
                  Receive your shortlist of pre-vetted developers within 48 hours.
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
          Trusted by <span className="font-semibold text-foreground">300+</span> businesses
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

