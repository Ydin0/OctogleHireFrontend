import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle,
  Clock,
  FileSearch,
  FileText,
  Globe,
  MessageSquare,
  Shield,
  ShieldCheck,
  UserCheck,
  Zap,
} from "lucide-react";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";
import {
  FadeUp,
  Stagger,
  StaggerItem,
  ScaleIn,
  SlideIn,
  FillBar,
} from "@/components/marketing/animated";
import { HiringCalculator } from "@/components/marketing/hiring-calculator";

export const metadata: Metadata = {
  title: "Hire Pre-Vetted Engineers in 48 Hours — OctogleHire",
  description:
    "Receive 3–5 curated developer profiles within 48 hours. No placement fees. Compliance handled across 30+ countries. 40–60% lower than US/UK rates.",
  alternates: { canonical: absoluteUrl("/get-started") },
  openGraph: {
    title: "Pre-Vetted Engineers, Deployed in Days, at 40–60% Lower Cost",
    description:
      "Receive 3–5 curated developer profiles within 48 hours. No placement fees. Compliance handled.",
    url: absoluteUrl("/get-started"),
  },
};

/* ─── Data ────────────────────────────────────────────────────────────────── */

const steps = [
  {
    num: "01",
    title: "Tell us what you need",
    description:
      "Share your role requirements, tech stack, and timeline. Takes under 5 minutes.",
  },
  {
    num: "02",
    title: "Review your shortlist",
    description:
      "Receive 3–5 vetted, stack-matched profiles within 48 hours. You interview for fit.",
  },
  {
    num: "03",
    title: "Onboard and start",
    description:
      "We handle contracts, payroll, and compliance. You get a single invoice. Your engineer starts.",
  },
];

const vettingStages = [
  { icon: FileSearch, label: "Application Review", passRate: 40 },
  { icon: Zap, label: "Technical Assessment", passRate: 14 },
  { icon: MessageSquare, label: "System Design Interview", passRate: 7 },
  { icon: ShieldCheck, label: "Communication Evaluation", passRate: 6 },
  { icon: UserCheck, label: "Reference & Background Check", passRate: 4 },
];

const complianceBlocks = [
  {
    icon: FileText,
    title: "Contracts",
    description: "Legally compliant employment and contractor agreements in every jurisdiction.",
  },
  {
    icon: Globe,
    title: "Payroll",
    description: "Local-currency payroll processing, on time, in 30+ countries.",
  },
  {
    icon: Shield,
    title: "Tax Compliance",
    description: "We handle tax withholding, reporting, and statutory obligations.",
  },
  {
    icon: ShieldCheck,
    title: "IP Protection",
    description: "All engineers sign IP assignment and NDA agreements. Work product is yours.",
  },
];

const onDemandFeatures = [
  "Free to post, free to receive candidates",
  "3–5 curated profiles within 48 hours",
  "All-inclusive monthly rate per developer",
  "Payroll, compliance & contracts managed",
  "14-day replacement guarantee",
  "Dedicated account manager",
];

const marketplaceFeatures = [
  "Browse 1,000+ vetted profiles directly",
  "Unlimited concurrent role postings",
  "Priority matching & onboarding",
  "Volume pricing available",
  "30-day replacement guarantee",
  "Senior account team",
];

const faqs = [
  {
    question: "How quickly can I hire?",
    answer:
      "You'll receive 3–5 curated, vetted profiles within 48 hours of submitting your brief. Most companies have an engineer onboarded and working within 1–3 weeks.",
  },
  {
    question: "How are developers vetted?",
    answer:
      "Every engineer passes our 5-stage process: application screening, stack-specific coding assessments, a 90-minute live technical interview, communication evaluation, and full background and reference checks. Only 1 in 25 applicants are accepted.",
    link: { label: "See our full vetting process", href: "/how-we-vet" },
  },
  {
    question: "What does it cost?",
    answer:
      "Typical monthly rates range from $3,000–$6,000 per developer depending on seniority and stack. No placement fees, no hidden markups. You only pay once your developer starts.",
  },
  {
    question: "What if a developer isn't the right fit?",
    answer:
      "Our On-Demand tier includes a 14-day replacement guarantee. Marketplace placements include a 30-day guarantee. If the engineer isn't right, we replace them at no additional cost.",
  },
  {
    question: "Do you handle compliance?",
    answer:
      "Yes — fully. We act as Employer of Record and handle contracts, payroll, tax compliance, and IP protection across 30+ countries. You receive a single invoice.",
  },
];

/* ─── Page ────────────────────────────────────────────────────────────────── */

