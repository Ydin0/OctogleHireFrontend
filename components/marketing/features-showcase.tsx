"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle, Shield } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FeaturesShowcaseProps {
  className?: string;
}

const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

const developers = [
  {
    name: "Arjun Kumar",
    title: "Senior Full-Stack Engineer",
    location: "🇮🇳 Bengaluru",
    rate: "$65 / hr",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    stacks: [
      { label: "React", icon: `${DEVICON}/react/react-original.svg` },
      { label: "TypeScript", icon: `${DEVICON}/typescript/typescript-original.svg` },
      { label: "Node.js", icon: `${DEVICON}/nodejs/nodejs-original.svg` },
      { label: "PostgreSQL", icon: `${DEVICON}/postgresql/postgresql-original.svg` },
    ],
  },
  {
    name: "Rohan Mehta",
    title: "Frontend Engineer",
    location: "🇮🇳 Hyderabad",
    rate: "$50 / hr",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    stacks: [
      { label: "Vue.js", icon: `${DEVICON}/vuejs/vuejs-original.svg` },
      { label: "React", icon: `${DEVICON}/react/react-original.svg` },
      { label: "TypeScript", icon: `${DEVICON}/typescript/typescript-original.svg` },
      { label: "TailwindCSS", icon: `${DEVICON}/tailwindcss/tailwindcss-original.svg` },
    ],
  },
  {
    name: "Neha Tiwari",
    title: "DevOps Engineer",
    location: "🇮🇳 Pune",
    rate: "$70 / hr",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
    stacks: [
      { label: "AWS", icon: `${DEVICON}/amazonwebservices/amazonwebservices-plain-wordmark.svg` },
      { label: "Docker", icon: `${DEVICON}/docker/docker-original.svg` },
      { label: "Kubernetes", icon: `${DEVICON}/kubernetes/kubernetes-original.svg` },
      { label: "Terraform", icon: `${DEVICON}/terraform/terraform-original.svg` },
    ],
  },
];

const matches = [
  {
    name: "Priya Sharma",
    role: "Backend Engineer",
    rate: "$60/hr",
    score: "98%",
    avatar:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Rohan Mehta",
    role: "Frontend Engineer",
    rate: "$55/hr",
    score: "95%",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Neha Tiwari",
    role: "DevOps Engineer",
    rate: "$70/hr",
    score: "92%",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
  },
];

const VETTING_STEPS = [
  "Application Review",
  "Technical Assessment",
  "Live Interview",
  "Background Check",
  "Reference Verification",
];

// ── Dev card — cycles through profiles ──────────────────────────────────────
const DevCardMockup = ({
  dev,
  animKey,
}: {
  dev: (typeof developers)[0];
  animKey: number;
}) => (
  <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
    <div key={animKey} className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <Avatar className="size-11">
            <AvatarImage src={dev.avatar} alt={dev.name} />
            <AvatarFallback>{dev.name[0]}</AvatarFallback>
          </Avatar>
          <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-card bg-emerald-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{dev.name}</p>
          <p className="text-xs text-muted-foreground truncate">{dev.title}</p>
        </div>
        <Badge variant="outline" className="text-[10px] shrink-0">
          {dev.location}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {dev.stacks.map((s) => (
          <Badge key={s.label} variant="secondary" className="text-[10px] px-2 py-0.5 gap-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.icon} alt="" className="size-3" />
            {s.label}
          </Badge>
        ))}
      </div>

      <div className="border-t border-border pt-3 flex items-center justify-between">
        <span className="font-mono text-sm font-medium">{dev.rate}</span>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-muted-foreground">Available now</span>
        </div>
      </div>
    </div>
  </div>
);

