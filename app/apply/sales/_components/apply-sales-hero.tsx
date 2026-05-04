"use client";

import { useEffect, useState } from "react";
import AutoScroll from "embla-carousel-auto-scroll";
import {
  ArrowRight,
  CalendarCheck,
  Crown,
  Globe,
  HeartHandshake,
  LineChart,
  Megaphone,
  Phone,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

interface ApplySalesHeroProps {
  onStart: () => void;
}

// ── Role chips ───────────────────────────────────────────────────────────────
const roleChips = [
  "Account Executive",
  "SDR",
  "BDR",
  "Account Manager",
  "Sales Engineer",
  "CSM",
  "Sales Manager",
  "RevOps",
];

// ── Value props ──────────────────────────────────────────────────────────────
const valueProps = [
  {
    icon: LineChart,
    title: "Quota-bearing roles only",
    body: "We don't list dead seats. Every opening has a real territory, real pipeline, and real OTE.",
  },
  {
    icon: ShieldCheck,
    title: "Vetted once, applied everywhere",
    body: "One application opens you to every company on the network. No re-pitching for each role.",
  },
  {
    icon: CalendarCheck,
    title: "Interviews in days, not weeks",
    body: "Fast loop: HR screen, 30-second video review, hiring-manager conversation, role-play. Done.",
  },
];

// ── Live opportunity feed entries (role-only, no fabricated company names) ──
type LiveOpportunity = {
  role: string;
  segment: string;
  ote: string;
  territory: string;
  icon: typeof Target;
};
const liveOpportunities: LiveOpportunity[] = [
  {
    role: "Enterprise AE",
    segment: "B2B SaaS",
    ote: "$240k",
    territory: "Remote · NA",
    icon: Crown,
  },
  {
    role: "Mid-Market AE",
    segment: "FinTech",
    ote: "$185k",
    territory: "Remote · EMEA",
    icon: TrendingUp,
  },
  {
    role: "Outbound SDR",
    segment: "DevTools",
    ote: "$110k",
    territory: "Remote · Global",
    icon: Megaphone,
  },
  {
    role: "Customer Success Manager",
    segment: "MarTech",
    ote: "$140k",
    territory: "Hybrid · London",
    icon: HeartHandshake,
  },
  {
    role: "Sales Engineer",
    segment: "Cybersecurity",
    ote: "$220k",
    territory: "Remote · NA",
    icon: ShieldCheck,
  },
];

// ── Real OctogleHire client logos for marquee ───────────────────────────────
const clientLogos = [
  { name: "1VA", src: "/company-logos/1VA.svg", h: "h-6" },
  { name: "Beekey", src: "/company-logos/Beekey.svg", h: "h-7" },
  { name: "Corpwise", src: "/company-logos/Corpwise.svg", h: "h-6" },
  {
    name: "DNO Investments",
    src: "/company-logos/DNO%20Investments.svg",
    h: "h-6",
  },
  { name: "Hireflow", src: "/company-logos/Hireflow.svg", h: "h-6" },
  { name: "Solidus", src: "/company-logos/Solidus.svg", h: "h-6" },
  { name: "SquareLogik", src: "/company-logos/SquareLogik.svg", h: "h-6" },
  { name: "Unichats", src: "/company-logos/Unichats.svg", h: "h-6" },
  { name: "Workchats", src: "/company-logos/Workchats.svg", h: "h-6" },
  { name: "The Care App", src: "/company-logos/thecareapp.svg", h: "h-6" },
];

// ── Compensation showcase (auto-rotating OTE card) ───────────────────────────
const otePackages = [
  {
    role: "Senior Enterprise AE",
    badge: "Closer",
    base: 120,
    variable: 120,
    quota: 1.4,
    tools: ["salesforce", "outreach", "gong"],
  },
  {
    role: "Mid-Market AE",
    badge: "Closer",
    base: 90,
    variable: 95,
    quota: 1.2,
    tools: ["hubspot", "salesloft", "apollo"],
  },
  {
    role: "Outbound SDR",
    badge: "Top of funnel",
    base: 65,
    variable: 45,
    quota: 0.6,
    tools: ["outreach", "apollo", "linkedin"],
  },
  {
    role: "Customer Success Manager",
    badge: "Retention",
    base: 95,
    variable: 45,
    quota: 0.9,
    tools: ["hubspot", "gong", "intercom"],
  },
  {
    role: "Sales Engineer",
    badge: "Pre-sales",
    base: 130,
    variable: 90,
    quota: 1.1,
    tools: ["salesforce", "slack", "notion"],
  },
];

// ── Sales-track cards ────────────────────────────────────────────────────────
const salesTracks = [
  {
    icon: Megaphone,
    label: "SDR / BDR",
    title: "Top-of-funnel specialists",
    summary:
      "For reps who love building pipeline through cold outbound, sequence design, and discovery calls.",
    focus: [
      "Outbound prospecting",
      "Sequencing & cadence",
      "Discovery & qualification",
    ],
    tools: [
      { label: "Outreach", slug: "outreach" },
      { label: "Apollo", slug: "apollodotio" },
      { label: "Salesloft", slug: "salesloft" },
      { label: "LinkedIn", slug: "linkedin" },
      { label: "ZoomInfo", slug: "zoominfo" },
    ],
  },
  {
    icon: Target,
    label: "AE",
    title: "Closers who run the deal",
    summary:
      "For reps closing mid-market and enterprise deals — discovery, demo, MEDDIC, and negotiation.",
    focus: [
      "MEDDIC / MEDDPICC",
      "Multi-thread enterprise deals",
      "Forecast accuracy",
    ],
    tools: [
      { label: "Salesforce", slug: "salesforce" },
      { label: "HubSpot", slug: "hubspot" },
      { label: "Gong", slug: "gong" },
      { label: "Clari", slug: "clari" },
      { label: "Slack", slug: "slack" },
    ],
  },
  {
    icon: HeartHandshake,
    label: "CSM / AM",
    title: "Retention and expansion",
    summary:
      "Onboard customers, drive adoption, and grow accounts through QBRs, upsells, and renewals.",
    focus: ["QBR & exec alignment", "Adoption playbooks", "Renewal & expansion"],
    tools: [
      { label: "Gainsight", slug: "gainsight" },
      { label: "Intercom", slug: "intercom" },
      { label: "Notion", slug: "notion" },
      { label: "Zendesk", slug: "zendesk" },
      { label: "HubSpot", slug: "hubspot" },
    ],
  },
];

// ── Process stages ───────────────────────────────────────────────────────────
const stages = [
  { label: "Apply", detail: "10 minutes, applied once" },
  { label: "HR screen", detail: "Quick fit + comp call" },
  { label: "Discovery interview", detail: "Hiring manager, scorecard-led" },
  { label: "Role-play", detail: "Live, on a real persona" },
  { label: "Offer", detail: "Negotiated transparently" },
];

// ── Featured reps for avatar stack ───────────────────────────────────────────
const featuredAvatars = [
  { src: "/MiloSales.jpg", alt: "Featured rep" },
  { src: "/review-1.jpg", alt: "Featured rep" },
  { src: "/review-2.jpg", alt: "Featured rep" },
  { src: "/review-3.jpg", alt: "Featured rep" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Animated sub-components
// ─────────────────────────────────────────────────────────────────────────────

const LiveOpportunityFeed = () => {
  const [phase, setPhase] = useState<"loading" | "results">("loading");
  const [cycleKey, setCycleKey] = useState(0);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const run = () => {
      setPhase("loading");
      setCycleKey((k) => k + 1);
      t = setTimeout(() => {
        setPhase("results");
        t = setTimeout(run, 5200);
      }, 900);
    };
    run();
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Live opportunity feed
          </p>
          <p className="mt-0.5 text-sm font-semibold">Roles open right now</p>
        </div>
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-emerald-600">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          {liveOpportunities.length} live
        </span>
      </div>

      <div className="mt-4">
        {phase === "loading" ? (
          <ul className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <li key={i} className="flex items-center gap-3 animate-pulse">
                <div className="size-9 shrink-0 rounded-lg bg-muted" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-2.5 w-32 rounded-full bg-muted" />
                  <div className="h-2 w-20 rounded-full bg-muted" />
                </div>
                <div className="space-y-1.5 shrink-0">
                  <div className="ml-auto h-2.5 w-12 rounded-full bg-muted" />
                  <div className="ml-auto h-2 w-16 rounded-full bg-muted" />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-3" key={cycleKey}>
            {liveOpportunities.map((o, i) => {
              const Icon = o.icon;
              return (
                <li
                  key={o.role + o.segment}
                  className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-1 duration-300"
                  style={{
                    animationDelay: `${i * 90}ms`,
                    animationFillMode: "backwards",
                  }}
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/30">
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{o.role}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {o.segment} · {o.territory}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono text-sm font-medium">{o.ote}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      OTE
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <p className="mt-4 border-t border-border pt-3 text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        Updated continuously · Apply once to access all
      </p>
    </div>
  );
};

const OteRotator = () => {
  const [idx, setIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % otePackages.length);
      setAnimKey((k) => k + 1);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  const pkg = otePackages[idx];
  const ote = pkg.base + pkg.variable;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div key={animKey} className="space-y-4 animate-in fade-in duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Sample compensation
            </p>
            <p className="mt-0.5 text-sm font-semibold">{pkg.role}</p>
          </div>
          <Badge variant="secondary" className="text-[10px]">
            {pkg.badge}
          </Badge>
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-5 text-center">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            On-Target Earnings
          </p>
          <p className="mt-1 font-mono text-3xl font-semibold tabular-nums">
            ${ote}k
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            ${pkg.base}k base · ${pkg.variable}k variable · {pkg.quota}× quota
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Stack
          </span>
          {pkg.tools.map((slug) => (
            <span
              key={slug}
              className="inline-flex size-6 items-center justify-center rounded-full border border-border bg-background"
              title={slug}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://cdn.simpleicons.org/${slug}`}
                alt=""
                className="size-3 dark:invert"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </span>
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      <div className="mt-5 flex justify-center gap-1.5">
        {otePackages.map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1 rounded-full transition-all duration-300",
              i === idx ? "w-5 bg-foreground" : "w-1.5 bg-border"
            )}
          />
        ))}
      </div>
    </div>
  );
};

const StatsStrip = () => {
  const stats = [
    { label: "Open roles · this quarter", value: "140+", icon: Target },
    { label: "Avg AE OTE · network", value: "$210k", icon: TrendingUp },
    { label: "Days to first interview", value: "< 5", icon: CalendarCheck },
    { label: "Geos hiring", value: "32", icon: Globe },
  ];
  return (
    <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
      {stats.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="flex flex-col gap-2 bg-card p-5 transition-colors hover:bg-muted/30"
        >
          <Icon className="size-4 text-muted-foreground" />
          <p className="font-mono text-3xl font-semibold tabular-nums">
            {value}
          </p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      ))}
    </div>
  );
};

const StagesStrip = () => {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setActive((a) => (a + 1) % stages.length);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <ol className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-5">
      {stages.map((step, i) => {
        const isActive = i === active;
        return (
          <li
            key={step.label}
            className={cn(
              "flex flex-col gap-2 bg-card p-5 transition-colors duration-500",
              isActive && "bg-muted/40"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Stage {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={cn(
                  "size-1.5 rounded-full transition-colors",
                  isActive ? "bg-foreground" : "bg-border"
                )}
              />
            </div>
            <p className="text-sm font-semibold">{step.label}</p>
            <p className="text-xs text-muted-foreground">{step.detail}</p>
          </li>
        );
      })}
    </ol>
  );
};

const SalesTrackCard = ({
  track,
}: {
  track: (typeof salesTracks)[number];
}) => {
  const Icon = track.icon;
  return (
    <article className="group flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-foreground/30">
      <div className="flex items-center justify-between">
        <div className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-muted/30">
          <Icon className="size-4" />
        </div>
        <Badge variant="outline" className="font-mono text-[10px]">
          {track.label}
        </Badge>
      </div>
      <div>
        <h3 className="text-base font-semibold">{track.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{track.summary}</p>
      </div>
      <ul className="space-y-1.5 text-sm">
        {track.focus.map((f) => (
          <li key={f} className="flex items-center gap-2">
            <span className="size-1 shrink-0 rounded-full bg-muted-foreground/60" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-wrap items-center gap-1.5 border-t border-border pt-3">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Tools
        </span>
        {track.tools.map((tool) => (
          <Badge
            key={tool.label}
            variant="outline"
            className="gap-1.5 px-2 py-0.5 text-[10px]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://cdn.simpleicons.org/${tool.slug}`}
              alt=""
              className="size-3 dark:invert"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            {tool.label}
          </Badge>
        ))}
      </div>
    </article>
  );
};

const ClientLogoMarquee = () => {
  return (
    <Carousel
      opts={{ loop: true, align: "start", dragFree: true }}
      plugins={[
        AutoScroll({ playOnInit: true, speed: 0.6, stopOnInteraction: false }),
      ]}
      className="w-full"
    >
      <CarouselContent className="ml-0">
        {[...clientLogos, ...clientLogos].map((logo, i) => (
          <CarouselItem
            key={`${logo.name}-${i}`}
            className="basis-1/3 pl-0 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
          >
            <div className="flex h-16 items-center justify-center px-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.src}
                alt={logo.name}
                className={cn(
                  "object-contain opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 dark:invert",
                  logo.h
                )}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main hero
// ─────────────────────────────────────────────────────────────────────────────

const ApplySalesHero = ({ onStart }: ApplySalesHeroProps) => {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100dvh-4rem)] bg-background">
        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section className="border-b border-border">
          <div className="container mx-auto px-6 py-20 sm:py-24">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
              <div>
                <Badge
                  variant="outline"
                  className="rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider"
                >
                  <Sparkles className="mr-1.5 size-3" />
                  For Sales Professionals
                </Badge>
                <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                  The fastest way for{" "}
                  <span className="font-serif italic">sales reps</span> to land
                  a quota-bearing seat.
                </h1>
                <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
                  Apply once. Record a 30-second pitch. Get matched to revenue
                  teams hiring AEs, SDRs, CSMs, and Sales Engineers across B2B
                  SaaS, FinTech, and enterprise software.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Button
                    onClick={onStart}
                    size="lg"
                    className="gap-2 rounded-full"
                  >
                    Start application
                    <ArrowRight className="size-4" />
                  </Button>
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {featuredAvatars.map((a, i) => (
                        <Avatar
                          key={a.src}
                          size="sm"
                          className={cn(
                            "border-2 border-background ring-0",
                            i > 0 && "shadow-sm"
                          )}
                        >
                          <AvatarImage src={a.src} alt={a.alt} />
                          <AvatarFallback>·</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      ~10 min · No CV required
                      <br />
                      if LinkedIn is up to date
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex flex-wrap gap-2">
                  {roleChips.map((role, i) => (
                    <Badge
                      key={role}
                      variant="outline"
                      className="animate-in fade-in slide-in-from-bottom-1 rounded-full px-3 py-1 text-xs font-normal duration-500"
                      style={{
                        animationDelay: `${i * 60}ms`,
                        animationFillMode: "backwards",
                      }}
                    >
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="relative">
                <LiveOpportunityFeed />
              </div>
            </div>
          </div>
        </section>

        {/* ── Logo marquee ───────────────────────────────────────────── */}
        <section className="border-b border-border bg-muted/20">
          <div className="container mx-auto px-6 py-10">
            <p className="mb-6 text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Trusted by hiring teams across the OctogleHire network
            </p>
            <ClientLogoMarquee />
          </div>
        </section>

        {/* ── Stats + OTE rotator ────────────────────────────────────── */}
        <section className="border-b border-border">
          <div className="container mx-auto px-6 py-16 sm:py-20">
            <div className="flex items-end justify-between gap-6">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  The numbers
                </span>
                <h2 className="mt-1 text-2xl font-semibold sm:text-3xl">
                  Real comp. Real territories. Real urgency.
                </h2>
              </div>
            </div>

            <div className="mt-8">
              <StatsStrip />
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
              <OteRotator />
              <div className="space-y-5">
                <div className="space-y-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Why this works
                  </span>
                  <h3 className="text-2xl font-semibold tracking-tight">
                    Compensation packages benchmarked against the market —
                    surfaced before you interview.
                  </h3>
                </div>
                <ul className="space-y-3 text-sm">
                  {valueProps.map(({ icon: Icon, title, body }) => (
                    <li key={title} className="flex items-start gap-3">
                      <div className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-muted/30">
                        <Icon className="size-3.5" />
                      </div>
                      <div>
                        <p className="font-medium">{title}</p>
                        <p className="text-muted-foreground">{body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Sales tracks bento ─────────────────────────────────────── */}
        <section className="border-b border-border bg-muted/20">
          <div className="container mx-auto px-6 py-16 sm:py-20">
            <div className="flex items-end justify-between gap-6">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Roles
                </span>
                <h2 className="mt-1 text-2xl font-semibold sm:text-3xl">
                  Three tracks. One application.
                </h2>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                  Tell us where you sell best. We&rsquo;ll route you to the
                  right hiring managers.
                </p>
              </div>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {salesTracks.map((track) => (
                <SalesTrackCard key={track.label} track={track} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Process strip ──────────────────────────────────────────── */}
        <section className="border-b border-border">
          <div className="container mx-auto px-6 py-16 sm:py-20">
            <div className="flex items-end justify-between gap-6">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Process
                </span>
                <h2 className="mt-1 text-2xl font-semibold sm:text-3xl">
                  Five stages. No black box.
                </h2>
              </div>
              <span className="hidden font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:block">
                Avg. 5 days end-to-end
              </span>
            </div>
            <div className="mt-10">
              <StagesStrip />
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ─────────────────────────────────────────────── */}
        <section className="border-b border-border">
          <div className="container mx-auto px-6 py-20 sm:py-24">
            <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {featuredAvatars.map((a) => (
                    <Avatar
                      key={a.src}
                      size="sm"
                      className="border-2 border-background"
                    >
                      <AvatarImage src={a.src} alt={a.alt} />
                      <AvatarFallback>·</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Reps placed this month
                </span>
              </div>
              <h2 className="mt-6 text-3xl font-semibold sm:text-4xl">
                Ready to ship your next number?
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                We&rsquo;ll review your application within 48 hours and surface
                the opportunities that match your stack, OTE, and territory.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button
                  onClick={onStart}
                  size="lg"
                  className="gap-2 rounded-full"
                >
                  Start application
                  <ArrowRight className="size-4" />
                </Button>
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <Phone className="size-3" />
                  30-second video pitch
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export { ApplySalesHero };
