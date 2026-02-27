"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

interface FaqProps {
  className?: string;
}

const faqs = [
  {
    q: "How long does it take to hire a developer through OctogleHire?",
    a: "Most companies receive 3–5 vetted candidate profiles within 48 hours of posting a role. From there, the average time to make an offer is 5–7 days — compared to 6–12 weeks using traditional recruitment agencies.",
  },
  {
    q: "How are developers vetted on OctogleHire?",
    a: "Every developer goes through a rigorous 5-stage process: application review, stack-specific technical assessment, live system design interview, background check, and reference verification. Only the top 5% of applicants are approved to join the network.",
  },
  {
    q: "What types of roles can I post?",
    a: "Any software engineering role — full-stack, frontend, backend, mobile (iOS/Android), DevOps, cloud infrastructure, AI/ML, data engineering, and more. We cover contract, project-based, and full-time engagements.",
  },
  {
    q: "How does billing work?",
    a: "On the free Pay Per Hire plan, there are no upfront costs — you only pay a one-time success fee when you make a hire. The Scale plan is a flat monthly subscription with no per-hire fees. Enterprise pricing is available for large teams.",
  },
  {
    q: "What if a developer isn't the right fit?",
    a: "All placements come with a talent guarantee. If a developer doesn't meet your expectations within the guarantee period, we replace them at no additional cost. Your account manager handles the transition.",
  },
  {
    q: "Can I hire developers full-time or only on contract?",
    a: "Both. OctogleHire supports hourly, weekly, monthly, and full-time engagements. We handle payroll and compliance regardless of the arrangement — whether you want a long-term team member or a project-specific hire.",
  },
];

const Faq = ({ className }: FaqProps) => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className={cn("py-24 container mx-auto px-6", className)}>
      {/* Header */}
      <div className="mx-auto mb-14 max-w-xl text-center">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          FAQ
        </span>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight lg:text-5xl">
          Frequently asked questions
        </h2>
      </div>

      {/* Accordion */}
      <div className="mx-auto max-w-2xl border-t border-border">
        {faqs.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="border-b border-border">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-start justify-between gap-4 py-6 text-left"
              >
                <span className="text-base font-medium leading-snug">{item.q}</span>
                <ChevronDown
                  className={cn(
                    "size-4 text-muted-foreground shrink-0 mt-0.5 transition-transform duration-300",
                    isOpen && "rotate-180",
                  )}
                />
              </button>

              {/* Smooth expand */}
              <div
                className={cn(
                  "grid transition-all duration-300 ease-in-out",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <p className="pb-6 text-sm text-muted-foreground leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export { Faq };