// ── Match mockup — simulates 48h delivery with loading → results loop ────────
const MatchMockup = () => {
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
      }, 900);
    };

    runCycle();
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Your Matches</p>
        <Badge variant="outline" className="text-[10px]">
          Delivered in 48h
        </Badge>
      </div>

      {phase === "loading" ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="size-9 rounded-full bg-muted shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-2.5 rounded-full bg-muted w-24" />
                <div className="h-2 rounded-full bg-muted w-16" />
              </div>
              <div className="space-y-1.5 shrink-0 text-right">
                <div className="h-2.5 rounded-full bg-muted w-12 ml-auto" />
                <div className="h-2 rounded-full bg-muted w-10 ml-auto" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3" key={cycleKey}>
          {matches.map((m, i) => (
            <div
              key={m.name}
              className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-1 duration-300"
              style={{
                animationDelay: `${i * 110}ms`,
                animationFillMode: "backwards",
              }}
            >
              <Avatar className="size-9 shrink-0">
                <AvatarImage src={m.avatar} alt={m.name} />
                <AvatarFallback>{m.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{m.name}</p>
                <p className="text-[10px] text-muted-foreground">{m.role}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-mono font-medium">{m.rate}</p>
                <p className="text-[10px] text-pulse font-mono">{m.score} match</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Vetting mockup — steps check off sequentially, then reset ───────────────
const VettingMockup = () => {
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
      {/* Header row */}
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

      {/* Steps */}
      {VETTING_STEPS.map((step, i) => {
        const isPassed = i < checkedCount;
        const isActive = i === checkedCount;

        return (
          <div key={step} className="flex items-center gap-3">
            {/* Circle indicator */}
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
};

// ── Main section ─────────────────────────────────────────────────────────────
const FeaturesShowcase = ({ className }: FeaturesShowcaseProps) => {
  const [devIdx, setDevIdx] = useState(0);
  const [devKey, setDevKey] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setDevIdx((i) => (i + 1) % developers.length);
      setDevKey((k) => k + 1);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <section className={cn("py-24 container mx-auto px-6", className)}>
      {/* Header */}
      <div className="mb-16 flex flex-col gap-4">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Introducing OctogleHire
        </span>
        <h2 className="max-w-2xl text-4xl font-medium tracking-tight lg:text-5xl xl:text-6xl">
          The talent platform built to
          match, vet, and deliver at scale
        </h2>
      </div>

      {/* Top row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Card 1 — Browse */}
        <div className="rounded-3xl border border-border bg-muted/30 p-6 space-y-5">
          <div className="rounded-2xl bg-background border border-border p-4">
            <DevCardMockup dev={developers[devIdx]} animKey={devKey} />

            {/* Profile indicator dots */}
            <div className="mt-3 flex justify-center gap-1.5">
              {developers.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    i === devIdx ? "w-4 bg-foreground" : "w-1.5 bg-border",
                  )}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2 px-2">
            <h3 className="text-lg font-semibold">
              Browse 1,000+ Pre-Vetted Engineers
            </h3>
            <p className="text-sm text-muted-foreground">
              Every profile includes verified work history, stack-specific
              assessments, and transparent rates — browse freely, engage only
              when you&apos;re ready.
            </p>
          </div>
        </div>

        {/* Card 2 — Match delivery */}
        <div className="rounded-3xl border border-border bg-muted/30 p-6 space-y-5">
          <div className="rounded-2xl bg-background border border-border p-4">
            <MatchMockup />
          </div>

          <div className="space-y-2 px-2">
            <h3 className="text-lg font-semibold">
              Your Matches, Delivered in 48 Hours
            </h3>
            <p className="text-sm text-muted-foreground">
              Post a role and receive 3–5 curated, vetted profiles within 48
              hours. Once you find the right fit, they join your team through
              OctogleHire — we handle contracts, payroll, and compliance.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom row — Vetting */}
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
              Hire with total confidence — every time
            </h3>
            <p className="text-muted-foreground">
              Our 5-stage vetting process means only the top 5% of applicants
              join the network. Every developer on your shortlist has been
              technically assessed, interviewed, and background-checked —
              before they ever reach you.
            </p>
            <ul className="space-y-3">
              {[
                "Multi-stage technical assessments",
                "Live system design interviews",
                "Background & reference checks",
                "Ongoing performance monitoring",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm">
                  <CheckCircle className="size-4 text-pulse shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" className="rounded-full gap-2">
              <a href="/marketplace">
                View Developer Profiles
                <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>

          <VettingMockup />
        </div>
      </div>
    </section>
  );
};

export { FeaturesShowcase };
