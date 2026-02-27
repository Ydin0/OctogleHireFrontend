"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface HowItWorksProps {
  className?: string;
}

const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

const STEPS = [
  { value: "post", label: "Post a Role" },
  { value: "match", label: "Get Matched" },
  { value: "hire", label: "Start Hiring" },
] as const;

type StepValue = (typeof STEPS)[number]["value"];

// ── Role data for cycling Post a Role mockup ──────────────────────────────────
const roles = [
  {
    title: "Senior React Engineer",
    stack: [
      { label: "React", icon: `${DEVICON}/react/react-original.svg` },
      { label: "TypeScript", icon: `${DEVICON}/typescript/typescript-original.svg` },
      { label: "Node.js", icon: `${DEVICON}/nodejs/nodejs-original.svg` },
    ],
    budget: "$50–$80/hr",
    start: "ASAP",
  },
  {
    title: "Backend Python Engineer",
    stack: [
      { label: "Python", icon: `${DEVICON}/python/python-original.svg` },
      { label: "PostgreSQL", icon: `${DEVICON}/postgresql/postgresql-original.svg` },
      { label: "Docker", icon: `${DEVICON}/docker/docker-original.svg` },
    ],
    budget: "$55–$75/hr",
    start: "2 weeks",
  },
  {
    title: "DevOps / Cloud Engineer",
    stack: [
      { label: "AWS", icon: `${DEVICON}/amazonwebservices/amazonwebservices-original-wordmark.svg` },
      { label: "Kubernetes", icon: `${DEVICON}/kubernetes/kubernetes-original.svg` },
      { label: "Terraform", icon: `${DEVICON}/terraform/terraform-original.svg` },
    ],
    budget: "$60–$90/hr",
    start: "ASAP",
  },
];

const PostRoleMockup = () => {
  const [idx, setIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % roles.length);
      setAnimKey((k) => k + 1);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  const role = roles[idx];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">New Role</p>
        <Badge variant="outline" className="text-[10px]">Draft</Badge>
      </div>

      <div key={animKey} className="space-y-3 animate-in fade-in duration-300">
        <div className="rounded-lg bg-muted px-4 py-3">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Role title</p>
          <p className="text-sm font-medium">{role.title}</p>
        </div>

        <div className="rounded-lg bg-muted px-4 py-3">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Tech stack</p>
          <div className="flex flex-wrap gap-2">
            {role.stack.map((s) => (
              <Badge key={s.label} variant="secondary" className="text-[10px] gap-1.5 px-2 py-0.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.icon} alt="" className="size-3.5" />
                {s.label}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-muted px-4 py-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Budget</p>
            <p className="text-sm font-mono font-medium">{role.budget}</p>
          </div>
          <div className="rounded-lg bg-muted px-4 py-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Start</p>
            <p className="text-sm font-medium">{role.start}</p>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5">
        {roles.map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1 rounded-full transition-all duration-300",
              i === idx ? "w-4 bg-foreground" : "w-1.5 bg-border",
            )}
          />
        ))}
      </div>

      <Button className="w-full rounded-full" size="sm">Post Role Free</Button>
    </div>
  );
};

// ── Get Matched mockup — shimmer loading → staggered results ──────────────────
const matchData = [
  {
    name: "Arjun Kumar",
    role: "React • 6 yrs exp",
    rate: "$65/hr",
    score: "98%",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    online: true,
    stack: [
      `${DEVICON}/react/react-original.svg`,
      `${DEVICON}/typescript/typescript-original.svg`,
    ],
  },
  {
    name: "Priya Mehta",
    role: "React • 5 yrs exp",
    rate: "$60/hr",
    score: "95%",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=face",
    online: true,
    stack: [
      `${DEVICON}/react/react-original.svg`,
      `${DEVICON}/nodejs/nodejs-original.svg`,
    ],
  },
  {
    name: "Rahul Verma",
    role: "React • 7 yrs exp",
    rate: "$75/hr",
    score: "93%",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    online: false,
    stack: [
      `${DEVICON}/react/react-original.svg`,
      `${DEVICON}/tailwindcss/tailwindcss-original.svg`,
    ],
  },
];

