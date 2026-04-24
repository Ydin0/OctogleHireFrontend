"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

import { SlideShell } from "../_components/slide-shell";

const ON_DEMAND = [
  "Free to post, free to receive candidates",
  "3–5 curated profiles within 48 hours",
  "All-inclusive monthly rate per developer",
  "Payroll, compliance & contracts managed",
  "Flexible — scale up or down any month",
  "14-day replacement guarantee",
  "Dedicated account manager",
];

const MARKETPLACE = [
  "Browse 1,000+ vetted profiles directly",
  "Unlimited concurrent role postings",
  "Priority matching & onboarding",
  "All-inclusive monthly rates",
  "Volume pricing available",
  "30-day replacement guarantee",
  "Senior account team",
];

export const PricingSlide = () => {
  return (
    <SlideShell eyebrow="Pricing">
      <div className="space-y-12">
        <div className="max-w-4xl space-y-5">
          <h2 className="text-4xl font-medium tracking-tight leading-[1.05] md:text-5xl lg:text-6xl">
            Start for{" "}
            <span className="font-mono text-pulse">free</span>.
            <br />
            <span className="text-muted-foreground">
              Pay only when you hire.
            </span>
          </h2>
          <p className="max-w-2xl text-base text-muted-foreground md:text-lg leading-relaxed">
            Two plans. Zero upfront fees. No placement commissions, no hidden
            markups.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* On-Demand */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="group flex flex-col gap-6 rounded-3xl bg-foreground p-8 md:p-10"
          >
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-background">
                  On-Demand
                </h3>
                <span className="rounded-full bg-background/15 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-background/70">
                  Zero upfront
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-background/60">
                We source, vet, and deliver candidates for free. Pay a simple
                monthly rate once your developer starts.
              </p>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-5xl font-semibold text-background md:text-6xl">
                  FREE
                </span>
                <span className="text-sm text-background/50">
                  to get started
                </span>
              </div>
              <p className="mt-1.5 text-xs text-background/40">
                Monthly rate per developer begins on their start date
              </p>
            </div>

            <a
              href="/companies/signup"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-semibold text-foreground transition-opacity hover:opacity-90"
            >
              Post a role free
              <ArrowRight className="size-4" />
            </a>

            <ul className="space-y-3">
              {ON_DEMAND.map((f) => (
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
          </motion.div>

          {/* Marketplace */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-8 md:p-10"
          >
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Marketplace</h3>
                <span className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  For scale
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Direct access to browse and engage from 1,000+ pre-vetted
                engineers — no waiting, no delivery window.
              </p>
            </div>

            <div>
              <span className="font-mono text-2xl font-semibold md:text-3xl">
                Custom
              </span>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Custom monthly rates · Volume pricing available
              </p>
            </div>

            <a
              href="/companies/signup"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:border-foreground/40"
            >
              Talk to sales
              <ArrowRight className="size-4" />
            </a>

            <ul className="space-y-3">
              {MARKETPLACE.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm">
                  <Check
                    className="size-4 shrink-0 text-pulse"
                    strokeWidth={2.5}
                  />
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </SlideShell>
  );
};
