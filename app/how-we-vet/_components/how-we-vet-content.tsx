"use client";

import {
  Activity,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useBriefWizard } from "@/components/marketing/brief-wizard-context";

const stats = [
  { value: "25,000+", label: "Applicants reviewed", accent: false },
  { value: "1,000", label: "Engineers accepted", accent: true },
  { value: "1 in 25", label: "Acceptance rate", accent: false },
  { value: "5", label: "Vetting stages", accent: false },
  { value: "94%", label: "6-month retention", accent: false },
  { value: "< 6%", label: "Replacement rate", accent: false },
];

const funnel: {
  label: string;
  value: string;
  width: string;
  border: string;
  bg: string;
  solid?: boolean;
}[] = [
  {
    label: "Applied",
    value: "25,000",
    width: "100%",
    border: "color-mix(in oklab, var(--pulse) 30%, transparent)",
    bg: "linear-gradient(90deg, color-mix(in oklab, var(--pulse) 30%, var(--card)), color-mix(in oklab, var(--pulse) 14%, var(--card)))",
  },
  {
    label: "Resume & screening",
    value: "9,000",
    width: "80%",
    border: "color-mix(in oklab, var(--pulse) 28%, transparent)",
    bg: "linear-gradient(90deg, color-mix(in oklab, var(--pulse) 26%, var(--card)), color-mix(in oklab, var(--pulse) 12%, var(--card)))",
  },
  {
    label: "Technical assessment",
    value: "3,500",
    width: "64%",
    border: "color-mix(in oklab, var(--pulse) 26%, transparent)",
    bg: "linear-gradient(90deg, color-mix(in oklab, var(--pulse) 22%, var(--card)), color-mix(in oklab, var(--pulse) 10%, var(--card)))",
  },
  {
    label: "Live coding",
    value: "1,800",
    width: "50%",
    border: "color-mix(in oklab, var(--pulse) 24%, transparent)",
    bg: "linear-gradient(90deg, color-mix(in oklab, var(--pulse) 19%, var(--card)), color-mix(in oklab, var(--pulse) 9%, var(--card)))",
  },
  {
    label: "AI playbook",
    value: "1,300",
    width: "40%",
    border: "color-mix(in oklab, var(--pulse) 22%, transparent)",
    bg: "linear-gradient(90deg, color-mix(in oklab, var(--pulse) 16%, var(--card)), color-mix(in oklab, var(--pulse) 8%, var(--card)))",
  },
  {
    label: "Accepted",
    value: "1,000",
    width: "32%",
    border: "var(--pulse)",
    bg: "var(--pulse)",
    solid: true,
  },
];

const stages: {
  n: string;
  title: string;
  range: string;
  desc: string;
  sparkle?: boolean;
}[] = [
  {
    n: "01",
    title: "Application & resume screening",
    range: "25,000 → 9,000",
    desc: "Background, work history, and code samples are screened against role requirements. Self-reported skills count for nothing until they're proven.",
  },
  {
    n: "02",
    title: "Technical assessment",
    range: "9,000 → 3,500",
    desc: "A timed, proctored assessment covering data structures, algorithms, and language-specific depth. Auto-graded, plagiarism-checked, no take-home loopholes.",
  },
  {
    n: "03",
    title: "Live coding & system design",
    range: "3,500 → 1,800",
    desc: "A senior engineer runs a 60-minute live session — real problems, real trade-offs. We watch how they reason, debug, and design under pressure.",
  },
  {
    n: "04",
    title: "AI-native playbook evaluation",
    range: "1,800 → 1,300",
    desc: "Hands-on evaluation of agentic workflows — Cursor, Claude Code, RAG, and prompt engineering. We verify they ship faster with AI, not slower.",
    sparkle: true,
  },
  {
    n: "05",
    title: "Communication & culture",
    range: "1,300 → 1,000",
    desc: "A final interview on written and spoken English, async habits, and ownership. Great code isn't enough — they have to integrate with your team.",
  },
];

const guarantees = [
  {
    icon: ShieldCheck,
    title: "Verified, not claimed",
    desc: "Every skill on a profile was proven in our gauntlet — never self-reported.",
  },
  {
    icon: Activity,
    title: "94% still there at 6 months",
    desc: "Rigorous vetting up front means engagements that actually last.",
  },
  {
    icon: RefreshCw,
    title: "14-day replacement",
    desc: "If a match isn't right, we swap them — no cost, no questions.",
  },
];

