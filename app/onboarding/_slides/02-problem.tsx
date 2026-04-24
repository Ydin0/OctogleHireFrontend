"use client";

import { motion } from "framer-motion";
import { Clock, Globe2, TrendingUp } from "lucide-react";

import { SlideShell } from "../_components/slide-shell";

const STATS = [
  {
    icon: Clock,
    value: "6–12",
    unit: "weeks",
    title: "To hire locally",
    detail:
      "Average time from opening a senior engineering role to first day in the US / UK.",
  },
  {
    icon: TrendingUp,
    value: "£120K",
    unit: "base",
    title: "Senior salary",
    detail:
      "UK senior engineer base salary — before bonus, equity, pension, NI, or benefits.",
  },
  {
    icon: Globe2,
    value: "40%",
    unit: "markup",
    title: "Agency fees",
    detail:
      "Recruitment agencies charge 20–40% of first-year salary per placement — upfront.",
  },
];

export const ProblemSlide = () => {
  return (
    <SlideShell eyebrow="The Problem">
      <div className="space-y-16">
        <div className="max-w-4xl space-y-6">
          <h2 className="text-5xl font-medium tracking-tight leading-[1.05] md:text-6xl lg:text-7xl">
            Hiring engineers{" "}
            <span className="text-muted-foreground">locally is</span>{" "}
            <span className="text-pulse">broken</span>.
          </h2>
          <p className="text-lg text-muted-foreground md:text-xl max-w-2xl leading-relaxed">
            Great engineers are scarce, slow to hire, and priced for a market
            that priced itself out years ago. Most companies accept this —
            we don&apos;t think they should have to.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.12, duration: 0.5 }}
                className="rounded-3xl border border-border bg-card p-8 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <Icon
                    className="size-5 text-muted-foreground"
                    strokeWidth={1.5}
                  />
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {stat.title}
                  </span>
                </div>
                <div>
                  <p className="font-mono text-5xl font-semibold tracking-tight md:text-6xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    {stat.unit}
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {stat.detail}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SlideShell>
  );
};
