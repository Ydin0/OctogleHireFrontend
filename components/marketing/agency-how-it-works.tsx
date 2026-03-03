"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Copy, Link as LinkIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AgencyHowItWorksProps {
  className?: string;
}

const STEPS = [
  { value: "register", label: "Register" },
  { value: "source", label: "Source" },
  { value: "earn", label: "Earn" },
] as const;

type StepValue = (typeof STEPS)[number]["value"];

// ── Register mockup ──────────────────────────────────────────────────────────
const RegisterMockup = () => {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Agency Registration</p>
        <Badge variant="outline" className="text-[10px]">
          Step 1 of 3
        </Badge>
      </div>

      {[
        { label: "Agency Name", value: "Acme Recruiting" },
        { label: "Contact Name", value: "Sarah Chen" },
        { label: "Email", value: "sarah@acme-recruiting.com" },
      ].map((field) => (
        <div key={field.label} className="rounded-lg bg-muted px-4 py-3">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
            {field.label}
          </p>
          <p className="text-sm font-medium">{field.value}</p>
        </div>
      ))}

      <Button className="w-full rounded-full" size="sm">
        Get Started
      </Button>
    </div>
  );
};

// ── Source mockup — referral link + staggered candidate list ──────────────────
const candidates = [
  { name: "Arjun Kumar", role: "React Engineer" },
  { name: "Priya Sharma", role: "Python Developer" },
  { name: "Rohan Mehta", role: "Full-Stack Engineer" },
];

const SourceMockup = () => {
  const [show, setShow] = useState(false);
  const [cycleKey, setCycleKey] = useState(0);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const run = () => {
      setShow(false);
      setCycleKey((k) => k + 1);
      t = setTimeout(() => {
        setShow(true);
        t = setTimeout(run, 4000);
      }, 800);
    };
    run();
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
      {/* Referral link */}
      <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-3">
        <LinkIcon className="size-3.5 shrink-0 text-muted-foreground" />
        <span className="flex-1 truncate font-mono text-xs">
          octoglehire.com/apply/a/acme-recruit
        </span>
        <Copy className="size-3.5 shrink-0 text-muted-foreground" />
      </div>

      {/* Candidate list */}
      <div className="space-y-3" key={cycleKey}>
        {show ? (
          candidates.map((c, i) => (
            <div
              key={c.name}
              className="flex items-center gap-3 rounded-lg border border-border p-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
              style={{
                animationDelay: `${i * 150}ms`,
                animationFillMode: "backwards",
              }}
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-[10px]">
                {c.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{c.name}</p>
                <p className="text-[10px] text-muted-foreground">{c.role}</p>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-600">
                Submitted
              </span>
            </div>
          ))
        ) : (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border border-border p-3 animate-pulse"
              >
                <div className="size-8 rounded-full bg-muted shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-2.5 rounded-full bg-muted w-24" />
                  <div className="h-2 rounded-full bg-muted w-16" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Earn mockup — commission counting up ─────────────────────────────────────
const EarnMockup = () => {
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const target = 12400;
    const duration = 2000;
    const start = performance.now();

    let frame: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAmount(Math.round(eased * target));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Commission Summary</p>
        <Badge variant="outline" className="text-[10px]">
          This quarter
        </Badge>
      </div>

      <div className="rounded-xl border border-border bg-muted/40 p-6 text-center">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Total Earned
        </p>
        <p className="mt-2 font-mono text-4xl font-semibold text-pulse">
          ${amount.toLocaleString()}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border p-3 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Placements
          </p>
          <p className="mt-1 font-mono text-lg font-semibold">5</p>
        </div>
        <div className="rounded-lg border border-border p-3 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Commission Rate
          </p>
          <p className="mt-1 font-mono text-lg font-semibold text-pulse">
            10%
          </p>
        </div>
      </div>
    </div>
  );
};

const stepContent: Record<
  StepValue,
  {
    num: string;
    title: string;
    description: string;
    cta: string;
    href: string;
  }
> = {
  register: {
    num: "01",
    title: "Register your agency",
    description:
      "Create your organization account, get approved, and receive your unique referral code. The entire process takes under 5 minutes — no paperwork, no fees.",
    cta: "Register Now",
    href: "/agencies/signup",
  },
  source: {
    num: "02",
    title: "Source & submit candidates",
    description:
      "Share your branded referral link with candidates. When they apply through your link, they're automatically attributed to your agency. Track every submission in real-time from your dashboard.",
    cta: "See How It Works",
    href: "#features",
  },
  earn: {
    num: "03",
    title: "Earn commissions on every placement",
    description:
      "When a candidate you submitted gets placed, you earn a commission on every engagement. Transparent rates, real-time tracking, and reliable payouts — no chasing invoices.",
    cta: "Start Earning",
    href: "/agencies/signup",
  },
};

const stepMockups: Record<StepValue, React.ReactNode> = {
  register: <RegisterMockup />,
  source: <SourceMockup />,
  earn: <EarnMockup />,
};

const AgencyHowItWorks = ({ className }: AgencyHowItWorksProps) => {
  const [active, setActive] = useState<StepValue>("register");
  const content = stepContent[active];

  return (
    <section
      id="how-it-works"
      className={cn("py-24 container mx-auto px-6", className)}
    >
      {/* Header */}
      <div className="mb-12 flex flex-col gap-4">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Process
        </span>
        <h2 className="max-w-2xl text-4xl font-medium tracking-tight lg:text-5xl">
          Start earning in three simple steps
        </h2>
      </div>

      {/* Tab selector */}
      <div className="mb-10 flex gap-0 border-b border-border">
        {STEPS.map((step) => (
          <button
            key={step.value}
            onClick={() => setActive(step.value)}
            className={cn(
              "relative px-6 py-3 text-sm font-mono uppercase tracking-[0.06em] transition-colors duration-200",
              active === step.value
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {step.label}
            <span
              className={cn(
                "absolute bottom-0 left-0 h-0.5 w-full bg-foreground transition-all duration-300",
                active === step.value ? "opacity-100" : "opacity-0",
              )}
            />
          </button>
        ))}
      </div>

      {/* Content */}
      <div
        key={active}
        className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 lg:items-center animate-in fade-in slide-in-from-bottom-2 duration-300"
      >
        {/* Left: text */}
        <div className="space-y-6">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Step {content.num}
          </span>
          <h3 className="text-3xl font-medium tracking-tight">
            {content.title}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {content.description}
          </p>
          <Button asChild className="rounded-full gap-2">
            <a href={content.href}>
              {content.cta}
              <ArrowRight className="size-4" />
            </a>
          </Button>
          <p className="text-xs text-muted-foreground">
            Trusted by{" "}
            <span className="font-mono font-medium text-foreground">
              recruitment agencies
            </span>{" "}
            worldwide
          </p>
        </div>

        {/* Right: mockup */}
        <div>{stepMockups[active]}</div>
      </div>
    </section>
  );
};

export { AgencyHowItWorks };
