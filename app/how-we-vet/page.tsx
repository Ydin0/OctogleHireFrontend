import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  FileSearch,
  MessageSquare,
  Shield,
  ShieldCheck,
  UserCheck,
  Zap,
} from "lucide-react";

import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Button } from "@/components/ui/button";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "How We Vet — Our 5-Stage Process",
  description:
    "From over 25,000 applicants, only 1,000 engineers have been accepted. Learn how OctogleHire's 5-stage vetting process ensures you hire verified, exceptional talent.",
  alternates: { canonical: absoluteUrl("/how-we-vet") },
  openGraph: {
    title: "How We Vet — OctogleHire's 5-Stage Process",
    description:
      "From over 25,000 applicants, only 1,000 engineers have been accepted. Learn how our rigorous vetting works.",
    url: absoluteUrl("/how-we-vet"),
  },
};

const stats = [
  { value: "25,000+", label: "Applicants Reviewed" },
  { value: "1,000", label: "Engineers Accepted" },
  { value: "1 in 25", label: "Acceptance Rate" },
  { value: "5", label: "Vetting Stages" },
  { value: "94%", label: "6-Month Retention" },
  { value: "< 6%", label: "Replacement Rate" },
];

const stages = [
  {
    num: "01",
    title: "Application Screening",
    headline: "Apply. Verify. Shortlist.",
    icon: FileSearch,
    duration: "24–48 hours",
    passRate: "~40% advance",
    description:
      "Every developer submits a detailed application covering work history, tech stack proficiency, portfolio projects, and salary expectations. Our recruitment team manually reviews each profile against role-specific criteria.",
    whatWeLookFor: [
      "Minimum 2 years of professional experience",
      "Verifiable employment history and project portfolio",
      "Clear communication in written English",
      "Alignment with in-demand tech stacks (40+ supported)",
      "Realistic rate expectations for their experience level",
    ],
    whatGetsRejected: [
      "Incomplete or generic applications",
      "Unverifiable work history",
      "Skill claims that don't match portfolio evidence",
    ],
  },
  {
    num: "02",
    title: "Technical Assessment",
    headline: "Challenge. Evaluate. Prove.",
    icon: Zap,
    duration: "3–5 hours (self-paced)",
    passRate: "~35% advance",
    description:
      "Shortlisted candidates complete a rigorous, stack-specific coding assessment designed by senior engineers. These aren't trivial algorithm puzzles — they're real-world scenarios that test how a developer actually works.",
    whatWeLookFor: [
      "Stack-specific challenges (React, Node.js, Python, Go, Java, etc.)",
      "Timed coding problems testing problem-solving under pressure",
      "Code quality review — readability, structure, and best practices",
      "Architectural thinking — how they approach system design",
      "Edge case handling and error management",
    ],
    assessmentTypes: [
      "Build a REST API with authentication and data validation",
      "Implement a responsive UI component with state management",
      "Debug and optimise a production codebase with performance issues",
      "Design a database schema for a given set of requirements",
    ],
  },
  {
    num: "03",
    title: "Live Technical Interview",
    headline: "Meet. Discuss. Validate.",
    icon: MessageSquare,
    duration: "60–90 minutes",
    passRate: "~50% advance",
    description:
      "Candidates join a live interview with our engineering panel. This is a two-part session: a system design deep-dive followed by a soft-skills and communication evaluation. We assess how they think, not just what they know.",
    whatWeLookFor: [
      "System design — can they architect scalable solutions?",
      "Trade-off analysis — do they understand real-world constraints?",
      "Communication clarity — can they explain technical decisions?",
      "Collaboration signals — how do they respond to feedback?",
      "English fluency — professional working proficiency required",
    ],
    interviewFormat: [
      "30 min — System design walkthrough (live whiteboard)",
      "20 min — Technical deep-dive on past projects",
      "20 min — Communication, culture fit, and working style",
      "10 min — Q&A and candidate questions",
    ],
  },
  {
    num: "04",
    title: "Background & Reference Checks",
    headline: "Verify. Reference. Confirm.",
    icon: ShieldCheck,
    duration: "3–5 business days",
    passRate: "~85% advance",
    description:
      "We verify employment history, contact professional references, and confirm identity. Only candidates with a proven track record of consistent delivery and positive team feedback make it through.",
    whatWeLookFor: [
      "3+ professional references from previous managers or leads",
      "Employment history verification (dates, roles, companies)",
      "Identity and credential verification",
      "Assessment of reliability, professionalism, and team impact",
      "Any red flags from past engagements",
    ],
    referenceQuestions: [
      "How would you rate their technical skills relative to peers?",
      "Did they consistently meet deadlines and deliverables?",
      "How did they handle disagreements or technical trade-offs?",
      "Would you hire them again for a similar role?",
    ],
  },
  {
    num: "05",
    title: "Approved & Matched",
    headline: "Match. Onboard. Deliver.",
    icon: UserCheck,
    duration: "Ongoing",
    passRate: "Final 1 in 25",
    description:
      "Approved developers join our verified talent network and are immediately eligible for matching. We match based on skill fit, timezone overlap, rate alignment, and availability. Performance is tracked continuously.",
    whatHappensNext: [
      "Profile goes live in our matching engine within 24 hours",
      "Matched to open roles based on tech stack, timezone, and rate fit",
      "Companies receive 3–5 curated profiles within 48 hours of posting",
      "Ongoing performance monitoring and quarterly reviews",
      "Developers who underperform are removed from the network",
    ],
  },
];

