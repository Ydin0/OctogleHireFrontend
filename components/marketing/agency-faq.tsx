"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

interface AgencyFaqProps {
  className?: string;
}

const faqs = [
  {
    q: "How do I register my agency?",
    a: "Click 'Register Your Agency' to create your organization account through Clerk. You'll provide basic agency details, agree to our terms, and receive your unique referral link — the whole process takes under 5 minutes.",
  },
  {
    q: "What commission rate do agencies earn?",
    a: "The base commission rate is 10% on every successful placement sourced through your referral link. Enterprise and volume agencies may qualify for custom rates — contact us for details.",
  },
  {
    q: "How does candidate attribution work?",
    a: "Every agency gets a unique referral URL (e.g. octoglehire.com/apply/a/your-agency). When candidates apply through your link, they're automatically and permanently attributed to your agency. No manual tracking or spreadsheets required.",
  },
  {
    q: "When do I get paid?",
    a: "Commissions are tracked in real-time on your dashboard. Payouts are processed monthly for all placements that have been confirmed and invoiced. You'll see pending and paid amounts clearly in your commission overview.",
  },
  {
    q: "Can I invite my team?",
    a: "Yes. Your agency organization supports multiple team members. Invite recruiters to your dashboard so they can submit candidates, track pipeline status, and view commission reports — all under your agency umbrella.",
  },
  {
    q: "What types of roles are available?",
    a: "OctogleHire has 300+ active requirements across the full spectrum of software engineering: React, Python, Node.js, Go, Java, DevOps, cloud infrastructure, AI/ML, mobile, and more. New roles are added weekly.",
  },
  {
    q: "Do I need to vet candidates myself?",
    a: "You can submit candidates at any stage. OctogleHire runs its own 5-stage vetting process (technical assessment, live interview, background check) on all candidates. Your role is sourcing — we handle the validation.",
  },
  {
    q: "Is there a minimum number of submissions?",
    a: "No. There are no minimums, no quotas, and no penalties. Submit one candidate or one hundred — you earn a commission on every successful placement regardless of volume.",
  },
  {
    q: "How do I track my commissions?",
    a: "Your agency dashboard includes a real-time commission tracker showing total earned, pending, and paid amounts. You can also see per-candidate status, placement history, and downloadable reports.",
  },
  {
    q: "What countries do you operate in?",
    a: "OctogleHire operates in 30+ countries. You can source candidates from anywhere — OctogleHire handles all contracts, compliance, payroll, and local employment law on behalf of the hiring company.",
  },
];

const AgencyFaq = ({ className }: AgencyFaqProps) => {
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
                <span className="text-base font-medium leading-snug">
                  {item.q}
                </span>
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

export { AgencyFaq };
