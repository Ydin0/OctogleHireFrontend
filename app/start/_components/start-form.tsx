"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Check,
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
  Star,
  TestTube,
} from "lucide-react";

import { Logo } from "@/components/logo";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/phone-input";
import {
  companyLeadSchema,
  type CompanyLead,
} from "@/lib/schemas/company-enquiry";
import { trackMetaEvent } from "@/lib/analytics/meta-events";
import { useCalendlyLead } from "@/lib/analytics/use-calendly-lead";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
const CALENDLY_URL = "https://calendly.com/yaseen-octogle/30min";

const avatars = [
  { src: "/review-1.jpg", alt: "Client" },
  { src: "/review-2.jpg", alt: "Client" },
  { src: "/review-3.jpg", alt: "Client" },
  { src: "/review-4.jpg", alt: "Client" },
];

const roles = [
  { id: "frontend", label: "Frontend", icon: Laptop },
  { id: "backend", label: "Backend", icon: Code2 },
  { id: "fullstack", label: "Full-Stack", icon: Layers },
  { id: "devops", label: "DevOps", icon: Container },
  { id: "mobile", label: "Mobile", icon: Smartphone },
  { id: "designer", label: "Designer", icon: Figma },
  { id: "qa", label: "QA", icon: TestTube },
  { id: "other", label: "Other", icon: Search },
];

const timelines = [
  { id: "immediate", label: "Immediately", sub: "ASAP" },
  { id: "2-4-weeks", label: "2-4 Weeks", sub: "Soon" },
  { id: "1-2-months", label: "1-2 Months", sub: "Planning" },
  { id: "exploring", label: "Just Exploring", sub: "No rush" },
];

/* ── Rotating social proof quotes ────────────────────────────────────────── */

const quotes = [
  { text: "We're saving over £200k a year.", name: "Ricardo M.", company: "Beekey", avatar: "/Ricardo-Recruitment.jpg", stat: "60% saved" },
  { text: "Cutting our costs by more than half.", name: "Antonio C.", company: "Artistatours", avatar: "/review-4.jpg", stat: "59% saved" },
  { text: "Three engineers placed in under a week.", name: "Connor B.", company: "Hireflow", avatar: "/review-3.jpg", stat: "3 hired" },
  { text: "Equally skilled engineer for half the price.", name: "Eduardo M.", company: "1VA", avatar: "https://media.licdn.com/dms/image/v2/D4D03AQF1HZ_soFlz_A/profile-displayphoto-crop_800_800/B4DZqnZwyBGsAI-/0/1763745140907?e=1775692800&v=beta&t=ymhZJ57Gb1efoAix0Q_0WLZnfA4hw9_CbTjKP7JMXJE", stat: "50% saved" },
];

function RotatingQuote() {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % quotes.length);
        setFade(true);
      }, 200);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const q = quotes[idx];

  return (
    <div
      className={`flex items-center justify-center gap-3 py-4 transition-opacity duration-200 ${fade ? "opacity-100" : "opacity-0"}`}
    >
      <Avatar className="size-8 ring-1 ring-border/30 shrink-0">
        <AvatarImage src={q.avatar} alt={q.name} />
      </Avatar>
      <p className="text-center text-sm text-muted-foreground">
        &ldquo;{q.text}&rdquo;
        <span className="ml-1.5 font-medium text-foreground">
          {q.name}
        </span>
        <span className="text-muted-foreground/60">, {q.company}</span>
      </p>
      <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
        {q.stat}
      </span>
    </div>
  );
}

/* ── Trust bar — shown on every step ─────────────────────────────────────── */

function TrustBar() {
  return (
    <div className="flex flex-col items-center gap-3 pt-4">
      {/* Rotating quote */}
      <RotatingQuote />
      {/* Clutch + stars + avatars */}
      <div className="flex items-center gap-3">
        <Image
          src="/company-logos/Clutch.co Logo Dark.svg"
          alt="Clutch"
          width={60}
          height={17}
          unoptimized
          className="block dark:hidden"
        />
        <Image
          src="/company-logos/Clutch.co Logo.svg"
          alt="Clutch"
          width={60}
          height={17}
          unoptimized
          className="hidden dark:block"
        />
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="size-3 fill-[#E62415] text-[#E62415]"
            />
          ))}
        </div>
        <span className="text-xs font-bold">5.0</span>
      </div>

      {/* Avatars + trusted by */}
      <div className="flex items-center gap-2.5">
        <span className="inline-flex items-center -space-x-2">
          {avatars.map((avatar, i) => (
            <Avatar
              key={i}
              className="size-7 border-2 border-background ring-1 ring-border/30"
            >
              <AvatarImage src={avatar.src} alt={avatar.alt} />
            </Avatar>
          ))}
        </span>
        <p className="text-xs text-muted-foreground">
          Trusted by <span className="font-semibold text-foreground">300+</span> businesses
        </p>
      </div>

      {/* Certification badges */}
      <div className="flex items-center gap-4 pt-1">
        <a
          href="https://www.iafcertsearch.org/certified-entity/YgnCzSQq4p76plJ5hUNVNd5C"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/security/ISO copy.png"
            alt="ISO 27001 Certified"
            width={120}
            height={120}
            unoptimized
            className="h-10 w-auto opacity-70 transition-opacity hover:opacity-100 dark:brightness-[2] dark:contrast-75"
          />
        </a>
        <Image
          src="/security/GDPR copy.png"
          alt="GDPR Compliant"
          width={120}
          height={120}
          unoptimized
          className="h-10 w-auto opacity-70 transition-opacity hover:opacity-100 dark:brightness-[2] dark:contrast-75"
        />
        <Image
          src="/security/CCPA copy.png"
          alt="CCPA Compliant"
          width={120}
          height={120}
          unoptimized
          className="h-10 w-auto opacity-70 transition-opacity hover:opacity-100 dark:brightness-[2] dark:contrast-75"
        />
      </div>
    </div>
  );
}