export default function GetStartedPage() {
  return (
    <>
      {/* Minimal header — logo only, no nav distractions */}
      <header className="container mx-auto px-6 py-6">
        <Link href="/">
          <Logo width={130} height={30} />
        </Link>
      </header>

      <main>
        {/* ═══ Section 1: Hero ═══ */}
        <section className="container mx-auto px-6 pb-20 pt-8 lg:pt-16">
          <div className="mx-auto max-w-3xl text-center">
            <FadeUp>
              <h1 className="text-4xl font-semibold tracking-tight lg:text-6xl">
                Pre-Vetted Engineers, Deployed in Days, at{" "}
                <span className="text-pulse">40–60% Lower Cost</span>
              </h1>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
                Receive 3–5 curated developer profiles within 48 hours. No
                placement fees. Compliance handled. Flexible monthly terms.
              </p>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Button asChild size="lg" className="rounded-full gap-2 w-full sm:w-auto">
                  <Link href="/companies/signup">
                    Get Your Free Shortlist
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full w-full sm:w-auto"
                >
                  <Link href="/companies/signup">Book a Free Consultation</Link>
                </Button>
              </div>
            </FadeUp>
            <FadeUp delay={0.3}>
              <p className="mt-6 text-xs text-muted-foreground">
                Trusted by CTOs at startups and scaleups across the US, UK, and
                Australia
              </p>
            </FadeUp>
          </div>
        </section>

        {/* ═══ Section 2: Social Proof Bar ═══ */}
        <section className="border-y bg-muted/30 py-10">
          <div className="container mx-auto px-6">
            <FadeUp>
              <div className="mx-auto max-w-2xl text-center">
                <blockquote className="text-lg font-medium leading-relaxed lg:text-xl">
                  &ldquo;We went from months of searching to having three senior
                  engineers fully onboarded in under two weeks.&rdquo;
                </blockquote>
                <p className="mt-4 text-sm text-muted-foreground">
                  Sarah Chen, CTO at Nextera Technologies
                </p>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ═══ Section 3: How It Works ═══ */}
        <section className="container mx-auto px-6 py-24">
          <FadeUp>
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                How It Works
              </span>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight lg:text-4xl">
                Three steps to your engineering team
              </h2>
            </div>
          </FadeUp>
          <Stagger
            className="mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-3"
            stagger={0.1}
          >
            {steps.map((step) => (
              <StaggerItem key={step.num}>
                <div className="group rounded-2xl border border-border p-6 transition-colors hover:border-pulse/40 hover:bg-pulse/5">
                  <span className="font-mono text-3xl font-semibold text-pulse">
                    {step.num}
                  </span>
                  <h3 className="mt-3 text-base font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <FadeUp delay={0.3}>
            <p className="mt-8 text-center text-sm text-muted-foreground">
              From first brief to working engineer in under 3 weeks.
            </p>
          </FadeUp>
        </section>

        {/* ═══ Section 4: Savings Calculator ═══ */}
        <section className="border-y bg-muted/30">
          <HiringCalculator />
          <div className="container mx-auto px-6 pb-12 -mt-8">
            <FadeUp>
              <p className="text-center text-sm text-muted-foreground">
                Ready to see real profiles?{" "}
                <Link
                  href="/companies/signup"
                  className="font-medium text-foreground underline underline-offset-4 hover:text-pulse transition-colors"
                >
                  Get your free shortlist
                </Link>
              </p>
            </FadeUp>
          </div>
        </section>

        {/* ═══ Section 5: Proof Block — Vetting ═══ */}
        <section className="container mx-auto px-6 py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <SlideIn from="left">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Vetting Process
                </span>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight lg:text-4xl">
                  1 in 25 applicants accepted
                </h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  From over 25,000 applicants, only 1,000 engineers have been
                  accepted into our network. Every engineer has passed all 5
                  stages — no exceptions.
                </p>
                <Link
                  href="/how-we-vet"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium underline underline-offset-4 hover:text-pulse transition-colors"
                >
                  See our full vetting methodology
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </SlideIn>
            <SlideIn from="right">
              <div className="space-y-4">
                {vettingStages.map((stage, i) => {
                  const Icon = stage.icon;
                  return (
                    <div key={stage.label} className="flex items-center gap-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/50">
                        <Icon className="size-4 text-pulse" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium">{stage.label}</span>
                          <span className="font-mono text-xs text-muted-foreground">
                            {stage.passRate}% remain
                          </span>
                        </div>
                        <FillBar
                          percent={stage.passRate}
                          delay={i * 0.1}
                          color={stage.passRate <= 4 ? "bg-pulse" : "bg-foreground/20"}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </SlideIn>
          </div>
        </section>

        {/* ═══ Section 6: Compliance Block ═══ */}
        <section className="border-y bg-muted/30 py-24">
          <div className="container mx-auto px-6">
            <FadeUp>
              <div className="mx-auto mb-12 max-w-2xl text-center">
                <h2 className="text-3xl font-semibold tracking-tight lg:text-4xl">
                  Contracts, Payroll, Tax, IP: All Handled.{" "}
                  <span className="text-muted-foreground">One Invoice.</span>
                </h2>
                <p className="mt-4 text-muted-foreground">
                  We act as Employer of Record so you don&apos;t need to set up
                  foreign entities.
                </p>
              </div>
            </FadeUp>
            <Stagger
              className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2"
              stagger={0.08}
            >
              {complianceBlocks.map((block) => {
                const Icon = block.icon;
                return (
                  <StaggerItem key={block.title}>
                    <div className="group flex items-start gap-4 rounded-2xl border border-border bg-background p-6 transition-colors hover:border-pulse/40">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/50">
                        <Icon className="size-4 text-pulse" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">{block.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                          {block.description}
                        </p>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        </section>

        {/* ═══ Section 7: Pricing Signal ═══ */}
        <section className="container mx-auto px-6 py-24">
          <FadeUp>
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Pricing
              </span>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight lg:text-4xl">
                Transparent Pricing, No Hidden Fees
              </h2>
              <p className="mt-4 text-muted-foreground">
                Typical monthly rates: $3,000–$6,000 per developer depending on
                seniority and stack.
              </p>
            </div>
          </FadeUp>

          <Stagger
            className="mx-auto grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-2"
            stagger={0.1}
          >
            {/* On-Demand */}
            <StaggerItem>
              <div className="group flex flex-col gap-5 rounded-3xl bg-foreground p-8 transition-transform duration-200 hover:-translate-y-1">
                <div>
                  <h3 className="text-sm font-semibold text-background">
                    On-Demand
                  </h3>
                  <p className="mt-1 text-xs text-background/60">
                    Free to post. Pay per developer monthly.
                  </p>
                </div>
                <div>
                  <span className="font-mono text-4xl font-semibold text-background">
                    FREE
                  </span>
                  <span className="ml-2 text-sm text-background/50">
                    to get started
                  </span>
                  <p className="mt-1 text-xs text-background/50">
                    14-day replacement guarantee
                  </p>
                </div>
                <Button
                  asChild
                  variant="secondary"
                  className="rounded-full gap-2"
                >
                  <Link href="/companies/signup">
                    Post a Role Free
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <ul className="space-y-2.5">
                  {onDemandFeatures.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2.5 text-sm text-background/80"
                    >
                      <Check
                        className="size-4 shrink-0 text-background/40"
                        strokeWidth={2.5}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>

            {/* Marketplace */}
            <StaggerItem>
              <div className="group flex flex-col gap-5 rounded-3xl border bg-card p-8 transition-all duration-200 hover:-translate-y-1 hover:border-foreground/20">
                <div>
                  <h3 className="text-sm font-semibold">Marketplace</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Direct access. Volume pricing.
                  </p>
                </div>
                <div>
                  <span className="font-mono text-2xl font-semibold">
                    Contact Sales
                  </span>
                  <p className="mt-1 text-xs text-muted-foreground">
                    30-day replacement guarantee
                  </p>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full gap-2"
                >
                  <Link href="/companies/signup">
                    Get a Custom Quote
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <ul className="space-y-2.5">
                  {marketplaceFeatures.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2.5 text-sm"
                    >
                      <Check
                        className="size-4 shrink-0 text-pulse"
                        strokeWidth={2.5}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          </Stagger>
        </section>

        {/* ═══ Section 8: FAQ ═══ */}
        <section className="border-t bg-muted/30 py-24">
          <div className="container mx-auto px-6">
            <FadeUp>
              <div className="mx-auto max-w-2xl">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Frequently asked questions
                </h2>
                <div className="mt-8 divide-y divide-border">
                  {faqs.map((faq) => (
                    <div key={faq.question} className="py-6">
                      <h3 className="text-sm font-semibold">{faq.question}</h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                      {"link" in faq && faq.link && (
                        <Link
                          href={faq.link.href}
                          className="mt-2 inline-flex items-center gap-1 text-xs font-medium underline underline-offset-4 hover:text-pulse transition-colors"
                        >
                          {faq.link.label}
                          <ArrowRight className="size-3" />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ═══ Section 9: Final CTA ═══ */}
        <section className="container mx-auto px-6 py-24">
          <ScaleIn>
            <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-background p-10 text-center md:p-16">
              <h2 className="text-3xl font-semibold tracking-tight lg:text-4xl">
                Ready to Hire Smarter?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
                No placement fees. No long-term lock-in. Your first shortlist in
                48 hours.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full gap-2 w-full sm:w-auto"
                >
                  <Link href="/companies/signup">
                    Get Your Free Shortlist
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full w-full sm:w-auto"
                >
                  <Link href="/companies/signup">
                    Book a Free Consultation
                  </Link>
                </Button>
              </div>
            </div>
          </ScaleIn>
        </section>
      </main>

      {/* Minimal footer — no distracting nav */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <Link href="/">
              <Logo width={110} height={26} />
            </Link>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="/security" className="hover:text-foreground transition-colors">
                Security
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">
              OctogleHire 2026
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
