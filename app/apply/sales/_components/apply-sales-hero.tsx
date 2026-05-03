"use client";

import {
  ArrowRight,
  CalendarCheck,
  Headphones,
  LineChart,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

interface ApplySalesHeroProps {
  onStart: () => void;
}

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

const stages = [
  { label: "Apply", detail: "10 minutes, applied once" },
  { label: "HR screen", detail: "Quick fit + comp call" },
  { label: "Discovery interview", detail: "Hiring manager, scorecard-led" },
  { label: "Role-play", detail: "Live, on a real persona" },
  { label: "Offer", detail: "Negotiated transparently" },
];

const ApplySalesHero = ({ onStart }: ApplySalesHeroProps) => {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100dvh-4rem)] bg-background">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="border-b border-border">
          <div className="container mx-auto px-6 py-20 sm:py-28">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-end">
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
                  <span className="italic font-serif">sales reps</span>{" "}
                  to land a quota-bearing seat.
                </h1>
                <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
                  Apply once. Record a 30-second pitch. Get matched to revenue
                  teams hiring AEs, SDRs, CSMs, and Sales Engineers across B2B
                  SaaS, FinTech, and enterprise software.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button
                    onClick={onStart}
                    size="lg"
                    className="gap-2 rounded-full"
                  >
                    Start application
                    <ArrowRight className="size-4" />
                  </Button>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Takes ~10 min · No CV required if LinkedIn is up to date
                  </span>
                </div>
                <div className="mt-10 flex flex-wrap gap-2">
                  {roleChips.map((role) => (
                    <Badge
                      key={role}
                      variant="outline"
                      className="rounded-full px-3 py-1 text-xs font-normal"
                    >
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Editorial side card — live "on the desk" feel */}
              <div className="relative">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      Now hiring · live
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-emerald-600">
                      <span className="relative flex size-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                      </span>
                      14 open roles
                    </span>
                  </div>
                  <ul className="mt-4 divide-y divide-border">
                    {[
                      {
                        company: "Vercel",
                        role: "Enterprise AE",
                        ote: "$240k OTE",
                      },
                      {
                        company: "Linear",
                        role: "Outbound SDR",
                        ote: "$110k OTE",
                      },
                      {
                        company: "Stripe",
                        role: "Mid-Market AE",
                        ote: "$210k OTE",
                      },
                      {
                        company: "Notion",
                        role: "Customer Success",
                        ote: "$140k OTE",
                      },
                    ].map((row) => (
                      <li
                        key={row.company + row.role}
                        className="flex items-center justify-between py-3"
                      >
                        <div>
                          <p className="text-sm font-medium">{row.company}</p>
                          <p className="text-xs text-muted-foreground">
                            {row.role}
                          </p>
                        </div>
                        <span className="font-mono text-xs">{row.ote}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="mt-3 text-center text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Sample · companies update weekly
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Why apply ────────────────────────────────────────────────── */}
        <section className="border-b border-border">
          <div className="container mx-auto px-6 py-16 sm:py-20">
            <div className="grid gap-8 sm:grid-cols-3">
              {valueProps.map(({ icon: Icon, title, body }) => (
                <div key={title} className="space-y-3">
                  <div className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-muted/30">
                    <Icon className="size-4" />
                  </div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="text-sm text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Process strip ────────────────────────────────────────────── */}
        <section className="border-b border-border bg-muted/30">
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
            </div>
            <ol className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-5">
              {stages.map((step, i) => (
                <li
                  key={step.label}
                  className="flex flex-col gap-2 bg-card p-5"
                >
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Stage {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm font-semibold">{step.label}</p>
                  <p className="text-xs text-muted-foreground">{step.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Bottom CTA ───────────────────────────────────────────────── */}
        <section className="border-b border-border">
          <div className="container mx-auto px-6 py-16 sm:py-20">
            <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
              <div className="flex -space-x-2">
                <Headphones className="size-4 text-muted-foreground" />
                <Users className="size-4 text-muted-foreground" />
              </div>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
                Ready to ship your next number?
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                We&rsquo;ll review your application within 48 hours and surface
                the opportunities that match your stack, OTE, and territory.
              </p>
              <Button
                onClick={onStart}
                size="lg"
                className="mt-6 gap-2 rounded-full"
              >
                Start application
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export { ApplySalesHero };
