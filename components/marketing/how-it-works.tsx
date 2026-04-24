"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  MessagesSquare,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface HowItWorksProps {
  className?: string;
}

const STAGES = [
  {
    num: "01",
    icon: MessagesSquare,
    name: "HR + Communication Screen",
    subtitle: "Live English fluency and product-mindset interview",
    duration: "30 min",
    pass: 40,
    funnel: "25,000 → 10,000",
    isAi: false,
  },
  {
    num: "02",
    icon: Sparkles,
    name: "AI-Led Technical Interview",
    subtitle:
      "30–50 min adaptive interview tailored to the candidate's CV and role criteria",
    duration: "30–50 min",
    pass: 40,
    funnel: "10,000 → 4,000",
    isAi: true,
  },
  {
    num: "03",
    icon: UserRound,
    name: "Tech Lead Interview",
    subtitle:
      "Face-to-face with one of our senior tech leads — system design & judgement",
    duration: "60–90 min",
    pass: 40,
    funnel: "4,000 → 1,600",
    isAi: false,
  },
  {
    num: "04",
    icon: ShieldCheck,
    name: "Background + Reference Checks",
    subtitle: "Work-history verification, ID, and three professional references",
    duration: "3d",
    pass: 63,
    funnel: "1,600 → 1,000",
    isAi: false,
  },
];

// ── Progress bar that animates from 0 to target width ───────────────────────
const StageRow = ({
  stage,
  active,
  index,
}: {
  stage: (typeof STAGES)[number];
  active: boolean;
  index: number;
}) => {
  const Icon = stage.icon;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-background p-4 transition-all duration-500",
        active
          ? stage.isAi
            ? "border-pulse/50 shadow-[0_0_0_1px_oklch(from_var(--pulse)_l_c_h_/_0.2),0_8px_24px_-12px_oklch(from_var(--pulse)_l_c_h_/_0.35)]"
            : "border-pulse/30 shadow-[0_0_0_1px_oklch(from_var(--pulse)_l_c_h_/_0.12)]"
          : "border-border",
      )}
      style={{
        transitionDelay: `${index * 40}ms`,
      }}
    >
      {/* AI stage — subtle animated gradient wash */}
      {stage.isAi && (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 transition-opacity duration-700",
            active ? "opacity-100" : "opacity-0",
          )}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(from_var(--pulse)_l_c_h_/_0.14),transparent_60%)]" />
          <div className="absolute -right-8 -top-8 size-32 rounded-full bg-pulse/10 blur-2xl animate-pulse" />
        </div>
      )}

      <div className="relative flex items-center gap-3">
        {/* Stage number bubble */}
        <span
          className={cn(
            "inline-flex size-9 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] font-semibold transition-all duration-500",
            active
              ? "border-pulse bg-pulse text-background"
              : "border-border bg-muted/40 text-muted-foreground",
          )}
        >
          {stage.num}
        </span>

        {/* Icon + name */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Icon
              className={cn(
                "size-3.5 transition-colors duration-500 shrink-0",
                active ? "text-pulse" : "text-muted-foreground",
                stage.isAi && active && "animate-pulse",
              )}
              strokeWidth={1.75}
            />
            <p className="text-sm font-semibold truncate">{stage.name}</p>
            {stage.isAi && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider shrink-0 transition-all duration-500",
                  active
                    ? "border-pulse/40 bg-pulse/10 text-pulse"
                    : "border-border text-muted-foreground",
                )}
              >
                <Sparkles className="size-2.5" strokeWidth={2} />
                AI
              </span>
            )}
          </div>
          <p className="mt-0.5 text-[11px] text-muted-foreground truncate">
            {stage.subtitle}
          </p>
        </div>

        {/* Duration chip */}
        <span
          className={cn(
            "font-mono text-[10px] uppercase tracking-wider rounded-full border px-2 py-0.5 shrink-0 transition-colors duration-500",
            active
              ? "border-pulse/30 text-pulse"
              : "border-border text-muted-foreground",
          )}
        >
          {stage.duration}
        </span>
      </div>

      {/* Progress track with pass rate + funnel count */}
      <div className="relative mt-3 flex items-center gap-3">
        <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "absolute inset-y-0 left-0 transition-all duration-[900ms] ease-out",
              stage.isAi
                ? "bg-gradient-to-r from-pulse via-pulse to-pulse/80"
                : "bg-pulse",
              active ? "opacity-100" : "opacity-40",
            )}
            style={{ width: active ? `${stage.pass}%` : "0%" }}
          />
          {stage.isAi && active && (
            <div
              className="absolute inset-y-0 left-0 w-12 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent"
              style={{ maxWidth: `${stage.pass}%` }}
            />
          )}
        </div>
        <span
          className={cn(
            "font-mono text-[10px] shrink-0 tabular-nums transition-colors duration-500",
            active ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {stage.pass}%
        </span>
        <span className="font-mono text-[10px] text-muted-foreground shrink-0 tabular-nums">
          {stage.funnel}
        </span>
      </div>
    </div>
  );
};