export function HowWeVetContent() {
  const { open: openBrief } = useBriefWizard();
  const startBrief = () => openBrief({ sourcePage: "How we vet" });

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
            <ShieldCheck className="size-3.5 text-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-pulse">
              How we vet
            </span>
          </span>

          <h1
            className="mt-6 max-w-[900px] font-medium leading-[1.02] tracking-[-0.028em] [text-wrap:balance]"
            style={{ fontSize: "clamp(40px, 5.4vw, 72px)" }}
          >
            25,000+ applicants reviewed.{" "}
            <span className="text-pulse">1,000 accepted.</span>
          </h1>
          <p className="mt-[22px] max-w-[600px] text-[18px] leading-[1.6] text-muted-foreground [text-wrap:pretty]">
            Every engineer on OctogleHire passes a rigorous five-stage vetting
            gauntlet. No shortcuts, no self-reported skills — just verified,
            exceptional talent you can ship with on day one.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              onClick={startBrief}
              className="h-[52px] gap-2.5 rounded-full bg-pulse px-7 font-mono text-[14px] uppercase tracking-[0.08em] text-pulse-foreground shadow-[0_12px_32px_-10px_color-mix(in_oklab,var(--pulse)_60%,transparent)] hover:bg-pulse/90"
            >
              Hire vetted engineers
              <ArrowRight className="size-4" />
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-[52px] gap-2.5 rounded-full px-6 font-mono text-[14px] uppercase tracking-[0.08em]"
            >
              <Link href="/marketplace">
                Browse profiles
                <ArrowRight className="size-4" />
              </Link>
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

      {/* ── Funnel ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1100px] px-6 pb-8 pt-20">
        <div className="mx-auto mb-11 max-w-[640px] text-center">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-pulse">
            The funnel
          </div>
          <h2
            className="font-medium leading-[1.08] tracking-[-0.02em] [text-wrap:balance]"
            style={{ fontSize: "clamp(30px, 4vw, 44px)" }}
          >
            From 25,000 down to 1,000
          </h2>
          <p className="mt-3.5 text-base text-muted-foreground">
            Each stage removes everyone who can&apos;t clear the bar. Only the top
            4% reach your shortlist.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          {funnel.map((f) => (
            <div
              key={f.label}
              className={`flex h-[62px] items-center justify-between rounded-2xl border px-5 sm:px-6 ${
                f.solid
                  ? "text-pulse-foreground shadow-[0_10px_30px_-10px_color-mix(in_oklab,var(--pulse)_60%,transparent)]"
                  : ""
              }`}
              style={{
                width: f.width,
                minWidth: "200px",
                maxWidth: "100%",
                borderColor: f.border,
                background: f.bg,
              }}
            >
              <span className="text-[13px] font-semibold sm:text-[15px]">
                {f.label}
              </span>
              <span className="font-mono text-[15px] font-semibold sm:text-[17px]">
                {f.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5 stages (the gauntlet) ──────────────────────────── */}
      <section className="mx-auto max-w-[1000px] px-6 pb-10 pt-[70px]">
        <div className="mx-auto mb-12 max-w-[620px] text-center">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-pulse">
            The gauntlet
          </div>
          <h2
            className="font-medium leading-[1.08] tracking-[-0.02em] [text-wrap:balance]"
            style={{ fontSize: "clamp(30px, 4vw, 44px)" }}
          >
            Five stages. Zero shortcuts.
          </h2>
        </div>

        <div className="relative flex flex-col gap-[18px]">
          <span
            aria-hidden
            className="absolute bottom-[30px] left-[31px] top-[30px] w-0.5"
            style={{
              background:
                "linear-gradient(var(--border), color-mix(in oklab, var(--pulse) 30%, transparent))",
            }}
          />
          {stages.map((s) => (
            <div
              key={s.n}
              className="relative z-[1] flex items-start gap-[22px] rounded-2xl border border-border bg-card p-6 transition-transform duration-200 hover:-translate-y-1 hover:border-pulse/40"
            >
              <span className="flex size-[46px] flex-none items-center justify-center rounded-[13px] border border-pulse/35 bg-card font-mono text-[15px] font-semibold text-pulse">
                {s.n}
              </span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="flex items-center gap-2 text-lg font-semibold">
                    {s.title}
                    {s.sparkle && <Sparkles className="size-4 text-pulse" />}
                  </h3>
                  <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted-foreground">
                    {s.range}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-[1.6] text-muted-foreground">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Guarantee strip ──────────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-[50px]">
        <div className="grid gap-[18px] md:grid-cols-3">
          {guarantees.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-card p-6"
            >
              <span className="flex size-10 items-center justify-center rounded-[11px] bg-pulse/12 text-pulse">
                <Icon className="size-5" strokeWidth={1.75} />
              </span>
              <h3 className="mt-4 text-base font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm leading-[1.55] text-muted-foreground">
                {desc}
              </p>
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
            Hire from the top 4%
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
