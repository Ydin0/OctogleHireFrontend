"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

interface FaqProps {
  className?: string;
}

const faqs = [
  {
    q: "How quickly can I hire a developer?",
    a: "You'll receive 3–5 vetted candidate profiles within 48 hours of your discovery call. Most companies go from first intro to signed contract in under 5 business days — compared to 6–12 weeks with traditional agencies.",
  },
  {
    q: "How are developers vetted?",
    a: "Every developer passes a 5-stage process: application screening, stack-specific technical assessment, live system design interview, soft-skills and communication evaluation, and reference checks. Only the top 3% of applicants make it into our network.",
  },
  {
    q: "What roles and tech stacks do you cover?",
    a: "We cover the full spectrum of software engineering: React, Node.js, Python, Go, Java, .NET, mobile (iOS/Android/Flutter), DevOps, cloud infrastructure, AI/ML, data engineering, and more. If it ships software, we can staff it.",
  },
  {
    q: "How much does it cost?",
    a: "OctogleHire developers typically cost 40–60% less than hiring locally in the US, UK, or Australia. There are no upfront fees — you only pay when you hire. We offer transparent monthly rates with no hidden markups or recruitment commissions.",
  },
  {
    q: "What happens if a developer isn't the right fit?",
    a: "Every placement includes a risk-free guarantee period. If a developer doesn't meet your expectations, we'll find a replacement at no additional cost and manage the entire transition for you.",
  },
  {
    q: "Can I hire full-time or only contractors?",
    a: "Both. We support contract, part-time, and full-time engagements. OctogleHire handles payroll, compliance, and local employment law regardless of the arrangement — so you can focus on building your product.",
  },
  {
    q: "Which time zones do your developers work in?",
    a: "Our network spans multiple time zones. During matching, we prioritise developers whose working hours overlap with yours by at least 4–6 hours, so real-time collaboration is seamless.",
  },
  {
    q: "Do you handle contracts and compliance?",
    a: "Yes. We manage all contracts, IP agreements, payroll, and tax compliance end-to-end. You get a single invoice — no need to set up foreign entities or navigate international employment law yourself.",
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
