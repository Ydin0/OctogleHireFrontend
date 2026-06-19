"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Linkedin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useBriefWizard } from "@/components/marketing/brief-wizard-context";

const stats = [
  { value: "1,000+", label: "Engineers vetted", accent: true },
  { value: "300+", label: "Companies served", accent: false },
  { value: "30+", label: "Countries covered", accent: false },
  { value: "1 in 25", label: "Acceptance rate", accent: false },
  { value: "48h", label: "Average match time", accent: false },
  { value: "94%", label: "6-month retention", accent: false },
];

const values = [
  {
    title: "Quality over quantity",
    description:
      "We reject 96% of applicants. Every engineer in our network has passed a 5-stage vetting process including technical assessments, live interviews, and background checks.",
    stat: "4%",
    statLabel: "acceptance rate",
  },
  {
    title: "Transparency first",
    description:
      "No hidden markups, no surprise fees. Rates are disclosed upfront to both companies and developers. What you see is what you pay.",
    stat: "$0",
    statLabel: "hidden fees",
  },
  {
    title: "Global by default",
    description:
      "We operate across 30+ countries because talent is everywhere. We handle compliance, payroll, and contracts so geography is never a barrier.",
    stat: "30+",
    statLabel: "countries",
  },
  {
    title: "Speed without compromise",
    description:
      "48-hour matching doesn't mean cutting corners. Our pre-vetted network means we deliver fast because the work is already done.",
    stat: "48h",
    statLabel: "to first match",
  },
];

const team = [
  {
    name: "Yaseen Deen",
    role: "CEO",
    image: "/Yaseen Founder.jpg",
    linkedin: "https://www.linkedin.com/in/yaseen-deen-52249219b/",
    bio: "Leads company strategy, product, and growth. Built OctogleHire to fix how companies access global engineering talent.",
  },
  {
    name: "Stergios Pappos",
    role: "Head of Technology",
    image: "/Stergios-Technology.jpg",
    linkedin: null,
    bio: "Oversees platform architecture, engineering, and infrastructure — ensuring OctogleHire's technology scales reliably as our network grows.",
  },
  {
    name: "Dimitris Pappos",
    role: "Head of Marketing",
    image: "/Dimitris-Marketing.jpg",
    linkedin: null,
    bio: "Drives brand strategy, demand generation, and market positioning — building the channels that connect companies with our vetted talent.",
  },
  {
    name: "Anil Wadghule",
    role: "Tech Lead",
    image: "/Anil-TechLead.jpg",
    linkedin: null,
    bio: "18 years of engineering across full-stack, architecture, and Elixir. A recognised conference speaker, Anil leads our technical vetting and assessment design.",
  },
  {
    name: "Milo Clarke",
    role: "Client Success Manager",
    image: "/MiloSales.jpg",
    linkedin: null,
    bio: "Manages client relationships end-to-end — from onboarding to ongoing success — so every company gets the right talent and a seamless experience.",
  },
  {
    name: "Ricardo M.",
    role: "Talent & Recruitment",
    image: "/Ricardo-Recruitment.jpg",
    linkedin: null,
    bio: "Sources and shepherds engineers through the gauntlet, building the pipeline of vetted talent that powers every shortlist.",
  },
];

