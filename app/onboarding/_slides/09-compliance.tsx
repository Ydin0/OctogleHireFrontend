"use client";

import { motion } from "framer-motion";
import {
  FileCheck,
  Globe2,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";

import { SlideShell } from "../_components/slide-shell";

const ITEMS = [
  {
    icon: Globe2,
    title: "Employer of Record in 30+ countries",
    body: "We handle local employment law, tax, NI, and benefits — you get a single invoice, wherever your team is.",
  },
  {
    icon: FileCheck,
    title: "Contracts + IP + NDAs managed",
    body: "Full legal scaffolding handled end-to-end. Your IP stays yours, enforceable in your jurisdiction.",
  },
  {
    icon: Wallet,
    title: "Single-invoice billing",
    body: "One monthly invoice covering every engineer, every country. No FX spreadsheets, no reconciliation.",
  },
  {
    icon: ShieldCheck,
    title: "ISO 27001 · GDPR · CCPA",
    body: "Security and privacy controls built to enterprise standards. SOC 2 Type II in progress.",
  },
  {
    icon: RefreshCcw,
    title: "14 / 30 day replacement guarantee",
    body: "If an engineer isn't the right fit, we handle the transition at no additional cost.",
  },
  {
    icon: Sparkles,
    title: "Dedicated account team",
    body: "Every engagement gets a named account manager who owns onboarding, ongoing support, and replacements.",
  },
];

export const ComplianceSlide = () => {
  return (
    <SlideShell eyebrow="Compliance + guarantees">
      <div className="space-y-12">
        <div className="max-w-4xl space-y-5">
          <h2 className="text-4xl font-medium tracking-tight leading-[1.05] md:text-5xl lg:text-6xl">
            Global hires.
            <br />
            <span className="text-muted-foreground">Zero legal overhead.</span>
          </h2>
          <p className="max-w-2xl text-base text-muted-foreground md:text-lg leading-relaxed">
            You focus on shipping. We handle contracts, payroll, tax, and
            local employment law across every country we operate in.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.08, duration: 0.4 }}
                className="rounded-2xl border border-border bg-card p-6 space-y-4"
              >
                <div className="flex size-10 items-center justify-center rounded-xl border border-border">
                  <Icon className="size-4 text-foreground" strokeWidth={1.75} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-semibold leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.body}
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