export default function HowWeVetPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="border-b py-24 lg:py-32">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                How We Vet
              </span>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight lg:text-6xl">
                25,000+ applicants reviewed.{" "}
                <span className="text-muted-foreground">1,000 accepted.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
                Every engineer on OctogleHire has passed a rigorous 5-stage
                vetting process. No shortcuts, no self-reported skills — just
                verified, exceptional talent.
              </p>
              <div className="mt-8 flex justify-center gap-3">
                <Button asChild className="rounded-full gap-2">
                  <a href="/companies/signup">
                    Hire Vetted Engineers
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" className="rounded-full gap-2">
                  <a href="/marketplace">
                    Browse Profiles
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <section className="border-b bg-muted/30 py-10">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-mono text-2xl font-semibold lg:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stages */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-3xl">
              <div className="space-y-20">
                {stages.map((stage) => (
                  <div key={stage.num} className="relative">
                    {/* Stage number line */}
                    <div className="mb-6 flex items-center gap-4">
                      <span className="flex size-10 items-center justify-center rounded-full border font-mono text-sm font-semibold">
                        {stage.num}
                      </span>
                      <div>
                        <h2 className="text-xl font-semibold">{stage.title}</h2>
                        <p className="text-sm text-muted-foreground">
                          {stage.headline}
                        </p>
                      </div>
                    </div>

                    {/* Meta row */}
                    <div className="mb-4 flex flex-wrap gap-4">
                      <div className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs">
                        <Clock className="size-3 text-muted-foreground" />
                        {stage.duration}
                      </div>
                      <div className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs">
                        <Shield className="size-3 text-muted-foreground" />
                        {stage.passRate}
                      </div>
                    </div>

                    <p className="text-muted-foreground">{stage.description}</p>

                    {/* What we look for */}
                    {stage.whatWeLookFor && (
                      <div className="mt-6">
                        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          What We Evaluate
                        </h3>
                        <ul className="mt-3 space-y-2">
                          {stage.whatWeLookFor.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2.5 text-sm"
                            >
                              <CheckCircle className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* What gets rejected (stage 1) */}
                    {"whatGetsRejected" in stage && stage.whatGetsRejected && (
                      <div className="mt-5">
                        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Common Rejection Reasons
                        </h3>
                        <ul className="mt-3 space-y-2">
                          {stage.whatGetsRejected.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2.5 text-sm text-muted-foreground"
                            >
                              <span className="mt-0.5 size-4 shrink-0 text-center text-red-500">
                                &times;
                              </span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Assessment types (stage 2) */}
                    {"assessmentTypes" in stage && stage.assessmentTypes && (
                      <div className="mt-5">
                        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Example Assessment Tasks
                        </h3>
                        <ul className="mt-3 space-y-2">
                          {stage.assessmentTypes.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2.5 text-sm text-muted-foreground"
                            >
                              <Zap className="mt-0.5 size-3.5 shrink-0 text-amber-600" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Interview format (stage 3) */}
                    {"interviewFormat" in stage && stage.interviewFormat && (
                      <div className="mt-5">
                        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Interview Format
                        </h3>
                        <ul className="mt-3 space-y-2">
                          {stage.interviewFormat.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2.5 text-sm text-muted-foreground"
                            >
                              <Clock className="mt-0.5 size-3.5 shrink-0 text-sky-600" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Reference questions (stage 4) */}
                    {"referenceQuestions" in stage && stage.referenceQuestions && (
                      <div className="mt-5">
                        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          What We Ask References
                        </h3>
                        <ul className="mt-3 space-y-2">
                          {stage.referenceQuestions.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2.5 text-sm text-muted-foreground italic"
                            >
                              <MessageSquare className="mt-0.5 size-3.5 shrink-0 text-violet-600" />
                              &ldquo;{item}&rdquo;
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* What happens next (stage 5) */}
                    {"whatHappensNext" in stage && stage.whatHappensNext && (
                      <div className="mt-5">
                        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          After Approval
                        </h3>
                        <ul className="mt-3 space-y-2">
                          {stage.whatHappensNext.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2.5 text-sm"
                            >
                              <CheckCircle className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t bg-muted/30 py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              Hire engineers who have already been vetted
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Skip months of screening. Every engineer on OctogleHire has
              passed all 5 stages. Book a demo and receive your first
              matched profiles within 48 hours.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Button asChild className="rounded-full gap-2">
                <a href="/companies/signup">
                  Book a Demo
                  <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button asChild variant="outline" className="rounded-full gap-2">
                <a href="/apply">
                  Apply as a Developer
                  <ArrowRight className="size-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
