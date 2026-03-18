"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, X as XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  FadeUp,
  Stagger,
  StaggerItem,
  ScaleIn,
  SlideIn,
  FillBar,
} from "@/components/marketing/animated";

/* ─── Types ───────────────────────────────────────────────────────────────── */

interface ComparisonRow {
  dimension: string;
  competitor: string;
  competitorPass: boolean;
  octogle: string;
}

interface FAQ {
  question: string;
  answer: string;
}

export interface ComparePageData {
  competitorName: string;
  competitorTagline: string;
  /** Path to competitor logo image (e.g. "/competitor-logos/turing.svg") */
  competitorLogo?: string;
  heroTitle: React.ReactNode;
  heroDescription: string;
  /** Short verdict paragraph shown above the table */
  verdict: string;
  rows: ComparisonRow[];
  /** Detailed sections — why switch */
  reasons: {
    title: string;
    description: string;
    stat?: string;
    statLabel?: string;
  }[];
  faqs: FAQ[];
  /** Other competitors to link to */
  otherComparisons: { name: string; href: string }[];
}

/* ─── Layout ──────────────────────────────────────────────────────────────── */

export function ComparePageLayout({ data }: { data: ComparePageData }) {
  return (
    <>
      {/* Hero */}
      <section className="container mx-auto px-6 py-20 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <FadeUp>
            <span className="inline-block rounded-full border border-border px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              OctogleHire vs {data.competitorName}
            </span>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight lg:text-6xl">
              {data.heroTitle}
            </h1>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
              {data.heroDescription}
            </p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <div className="mt-8 flex justify-center gap-3">
              <Button asChild size="lg" className="rounded-full gap-2">
                <Link href="/companies/signup">
                  Start Hiring
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full"
              >
                <Link href="/how-we-vet">How We Vet</Link>
              </Button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Verdict */}
      <section className="container mx-auto px-6 pb-16">
        <FadeUp>
          <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-muted/30 p-6 md:p-8 text-center">
            <p className="text-muted-foreground leading-relaxed">
              {data.verdict}
            </p>
          </div>
        </FadeUp>
      </section>

      {/* Comparison table */}
      <section className="container mx-auto px-6 pb-24">
        <FadeUp>
          <div className="mx-auto max-w-3xl">
            {/* Desktop table */}
            <div className="hidden md:block overflow-hidden rounded-3xl border border-border">
              {/* Header */}
              <div className="grid grid-cols-3 gap-px bg-border">
                <div className="bg-muted/30 p-5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Feature
                  </span>
                </div>
                <div className="bg-muted/30 p-5 flex items-center">
                  {data.competitorLogo ? (
                    <Image
                      src={data.competitorLogo}
                      alt={data.competitorName}
                      width={140}
                      height={40}
                      className="h-7 w-auto dark:brightness-0 dark:invert opacity-60"
                    />
                  ) : (
                    <span className="text-sm font-medium text-muted-foreground">
                      {data.competitorName}
                    </span>
                  )}
                </div>
                <div className="bg-muted/30 p-5 flex items-center">
                  <Logo width={120} height={28} />
                </div>
              </div>

              {/* Rows */}
              <Stagger stagger={0.04}>
                {data.rows.map((row) => (
                  <StaggerItem key={row.dimension}>
                    <div className="grid grid-cols-3 gap-px bg-border">
                      <div className="bg-background p-5">
                        <span className="text-sm font-semibold">
                          {row.dimension}
                        </span>
                      </div>
                      <div className="bg-background p-5 flex items-start gap-2.5">
                        {row.competitorPass ? (
                          <Check
                            className="size-4 shrink-0 text-muted-foreground mt-0.5"
                            strokeWidth={2}
                          />
                        ) : (
                          <XIcon
                            className="size-4 shrink-0 text-muted-foreground/40 mt-0.5"
                            strokeWidth={2}
                          />
                        )}
                        <span className="text-sm text-muted-foreground">
                          {row.competitor}
                        </span>
                      </div>
                      <div className="bg-background p-5 flex items-start gap-2.5">
                        <Check
                          className="size-4 shrink-0 text-pulse mt-0.5"
                          strokeWidth={2.5}
                        />
                        <span className="text-sm font-medium">
                          {row.octogle}
                        </span>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-4">
              <Stagger stagger={0.06}>
                {data.rows.map((row) => (
                  <StaggerItem key={row.dimension}>
                    <div className="rounded-2xl border border-border p-5 space-y-3">
                      <p className="text-sm font-semibold">{row.dimension}</p>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          {row.competitorPass ? (
                            <Check
                              className="size-3.5 shrink-0 text-muted-foreground mt-0.5"
                              strokeWidth={2}
                            />
                          ) : (
                            <XIcon
                              className="size-3.5 shrink-0 text-muted-foreground/40 mt-0.5"
                              strokeWidth={2}
                            />
                          )}
                          <div>
                            {data.competitorLogo ? (
                              <Image
                                src={data.competitorLogo}
                                alt={data.competitorName}
                                width={80}
                                height={24}
                                className="h-5 w-auto dark:brightness-0 dark:invert opacity-60"
                              />
                            ) : (
                              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                {data.competitorName}
                              </span>
                            )}
                            <p className="text-xs text-muted-foreground">
                              {row.competitor}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check
                            className="size-3.5 shrink-0 text-pulse mt-0.5"
                            strokeWidth={2.5}
                          />
                          <div>
                            <Logo width={80} height={18} />
                            <p className="text-xs font-medium">{row.octogle}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* Why switch */}
      <section className="container mx-auto px-6 pb-24">
        <FadeUp>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Why Switch
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight lg:text-4xl">
            What you get with OctogleHire
          </h2>
        </FadeUp>
        <Stagger
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.08}
        >
          {data.reasons.map((reason) => (
            <StaggerItem key={reason.title}>
              <div className="group flex h-full flex-col rounded-2xl border border-border p-6 transition-colors hover:border-pulse/40 hover:bg-pulse/5">
                {reason.stat && (
                  <span className="mb-3 font-mono text-2xl font-semibold text-pulse">
                    {reason.stat}
                  </span>
                )}
                <h3 className="text-sm font-semibold">{reason.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {reason.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-6 pb-24">
        <FadeUp>
          <div className="mx-auto max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight">
              Frequently asked questions
            </h2>
            <div className="mt-8 divide-y divide-border">
              {data.faqs.map((faq) => (
                <div key={faq.question} className="py-6">
                  <h3 className="text-sm font-semibold">{faq.question}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      </section>

      {/* Other comparisons */}
      <section className="container mx-auto px-6 pb-16">
        <FadeUp>
          <div className="mx-auto max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              More Comparisons
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {data.otherComparisons.map((comp) => (
                <Button
                  key={comp.href}
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  <Link href={comp.href}>
                    vs {comp.name}
                    <ArrowRight className="ml-1 size-3" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </FadeUp>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 pb-24">
        <ScaleIn>
          <div className="rounded-3xl border border-border bg-muted/30 p-10 text-center md:p-16">
            <h2 className="text-3xl font-semibold tracking-tight lg:text-4xl">
              Ready to switch?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Book a demo and receive your first matched profiles within 48
              hours. No placement fees, no long-term contracts.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="rounded-full gap-2">
                <Link href="/companies/signup">
                  Book a Demo
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full"
              >
                <Link href="/marketplace">Browse Engineers</Link>
              </Button>
            </div>
          </div>
        </ScaleIn>
      </section>
    </>
  );
}
