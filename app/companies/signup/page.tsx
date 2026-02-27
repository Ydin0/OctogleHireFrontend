import type { Metadata } from "next";
import { Check } from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Navbar } from "@/components/marketing/navbar";
import { CompanySignupForm } from "./_components/company-signup-form";

export const metadata: Metadata = {
  title: "Book a Discovery Call | OctogleHire",
  description:
    "Tell us about your hiring needs and we'll match you with pre-vetted engineers in 48 hours.",
};

const benefits = [
  {
    title: "Matched in 48 hours",
    description:
      "Receive a curated shortlist of developer profiles within two business days of your call.",
  },
  {
    title: "Rigorously pre-vetted",
    description:
      "Every engineer passes live technical screens, system design rounds, and communication assessments.",
  },
  {
    title: "Zero hiring risk",
    description:
      "Not the right fit in the first 30 days? We find a replacement at no extra cost.",
  },
  {
    title: "Fully managed compliance",
    description:
      "Contracts, payroll, and taxes handled end-to-end — no legal overhead on your side.",
  },
];

const stats = [
  { value: "48h", label: "Avg. time to first match" },
  { value: "94%", label: "6-month retention rate" },
  { value: "60%", label: "Lower cost vs agencies" },
];

export default function CompanySignupPage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_460px] gap-12 xl:gap-20 py-16 lg:py-24 lg:items-start">

            {/* ── Left — value props ── */}
            <div className="lg:sticky lg:top-24 space-y-10">

              {/* Headline block */}
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  For Companies
                </span>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight lg:text-5xl">
                  Hire world-class engineers.
                  <br />
                  In 48 hours.
                </h1>
                <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                  OctogleHire connects you with pre-vetted engineers
                  ready to contribute from day one — at a fraction of the local
                  cost.
                </p>
              </div>

              {/* Benefits */}
              <ul className="space-y-5">
                {benefits.map((b) => (
                  <li key={b.title} className="flex gap-3.5 items-start">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-border bg-muted">
                      <Check className="size-3 text-foreground" strokeWidth={2.5} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{b.title}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {b.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 border-t pt-8">
                {stats.map((s) => (
                  <div key={s.label}>
                    <p className="font-mono text-2xl font-semibold text-pulse lg:text-3xl">
                      {s.value}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>

            </div>

            {/* ── Right — form ── */}
            <div>
              <div className="rounded-2xl border bg-card p-7 lg:p-8">
                <div className="mb-6 flex items-start gap-3.5">
                  <a href="https://www.linkedin.com/in/yaseen-deen-52249219b/" target="_blank" rel="noopener noreferrer" className="shrink-0">
                    <Avatar className="size-12 ring-2 ring-border">
                      <AvatarImage src="/Yaseen Founder.jpg" alt="Yaseen" className="scale-110" />
                      <AvatarFallback>Y</AvatarFallback>
                    </Avatar>
                  </a>
                  <div>
                    <p className="text-sm font-semibold">Yaseen Deen</p>
                    <p className="text-xs text-muted-foreground">Co-Founder at OctogleHire</p>
                    <p className="mt-1.5 text-sm text-muted-foreground italic">
                      &ldquo;I&apos;ll personally match you with the right team.&rdquo;
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold">
                    Book a free discovery call
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    30 minutes · No commitment · Results in 48h
                  </p>
                </div>
                <CompanySignupForm />
              </div>

              {/* Trust row */}
              <div className="mt-4 flex items-center justify-center gap-5 flex-wrap">
                {["No commitment", "Free consultation", "Instant response"].map(
                  (label) => (
                    <span
                      key={label}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground"
                    >
                      <Check className="size-3.5" />
                      {label}
                    </span>
                  ),
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