/* ── Main form ───────────────────────────────────────────────────────────── */

export function StartForm() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [timeline, setTimeline] = useState("");
  const [contactFirstName, setContactFirstName] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);

  useCalendlyLead(step === 4);

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

  const selectRole = (id: string) => {
    setRole(id);
    setStep(2);
  };

  const selectTimeline = (id: string) => {
    setTimeline(id);
    setStep(3);
  };

  const onSubmit = async (data: CompanyLead) => {
    setApiError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/public/company-enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          message?: string;
        };
        setApiError(
          body.message ?? "Something went wrong. Please try again.",
        );
        return;
      }

      trackMetaEvent("Lead", {
        content_name: "Start Form",
        content_category: "ad_landing",
        content_type: role,
        status: timeline,
      });

      setContactFirstName(data.contactName.split(" ")[0]);
      setStep(4);
    } catch {
      setApiError(
        "Unable to connect. Please check your connection and try again.",
      );
    }
  };

  const goBack = () => {
    if (step > 1 && step < 4) setStep(step - 1);
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background overflow-x-hidden">
      {/* Header — centered logo + back button */}
      <header className="relative flex items-center justify-center px-6 py-5">
        {step > 1 && step < 4 && (
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
      {step < 4 && (
        <div className="flex justify-center gap-2 pb-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s === step
                  ? "w-8 bg-foreground"
                  : s < step
                    ? "w-1.5 bg-foreground/40"
                    : "w-1.5 bg-foreground/15"
              }`}
            />
          ))}
        </div>
      )}

      {/* Main content — centered */}
      <main className="flex flex-1 flex-col items-center justify-center px-5 pb-8 sm:px-6">
        <div className="w-full max-w-lg">
          {/* ── STEP 1: Role selection ────────────────────────────────── */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-6 text-center sm:mb-8">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Step 1 of 3
                </p>
                <h1 className="text-xl font-semibold tracking-tight sm:text-3xl">
                  What role are you hiring?
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Select the type of engineer you need.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {roles.map((r) => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.id}
                      onClick={() => selectRole(r.id)}
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

              <TrustBar />
            </div>
          )}

          {/* ── STEP 2: Timeline selection ────────────────────────────── */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-6 text-center sm:mb-8">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Step 2 of 3
                </p>
                <h1 className="text-xl font-semibold tracking-tight sm:text-3xl">
                  How soon do you need them?
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  This helps us prioritise your shortlist.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {timelines.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => selectTimeline(t.id)}
                    className="group flex flex-col items-center gap-1 rounded-xl border border-border/60 bg-background px-4 py-4 text-center transition-all hover:border-foreground/30 hover:bg-muted/50 active:scale-[0.98] sm:py-5"
                  >
                    <span className="text-sm font-medium">{t.label}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {t.sub}
                    </span>
                  </button>
                ))}
              </div>

              <TrustBar />
            </div>
          )}

          {/* ── STEP 3: Contact form ─────────────────────────────────── */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-6 text-center sm:mb-8">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Step 3 of 3
                </p>
                <h1 className="text-xl font-semibold tracking-tight sm:text-3xl">
                  Where should we send your shortlist?
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  We&rsquo;ll send 3-5 vetted profiles within 48 hours.
                </p>
              </div>

              <form
                className="space-y-3.5"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                {/* Honeypot */}
                <input
                  type="text"
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  {...register("website")}
                />

                <div className="grid gap-3.5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="contactName"
                      className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="contactName"
                      placeholder="Jane Smith"
                      className="h-11"
                      {...register("contactName")}
                    />
                    {errors.contactName && (
                      <p className="text-xs text-destructive">
                        {errors.contactName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="companyName"
                      className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground"
                    >
                      Company Name
                    </Label>
                    <Input
                      id="companyName"
                      placeholder="Acme Inc."
                      className="h-11"
                      {...register("companyName")}
                    />
                    {errors.companyName && (
                      <p className="text-xs text-destructive">
                        {errors.companyName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground"
                  >
                    Work Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jane@acme.com"
                    className="h-11"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="leadPhone"
                    className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground"
                  >
                    Phone Number
                  </Label>
                  <PhoneInput
                    id="leadPhone"
                    value={phoneValue}
                    onChange={(v) =>
                      setValue("phone", v, { shouldValidate: true })
                    }
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive">
                      {errors.phone.message}
                    </p>
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
                      Submitting...
                    </>
                  ) : (
                    <>
                      Get My Free Shortlist
                      <ArrowRight className="ml-2 size-4" />
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-3 pt-1 text-[10px] text-muted-foreground sm:gap-4">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    48-hour delivery
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield className="size-3" />
                    No commitment
                  </span>
                  <span className="flex items-center gap-1">
                    <Check className="size-3" />
                    100% free
                  </span>
                </div>
              </form>

              <TrustBar />
            </div>
          )}

          {/* ── STEP 4: Calendly booking ─────────────────────────────── */}
          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-emerald-500/10">
                  <CheckCircle className="size-6 text-emerald-500" />
                </div>
                <h1 className="text-xl font-semibold tracking-tight sm:text-3xl">
                  Thanks{contactFirstName ? `, ${contactFirstName}` : ""}!
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your details have been received. Book a call to discuss your
                  requirements.
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
                <a
                  href="mailto:hello@octoglehire.com"
                  className="underline hover:text-foreground"
                >
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
