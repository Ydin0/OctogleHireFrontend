"use client";

import { motion } from "framer-motion";
import { Sparkles, TrendingDown, Zap } from "lucide-react";

import { SlideShell } from "../_components/slide-shell";

const PILLARS = [
  {
    icon: Sparkles,
    label: "AI Native",
    value: "Trained, not just aware",
    body: "Every engineer completes the Octogle AI Playbook — 40+ hours across Cursor, Claude Code, RAG, and agentic workflows.",
  },
  {
    icon: Zap,
    label: "48h Match",
    value: "Three shortlists. Two days.",
    body: "Post a role, receive 3–5 hand-picked, vetted profiles within 48 hours. Sign a contract in under a week.",
  },
  {
    icon: TrendingDown,
    label: "40–60% Savings",
    value: "Senior talent, fair pricing",
    body: "Global network, fair rates, no recruitment markups. Same caliber of engineer, priced for how you actually hire.",
  },
];

export const IntroducingSlide = () => {
  return (
    <SlideShell eyebrow="Introducing OctogleHire">
      <div className="space-y-14">
        <div className="max-w-5xl space-y-6">
          <h2 className="text-5xl font-medium tracking-tight leading-[1.05] md:text-6xl lg:text-7xl">
            <span className="text-pulse">AI Native</span> engineers,
            <br />
            delivered in{" "}
            <span className="font-mono text-pulse">48 hours</span>,
            <br />
            at <span className="font-mono">40–60%</span> lower cost.
          </h2>
          <p className="max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed">
            One network. Three promises. No trade-offs between speed, cost, and
            quality.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.12, duration: 0.5 }}
                className="rounded-3xl border border-border bg-card p-8 space-y-5"
              >
                <div className="flex size-11 items-center justify-center rounded-2xl border border-pulse/30 bg-pulse/[0.08]">
                  <Icon className="size-5 text-pulse" strokeWidth={1.75} />
                </div>
                <div className="space-y-2">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {p.label}
                  </p>
                  <p className="text-xl font-semibold leading-tight tracking-tight">
                    {p.value}
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SlideShell>
  );
};