// ── Main pipeline: stages reveal sequentially, then loop ────────────────────
const VettingPipeline = () => {
  const [activeCount, setActiveCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  // Start only when in viewport
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    let mounted = true;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const run = () => {
      if (!mounted) return;
      setActiveCount(0);

      STAGES.forEach((_, i) => {
        timers.push(
          setTimeout(
            () => {
              if (!mounted) return;
              setActiveCount(i + 1);
            },
            700 * (i + 1),
          ),
        );
      });

      timers.push(
        setTimeout(
          run,
          700 * (STAGES.length + 1) + 3000,
        ),
      );
    };

    run();
    return () => {
      mounted = false;
      timers.forEach(clearTimeout);
    };
  }, [inView]);

  const complete = activeCount === STAGES.length;

  return (
    <div
      ref={ref}
      className="rounded-3xl border border-border bg-muted/30 p-5 md:p-6"
    >
      {/* Header inside card */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-sm font-semibold">The Gauntlet</p>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider rounded-full border border-border bg-background px-2.5 py-1 text-muted-foreground">
          4-Stage Pipeline
        </span>
      </div>

      {/* Stages */}
      <div className="space-y-2">
        {STAGES.map((stage, i) => (
          <StageRow
            key={stage.num}
            stage={stage}
            active={i < activeCount}
            index={i}
          />
        ))}
      </div>

      {/* Final accepted capsule */}
      <div
        className={cn(
          "mt-3 rounded-2xl border-2 border-dashed p-4 transition-all duration-700",
          complete
            ? "border-pulse/50 bg-pulse/[0.06]"
            : "border-border bg-background",
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className={cn(
                "inline-flex size-7 items-center justify-center rounded-full transition-all duration-500",
                complete
                  ? "bg-pulse text-background"
                  : "border border-border bg-muted/40 text-muted-foreground",
              )}
            >
              <ShieldCheck className="size-3.5" strokeWidth={2} />
            </span>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Accepted into network
              </p>
              <p className="font-mono text-lg font-semibold leading-tight">
                1,000 engineers
              </p>
            </div>
          </div>
          <span
            className={cn(
              "font-mono text-[10px] uppercase tracking-wider rounded-full px-2.5 py-1 shrink-0 transition-all duration-500",
              complete
                ? "bg-pulse text-background"
                : "border border-border text-muted-foreground",
            )}
          >
            {complete ? "4% pass rate" : "Pending"}
          </span>
        </div>
      </div>
    </div>
  );
};

// ── Main section ─────────────────────────────────────────────────────────────
const HowItWorks = ({ className }: HowItWorksProps) => {
  return (
    <section
      id="how-it-works"
      className={cn("py-24 container mx-auto px-6", className)}
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
        {/* Left: headline + stats + bullets + CTA */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <ShieldCheck className="size-3" />
              How We Vet
            </div>
            <h2 className="text-4xl font-medium tracking-tight lg:text-5xl">
              Only{" "}
              <span className="font-mono text-pulse">1 in 25</span>{" "}
              engineers make it through
            </h2>
            <p className="max-w-xl text-base text-muted-foreground leading-relaxed">
              Every engineer in our network passes a five-stage gauntlet — not a
              take-home and a vibe check. Technical depth, system design
              judgement, communication, and background checks are all verified
              before a single profile reaches your shortlist.
            </p>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-4 border-y border-border py-6">
            <div className="space-y-1">
              <p className="font-mono text-3xl font-semibold tracking-tight tabular-nums">
                25K+
              </p>
              <p className="text-xs text-muted-foreground leading-tight">
                Applications reviewed
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-mono text-3xl font-semibold tracking-tight tabular-nums">
                1,000
              </p>
              <p className="text-xs text-muted-foreground leading-tight">
                Engineers in network
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-mono text-3xl font-semibold tracking-tight tabular-nums text-pulse">
                4%
              </p>
              <p className="text-xs text-muted-foreground leading-tight">
                Acceptance rate
              </p>
            </div>
          </div>

          {/* What we test */}
          <ul className="space-y-3 text-sm">
            {[
              "Live HR + English fluency screen before any technical stage",
              "Adaptive 30–50 min AI-led interview tuned to the candidate's CV and role brief",
              "Face-to-face interview with one of our senior tech leads",
              "Background verification, ID, and three professional references",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-pulse" />
                <span className="text-foreground/80">{item}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="flex flex-wrap gap-3">
            <Button asChild className="rounded-full gap-2">
              <a href="/how-we-vet">
                See our full playbook
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="rounded-full gap-2 text-muted-foreground hover:text-foreground"
            >
              <a href="/marketplace">
                Browse engineers
                <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>
        </div>

        {/* Right: animated pipeline */}
        <VettingPipeline />
      </div>
    </section>
  );
};

export { HowItWorks, VettingPipeline };
