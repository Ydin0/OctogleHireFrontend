"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Check, FileText, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

interface FeaturesShowcaseProps {
  className?: string;
}

const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

// ── Profiles: featured-developer photos + hero names ────────────────────────
const MATCHES = [
  {
    name: "Priya Sharma",
    role: "Senior Full-Stack",
    rate: "$65/hr",
    match: "98%",
    image: "/featured-developers/01.png",
  },
  {
    name: "Arjun Kumar",
    role: "Backend Engineer",
    rate: "$60/hr",
    match: "95%",
    image: "/featured-developers/02.png",
  },
  {
    name: "Rohan Mehta",
    role: "Platform Engineer",
    rate: "$70/hr",
    match: "93%",
    image: "/featured-developers/04.png",
  },
];

const TEAM = [
  { name: "Priya Sharma", role: "Senior Full-Stack", image: "/featured-developers/01.png" },
  { name: "Arjun Kumar", role: "Backend Engineer", image: "/featured-developers/02.png" },
  { name: "Rohan Mehta", role: "Platform Engineer", image: "/featured-developers/04.png" },
];

const ROLE_TYPE = "Senior React Engineer";
const ROLE_STACKS = [
  { label: "React", icon: `${DEVICON}/react/react-original.svg` },
  { label: "TypeScript", icon: `${DEVICON}/typescript/typescript-original.svg` },
  { label: "Node.js", icon: `${DEVICON}/nodejs/nodejs-original.svg` },
  { label: "Postgres", icon: `${DEVICON}/postgresql/postgresql-original.svg` },
];

const ENGAGEMENT_CHECKS = [
  "Contracts signed",
  "Payroll configured",
  "Slack + GitHub access",
  "Kickoff scheduled",
];