const GetMatchedMockup = () => {
  const [phase, setPhase] = useState<"loading" | "results">("loading");
  const [cycleKey, setCycleKey] = useState(0);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const run = () => {
      setPhase("loading");
      setCycleKey((k) => k + 1);
      t = setTimeout(() => {
        setPhase("results");
        t = setTimeout(run, 4500);
      }, 1200);
    };
    run();
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Your Matches</p>
        <Badge variant="outline" className="text-[10px]">Delivered in 48h</Badge>
      </div>

      {phase === "loading" ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-border p-3 animate-pulse">
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
              style={{ animationDelay: `${i * 120}ms`, animationFillMode: "backwards" }}
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
                  <span className="text-xs text-muted-foreground ml-0.5">{d.role}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-mono font-medium">{d.rate}</p>
                <p className="text-[10px] text-pulse font-mono font-semibold">{d.score} match</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Start Hiring mockup — onboarding steps check off sequentially ─────────────
const onboardingSteps = [
  "Contract signed",
  "Compliance verified",
  "First day scheduled",
  "Tool access granted",
];

const StartHiringMockup = () => {
  const [checkedCount, setCheckedCount] = useState(0);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (checkedCount >= onboardingSteps.length) {
      t = setTimeout(() => setCheckedCount(0), 2400);
    } else {
      t = setTimeout(
        () => setCheckedCount((c) => c + 1),
        checkedCount === 0 ? 800 : 600,
      );
    }
    return () => clearTimeout(t);
  }, [checkedCount]);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <Avatar className="size-12">
          <AvatarImage
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
            alt="Arjun Kumar"
          />
          <AvatarFallback>AK</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-sm font-semibold">Onboarding Arjun Kumar</p>
          <p className="text-xs text-muted-foreground">Senior React Engineer</p>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] transition-colors duration-500",
            checkedCount === onboardingSteps.length
              ? "border-emerald-500/30 text-emerald-600"
              : "text-muted-foreground",
          )}
        >
          {checkedCount === onboardingSteps.length ? "Ready" : `${checkedCount}/${onboardingSteps.length}`}
        </Badge>
      </div>

      <div className="space-y-2">
        {onboardingSteps.map((step, i) => {
          const isDone = i < checkedCount;
          const isActive = i === checkedCount;

          return (
            <div
              key={step}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-2.5 transition-all duration-300",
                isDone ? "bg-pulse/10" : isActive ? "bg-muted border border-border" : "bg-muted/50",
              )}
            >
              <span
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
                  isDone
                    ? "border-transparent bg-pulse"
                    : isActive
                      ? "border-pulse animate-pulse"
                      : "border-border",
                )}
              >
                {isDone && (
                  <CheckCircle className="size-3 text-background" strokeWidth={2.5} />
                )}
              </span>
              <span className={cn("text-sm transition-colors duration-300", !isDone && !isActive && "text-muted-foreground")}>
                {step}
              </span>
              {isDone && (
                <span className="ml-auto text-[10px] font-mono text-pulse uppercase tracking-wider">
                  Done
                </span>
              )}
              {isActive && (
                <span className="ml-auto text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                  Active
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-border bg-muted/40 p-4 text-center">
        <p className="text-xs text-muted-foreground">Compliance managed in</p>
        <p className="text-3xl font-mono font-semibold mt-1">150+</p>
        <p className="text-xs text-muted-foreground">countries</p>
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
  post: {
    num: "01",
    title: "Tell us what you need",
    description:
      "Describe your role, tech stack, timeline, and budget. Takes less than 5 minutes. No lengthy intake forms or calls required.",
    cta: "Post a Role Free",
    href: "/companies/signup",
  },
  match: {
    num: "02",
    title: "Receive vetted profiles within 48 hours",
    description:
      "Our team hand-picks 3–5 pre-vetted developer profiles matched to your exact requirements. Review skills, rates, availability, and previous work.",
    cta: "See Sample Profiles",
    href: "/marketplace",
  },
  hire: {
    num: "03",
    title: "Interview, select, and onboard instantly",
    description:
      "Interview your shortlist, choose your hire, and we handle everything else — contracts, compliance, and payments across 150+ countries.",
    cta: "Start Hiring Today",
    href: "/companies/signup",
  },
};

const stepMockups: Record<StepValue, React.ReactNode> = {
  post: <PostRoleMockup />,
  match: <GetMatchedMockup />,
  hire: <StartHiringMockup />,
};

const HowItWorks = ({ className }: HowItWorksProps) => {
  const [active, setActive] = useState<StepValue>("post");
  const content = stepContent[active];

  return (
    <section id="how-it-works" className={cn("py-24 container mx-auto px-6", className)}>
      {/* Header */}
      <div className="mb-12 flex flex-col gap-4">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Process
        </span>
        <h2 className="max-w-2xl text-4xl font-medium tracking-tight lg:text-5xl">
          Hire world-class engineers
          in three simple steps
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

      {/* Content — animates on tab change */}
      <div
        key={active}
        className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 lg:items-center animate-in fade-in slide-in-from-bottom-2 duration-300"
      >
        {/* Left: text */}
        <div className="space-y-6">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Step {content.num}
          </span>
          <h3 className="text-3xl font-medium tracking-tight">{content.title}</h3>
          <p className="text-muted-foreground leading-relaxed">{content.description}</p>
          <Button asChild className="rounded-full gap-2">
            <a href={content.href}>
              {content.cta}
              <ArrowRight className="size-4" />
            </a>
          </Button>
          <p className="text-xs text-muted-foreground">
            Trusted by{" "}
            <span className="font-mono font-medium text-foreground">300+</span>{" "}
            companies worldwide
          </p>
        </div>

        {/* Right: mockup */}
        <div>{stepMockups[active]}</div>
      </div>
    </section>
  );
};

export { HowItWorks };
