"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, FileText, Users } from "lucide-react";

import { SlideShell } from "../_components/slide-shell";

const STEPS = [
  {
    icon: FileText,
    title: "Send us the role brief",
    body: "We'll turn your requirements into a vetted spec same-day.",
  },
  {
    icon: Users,
    title: "Meet your matches in 48h",
    body: "Review 3–5 hand-picked profiles. Interview only the ones you want to hire.",
  },
  {
    icon: Calendar,
    title: "Ship by next week",
    body: "Sign, onboard, and kick off — contracts and payroll handled by us.",
  },
];

export const NextStepsSlide = () => {
  const params = useSearchParams();
  const company = params.get("company");
  const contact = params.get("contact");

  return (
    <SlideShell eyebrow="What happens next">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:items-center">
        {/* Left: headline + CTA */}
        <div className="space-y-10">
          <div className="space-y-5">
            <h2 className="text-4xl font-medium tracking-tight leading-[1.05] md:text-5xl lg:text-6xl">
              {company ? (
                <>
                  Next steps for
                  <br />
                  <span className="text-pulse">{company}</span>.
                </>
              ) : (
                <>
                  Ready to meet
                  <br />
                  your <span className="text-pulse">first match</span>?
                </>
              )}
            </h2>
            <p className="max-w-xl text-base text-muted-foreground md:text-lg leading-relaxed">
              {company
                ? `Share the role brief and we'll come back within 48 hours with 3–5 pre-vetted engineers ready to interview.`
                : "Share the role brief and we'll come back within 48 hours with 3–5 pre-vetted engineers ready to interview."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/companies/signup"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              {company ? `Send ${company}'s role brief` : "Send a role brief"}
              <ArrowRight className="size-4" />
            </a>
            <a
              href="/marketplace"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:border-foreground/40"
            >
              Browse engineers
              <ArrowRight className="size-4" />
            </a>
          </div>

          {contact && (
            <p className="text-sm text-muted-foreground border-t border-border pt-6">
              Thanks for your time,{" "}
              <span className="text-foreground font-medium">{contact}</span>.
              We&apos;ll follow up within 24 hours.
            </p>
          )}
        </div>

        {/* Right: 3 steps */}
        <div className="space-y-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.12, duration: 0.5 }}
                className="flex items-start gap-5 rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="inline-flex size-10 items-center justify-center rounded-full border border-pulse/30 bg-pulse/[0.08]">
                    <Icon
                      className="size-4 text-pulse"
                      strokeWidth={1.75}
                    />
                  </span>
                  <span className="font-mono text-[10px] font-semibold tabular-nums text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex-1 space-y-1.5 pt-1">
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

          <div className="mt-4 rounded-2xl border border-dashed border-pulse/40 bg-pulse/[0.04] p-5 text-center">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Typical timeline
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">
              Brief to signed contract in{" "}
              <span className="text-pulse">&lt; 5 business days</span>
            </p>
          </div>
        </div>
      </div>
    </SlideShell>
  );
};