// ── Step 1: Post a Role — typewriter title + staggered stack chips ──────────
const PostRoleMockup = () => {
  const [typed, setTyped] = useState("");
  const [chipsVisible, setChipsVisible] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let mounted = true;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const run = () => {
      if (!mounted) return;
      setTyped("");
      setChipsVisible(0);
      setSubmitted(false);

      // Typewriter
      ROLE_TYPE.split("").forEach((_, i) => {
        timers.push(
          setTimeout(() => {
            if (!mounted) return;
            setTyped(ROLE_TYPE.slice(0, i + 1));
          }, 90 * (i + 1)),
        );
      });

      const afterType = 90 * ROLE_TYPE.length + 300;

      // Stack chips stagger in
      ROLE_STACKS.forEach((_, i) => {
        timers.push(
          setTimeout(() => {
            if (!mounted) return;
            setChipsVisible(i + 1);
          }, afterType + i * 160),
        );
      });

      // Submit button pulse
      timers.push(
        setTimeout(() => {
          if (!mounted) return;
          setSubmitted(true);
        }, afterType + ROLE_STACKS.length * 160 + 500),
      );

      // Loop
      timers.push(setTimeout(run, afterType + ROLE_STACKS.length * 160 + 2800));
    };

    run();
    return () => {
      mounted = false;
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-background p-5 space-y-4 shadow-sm">
      {/* Role title input */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Role
        </span>
        <div className="rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-sm font-medium min-h-[40px] flex items-center">
          <span>{typed}</span>
          <span
            className={cn(
              "ml-0.5 inline-block h-4 w-px bg-foreground transition-opacity",
              typed.length < ROLE_TYPE.length ? "animate-pulse opacity-100" : "opacity-0",
            )}
          />
        </div>
      </div>

      {/* Stack chips */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Stack
        </span>
        <div className="flex flex-wrap gap-1.5 min-h-[30px]">
          {ROLE_STACKS.map((stack, i) => (
            <span
              key={stack.label}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-medium transition-all duration-400",
                i < chipsVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-1",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={stack.icon} alt="" className="size-3" />
              {stack.label}
            </span>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="button"
        tabIndex={-1}
        className={cn(
          "w-full rounded-full border border-border bg-foreground text-background text-xs font-semibold uppercase tracking-wider py-2.5 transition-all duration-500",
          submitted ? "shadow-[0_0_0_4px_oklch(from_var(--pulse)_l_c_h_/_0.15)]" : "",
        )}
      >
        Post role
      </button>
    </div>
  );
};

// ── Step 2: 48h Delivery — loading → matches fade in sequentially ───────────
const MatchesMockup = () => {
  const [phase, setPhase] = useState<"loading" | "results">("loading");
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const run = () => {
      if (!mounted) return;
      setPhase("loading");
      setVisibleCount(0);

      timers.push(
        setTimeout(() => {
          if (!mounted) return;
          setPhase("results");

          MATCHES.forEach((_, i) => {
            timers.push(
              setTimeout(() => {
                if (!mounted) return;
                setVisibleCount(i + 1);
              }, i * 280),
            );
          });

          timers.push(setTimeout(run, MATCHES.length * 280 + 3200));
        }, 1100),
      );
    };

    run();
    return () => {
      mounted = false;
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-background p-5 space-y-3 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Your Matches</p>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[10px] font-medium">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Delivered in 48h
        </span>
      </div>

      {phase === "loading" ? (
        <div className="space-y-3 pt-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="size-10 rounded-full bg-muted shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-2.5 rounded-full bg-muted w-28" />
                <div className="h-2 rounded-full bg-muted w-20" />
              </div>
              <div className="space-y-1.5 shrink-0 text-right">
                <div className="h-2.5 rounded-full bg-muted w-14 ml-auto" />
                <div className="h-2 rounded-full bg-muted w-12 ml-auto" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2.5 pt-1">
          {MATCHES.map((m, i) => (
            <div
              key={m.name}
              className={cn(
                "flex items-center gap-3 rounded-xl border border-transparent p-2 -mx-2 transition-all duration-500",
                i < visibleCount
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2",
              )}
            >
              <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-muted ring-1 ring-border">
                <Image
                  src={m.image}
                  alt={m.name}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
                <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-background bg-emerald-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">{m.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {m.role}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-mono font-semibold">{m.rate}</p>
                <p className="text-[10px] font-mono text-pulse">
                  {m.match} match
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Step 3: Engagement — checks tick off, team goes live ────────────────────
const EngagementMockup = () => {
  const [checkedCount, setCheckedCount] = useState(0);
  const [teamLive, setTeamLive] = useState(false);

  useEffect(() => {
    let mounted = true;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const run = () => {
      if (!mounted) return;
      setCheckedCount(0);
      setTeamLive(false);

      ENGAGEMENT_CHECKS.forEach((_, i) => {
        timers.push(
          setTimeout(() => {
            if (!mounted) return;
            setCheckedCount(i + 1);
          }, 500 + i * 480),
        );
      });

      timers.push(
        setTimeout(
          () => {
            if (!mounted) return;
            setTeamLive(true);
          },
          500 + ENGAGEMENT_CHECKS.length * 480 + 200,
        ),
      );

      timers.push(
        setTimeout(
          run,
          500 + ENGAGEMENT_CHECKS.length * 480 + 3200,
        ),
      );
    };

    run();
    return () => {
      mounted = false;
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-background p-5 space-y-4 shadow-sm">
      {/* Team header — avatars + live badge */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex -space-x-2.5">
          {TEAM.map((t, i) => (
            <div
              key={t.name}
              className={cn(
                "relative size-9 overflow-hidden rounded-full ring-2 ring-background transition-all duration-500",
                teamLive ? "opacity-100 translate-y-0" : "opacity-60 translate-y-0.5",
              )}
              style={{ transitionDelay: `${i * 80}ms`, zIndex: TEAM.length - i }}
            >
              <Image
                src={t.image}
                alt={t.name}
                fill
                sizes="36px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition-all duration-500",
            teamLive
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "border-border bg-muted/40 text-muted-foreground",
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full transition-colors",
              teamLive ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/40",
            )}
          />
          {teamLive ? "Live" : "Activating"}
        </span>
      </div>

      {/* Engagement checks */}
      <div className="space-y-2.5">
        {ENGAGEMENT_CHECKS.map((item, i) => {
          const isChecked = i < checkedCount;
          const isActive = i === checkedCount;

          return (
            <div key={item} className="flex items-center gap-2.5">
              <span
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                  isChecked
                    ? "border-transparent bg-pulse"
                    : isActive
                      ? "border-pulse animate-pulse"
                      : "border-border",
                )}
              >
                {isChecked && (
                  <Check
                    className="size-2.5 text-background"
                    strokeWidth={3}
                  />
                )}
              </span>
              <span
                className={cn(
                  "text-xs transition-colors duration-300",
                  isChecked ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {item}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Step shell ──────────────────────────────────────────────────────────────
const Step = ({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <div className="relative flex flex-col rounded-3xl border border-border bg-muted/30 p-5 md:p-6">
    {/* Mockup */}
    <div className="mb-6">{children}</div>

    {/* Label */}
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="inline-flex size-6 items-center justify-center rounded-full border border-border bg-background font-mono text-[10px] font-semibold">
          {number}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Step {number}
        </span>
      </div>
      <h3 className="text-lg font-semibold leading-tight">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

// ── Main section ─────────────────────────────────────────────────────────────
const FeaturesShowcase = ({ className }: FeaturesShowcaseProps) => {
  return (
    <section className={cn("py-24 container mx-auto px-6", className)}>
      {/* Header */}
      <div className="mb-14 flex flex-col items-center gap-4 text-center">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <Sparkles className="size-3" />
          The Process
        </span>
        <h2 className="max-w-3xl text-4xl font-medium tracking-tight lg:text-5xl">
          From role posted to team shipped — in{" "}
          <span className="font-mono text-pulse">48 hours</span>
        </h2>
        <p className="max-w-xl text-base text-muted-foreground">
          Three simple steps. No recruitment agencies, no 6-week pipelines, no
          upfront fees.
        </p>
      </div>

      {/* 3-step grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Step
          number="01"
          title="Post your role"
          description="Jump on a 15-minute call — tell us the role, stack, timeline, and budget. We turn it into a vetted brief that same day."
        >
          <PostRoleMockup />
        </Step>

        <Step
          number="02"
          title="Matched in 48 hours"
          description="Receive 3–5 hand-picked, pre-vetted profiles. Every engineer has already passed our 5-stage assessment."
        >
          <MatchesMockup />
        </Step>

        <Step
          number="03"
          title="Start engagement"
          description="Pick your hires. We handle contracts, payroll, and compliance across 30+ countries — your team ships in days."
        >
          <EngagementMockup />
        </Step>
      </div>

      {/* Footer strip */}
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <FileText className="size-3.5" />
          <span>
            No upfront fees — you only pay when you hire. 14-day replacement
            guarantee.
          </span>
        </div>
      </div>
    </section>
  );
};

export { FeaturesShowcase };
