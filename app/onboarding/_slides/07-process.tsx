"use client";

import { motion } from "framer-motion";

import { SlideShell } from "../_components/slide-shell";
import {
  EngagementMockup,
  MatchesMockup,
  PostRoleMockup,
} from "@/components/marketing/features-showcase";

const STEPS = [
  {
    num: "01",
    title: "Post your role",
    body: "15-min call. We turn your brief into a vetted spec that same day.",
    Mockup: PostRoleMockup,
  },
  {
    num: "02",
    title: "Matched in 48h",
    body: "3–5 hand-picked, pre-vetted profiles — each one ready to interview.",
    Mockup: MatchesMockup,
  },
  {
    num: "03",
    title: "Start engagement",
    body: "Pick your hires. We handle contracts, payroll, and compliance.",
    Mockup: EngagementMockup,
  },
];

export const ProcessSlide = () => {
  return (
    <SlideShell eyebrow="How hiring works">
      <div className="space-y-12">
        <div className="max-w-4xl space-y-5">
          <h2 className="text-4xl font-medium tracking-tight leading-[1.05] md:text-5xl lg:text-6xl">
            From role posted
            <br />
            to team shipped —{" "}
            <span className="font-mono text-pulse">in 48 hours</span>.
          </h2>
          <p className="max-w-2xl text-base text-muted-foreground md:text-lg leading-relaxed">
            Three steps. No recruitment agencies, no 6-week pipelines, no
            upfront fees.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {STEPS.map((step, i) => {
            const { Mockup } = step;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.12, duration: 0.5 }}
                className="flex flex-col rounded-3xl border border-border bg-muted/30 p-5 md:p-6"
              >
                <div className="mb-5">
                  <Mockup />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex size-6 items-center justify-center rounded-full border border-border bg-background font-mono text-[10px] font-semibold">
                      {step.num}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Step {step.num}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SlideShell>
  );
};