export function AboutContent() {
  const { open: openBrief } = useBriefWizard();
  const startBrief = () => openBrief({ sourcePage: "About us" });

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-grid-zinc relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[-120px] h-[520px] w-[900px] -translate-x-1/2"
          style={{
            background:
              "radial-gradient(ellipse, color-mix(in oklab, var(--pulse) 15%, transparent), transparent 65%)",
          }}
        />
        <div className="container relative z-10 mx-auto flex max-w-[980px] flex-col items-center px-6 py-14 text-center lg:py-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-pulse/30 bg-pulse/10 px-4 py-1.5">
            <span className="size-1.5 rounded-full bg-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-pulse">
              About us
            </span>
          </span>

          <h1
            className="mt-6 max-w-[900px] font-medium leading-[1.04] tracking-[-0.028em] [text-wrap:balance]"
            style={{ fontSize: "clamp(40px, 5.4vw, 72px)" }}
          >
            We connect companies with the world&apos;s{" "}
            <span className="text-pulse">best engineers</span>
          </h1>
          <p className="mt-[22px] max-w-[620px] text-[18px] leading-[1.6] text-muted-foreground [text-wrap:pretty]">
            OctogleHire is a global talent platform that has vetted 1,000+
            engineers across 30+ countries through a rigorous 5-stage process —
            only 1 in 25 applicants are accepted. Over 300 companies build
            engineering teams with us in days, not months.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              onClick={startBrief}
              className="h-[52px] gap-2.5 rounded-full bg-pulse px-7 font-mono text-[14px] uppercase tracking-[0.08em] text-pulse-foreground shadow-[0_12px_32px_-10px_color-mix(in_oklab,var(--pulse)_60%,transparent)] hover:bg-pulse/90"
            >
              Start hiring
              <ArrowRight className="size-4" />
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-[52px] gap-2.5 rounded-full px-6 font-mono text-[14px] uppercase tracking-[0.08em]"
            >
              <Link href="/how-we-vet">How we vet</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Stats band ───────────────────────────────────────── */}
      <section className="border-y border-border bg-card/55">
        <div className="container mx-auto grid grid-cols-3 gap-5 px-6 py-8 sm:grid-cols-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div
                className={`font-mono text-[26px] font-semibold leading-none ${
                  s.accent ? "text-pulse" : "text-foreground"
                }`}
              >
                {s.value}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission / values ─────────────────────────────────── */}
      <section className="mx-auto max-w-[1100px] px-6 pb-8 pt-20">
        <div className="mx-auto mb-12 max-w-[640px] text-center">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-pulse">
            What we believe
          </div>
          <h2
            className="font-medium leading-[1.08] tracking-[-0.02em] [text-wrap:balance]"
            style={{ fontSize: "clamp(30px, 4vw, 44px)" }}
          >
            Talent is everywhere. Opportunity isn&apos;t.
          </h2>
          <p className="mt-3.5 text-base text-muted-foreground">
            We&apos;re building the platform that closes that gap — connecting
            the best engineers on earth with the teams that need them.
          </p>
        </div>

        <div className="grid gap-[18px] sm:grid-cols-2">
          {values.map((v) => (
            <div
              key={v.title}
              className="flex items-start gap-5 rounded-2xl border border-border bg-card p-6 transition-transform duration-200 hover:-translate-y-1 hover:border-pulse/40"
            >
              <div className="flex-none text-center">
                <div className="font-mono text-[28px] font-semibold leading-none text-pulse">
                  {v.stat}
                </div>
                <div className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.06em] text-muted-foreground">
                  {v.statLabel}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">{v.title}</h3>
                <p className="mt-1.5 text-sm leading-[1.6] text-muted-foreground">
                  {v.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────── */}
      <section id="team" className="mx-auto max-w-[1100px] scroll-mt-24 px-6 pb-10 pt-[70px]">
        <div className="mx-auto mb-12 max-w-[620px] text-center">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-pulse">
            The team
          </div>
          <h2
            className="font-medium leading-[1.08] tracking-[-0.02em] [text-wrap:balance]"
            style={{ fontSize: "clamp(30px, 4vw, 44px)" }}
          >
            The people behind the gauntlet
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m) => (
            <div
              key={m.name}
              className="overflow-hidden rounded-3xl border border-border bg-card transition-transform duration-200 hover:-translate-y-1 hover:border-pulse/40"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted to-background">
                <Image
                  src={m.image}
                  alt={m.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 360px"
                  className="object-cover object-top"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold">{m.name}</p>
                    <p className="mt-0.5 text-xs text-pulse">{m.role}</p>
                  </div>
                  {m.linkedin && (
                    <a
                      href={m.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${m.name} on LinkedIn`}
                      className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-pulse/40 hover:text-pulse"
                    >
                      <Linkedin className="size-3.5" />
                    </a>
                  )}
                </div>
                <p className="mt-3 text-sm leading-[1.55] text-muted-foreground">
                  {m.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 pb-[70px] pt-5">
        <div
          className="relative overflow-hidden rounded-3xl border border-pulse/30 px-10 py-14 text-center"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in oklab, var(--pulse) 22%, var(--card)), var(--card))",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-[100px] -right-[60px] size-[320px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--pulse) 22%, transparent), transparent 70%)",
            }}
          />
          <h2
            className="relative font-medium leading-[1.08] tracking-[-0.02em] [text-wrap:balance]"
            style={{ fontSize: "clamp(30px, 4vw, 46px)" }}
          >
            Build your team with us
          </h2>
          <p className="relative mx-auto mt-3.5 max-w-[520px] text-[17px] text-muted-foreground">
            Tell us what you&apos;re building. Get a shortlist of pre-vetted
            engineers within 48 hours.
          </p>
          <Button
            size="lg"
            onClick={startBrief}
            className="relative mt-7 h-[54px] gap-2.5 rounded-full bg-pulse px-8 font-mono text-[14px] uppercase tracking-[0.08em] text-pulse-foreground shadow-[0_12px_32px_-10px_color-mix(in_oklab,var(--pulse)_60%,transparent)] hover:bg-pulse/90"
          >
            Start your brief
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </section>
    </>
  );
}
