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
import { absoluteUrl, SITE_URL, SITE_NAME, webPageSchema, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import {
  FadeUp,
  Stagger,
  StaggerItem,
  ScaleIn,
  SlideIn,
  CountUp,
  FillBar,
} from "@/components/marketing/animated";

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
    passPercent: 40,
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
    passPercent: 35,
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
    passPercent: 50,
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
    passPercent: 85,
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
    passPercent: 100,
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
              <FadeUp>
                <span className="inline-block rounded-full border border-border px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  How We Vet
                </span>
              </FadeUp>
              <FadeUp delay={0.1}>
                <h1 className="mt-6 text-4xl font-semibold tracking-tight lg:text-6xl">
                  25,000+ applicants reviewed.{" "}
                  <span className="text-muted-foreground">1,000 accepted.</span>
                </h1>
              </FadeUp>
              <FadeUp delay={0.2}>
                <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
                  Every engineer on OctogleHire has passed a rigorous 5-stage
                  vetting process. No shortcuts, no self-reported skills — just
                  verified, exceptional talent.
                </p>
              </FadeUp>
              <FadeUp delay={0.3}>
                <div className="mt-8 flex justify-center gap-3">
                  <Button asChild className="rounded-full gap-2">
                    <a href="/companies/signup">
                      Hire Vetted Engineers
                      <ArrowRight className="size-4" />
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full gap-2"
                  >
                    <a href="/marketplace">
                      Browse Profiles
                      <ArrowRight className="size-4" />
                    </a>
                  </Button>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <section className="border-b bg-muted/30 py-10">
          <div className="container mx-auto px-6">
            <Stagger
              className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6"
              stagger={0.06}
            >
              {stats.map((stat) => (
                <StaggerItem key={stat.label}>
                  <div className="text-center">
                    <CountUp
                      value={stat.value}
                      className="block font-mono text-2xl font-semibold lg:text-3xl"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* Funnel visual */}
        <section className="container mx-auto px-6 py-16">
          <FadeUp>
            <div className="mx-auto max-w-2xl">
              <p className="mb-6 text-center text-sm font-medium text-muted-foreground">
                Applicant funnel — from 25,000 down to 1,000
              </p>
              <div className="space-y-3">
                {[
                  { label: "Applications received", pct: 100, count: "25,000+" },
                  { label: "Pass screening", pct: 40, count: "~10,000" },
                  { label: "Pass assessment", pct: 14, count: "~3,500" },
                  { label: "Pass interview", pct: 7, count: "~1,750" },
                  { label: "Pass background check", pct: 6, count: "~1,500" },
                  { label: "Approved & matched", pct: 4, count: "1,000" },
                ].map((step, i) => (
                  <div key={step.label} className="flex items-center gap-4">
                    <span className="w-40 shrink-0 text-right text-xs text-muted-foreground">
                      {step.label}
                    </span>
                    <div className="flex-1">
                      <FillBar
                        percent={step.pct}
                        delay={i * 0.12}
                        color={step.pct === 4 ? "bg-pulse" : "bg-foreground/20"}
                      />
                    </div>
                    <span className="w-16 font-mono text-xs tabular-nums">
                      {step.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </section>

        {/* Stages */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-3xl">
              <div className="space-y-24">
                {stages.map((stage, stageIdx) => {
                  const Icon = stage.icon;
                  const isEven = stageIdx % 2 === 0;

                  return (
                    <div key={stage.num}>
                      {/* Stage header */}
                      <SlideIn from={isEven ? "left" : "right"}>
                        <div className="mb-8 flex items-start gap-5">
                          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-muted/50">
                            <Icon className="size-6 text-pulse" />
                          </div>
                          <div>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                              Stage {stage.num}
                            </span>
                            <h2 className="text-2xl font-semibold tracking-tight lg:text-3xl">
                              {stage.title}
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {stage.headline}
                            </p>
                          </div>
                        </div>
                      </SlideIn>

                      {/* Meta pills + pass rate bar */}
                      <FadeUp delay={0.1}>
                        <div className="mb-2 flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs">
                            <Clock className="size-3 text-muted-foreground" />
                            {stage.duration}
                          </div>
                          <div className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs">
                            <Shield className="size-3 text-muted-foreground" />
                            {stage.passRate}
                          </div>
                        </div>
                        <FillBar
                          percent={stage.passPercent}
                          delay={0.2}
                          color="bg-pulse"
                        />
                      </FadeUp>

                      <FadeUp delay={0.15}>
                        <p className="mt-6 text-muted-foreground leading-relaxed">
                          {stage.description}
                        </p>
                      </FadeUp>

                      {/* What we look for */}
                      {stage.whatWeLookFor && (
                        <FadeUp delay={0.2}>
                          <div className="mt-8">
                            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                              What We Evaluate
                            </h3>
                            <Stagger
                              className="mt-4 space-y-2.5"
                              stagger={0.06}
                              delay={0.1}
                            >
                              {stage.whatWeLookFor.map((item) => (
                                <StaggerItem key={item}>
                                  <div className="flex items-start gap-2.5 text-sm">
                                    <CheckCircle className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                                    {item}
                                  </div>
                                </StaggerItem>
                              ))}
                            </Stagger>
                          </div>
                        </FadeUp>
                      )}

                      {/* What gets rejected (stage 1) */}
                      {"whatGetsRejected" in stage &&
                        stage.whatGetsRejected && (
                          <FadeUp delay={0.25}>
                            <div className="mt-6">
                              <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Common Rejection Reasons
                              </h3>
                              <Stagger
                                className="mt-4 space-y-2.5"
                                stagger={0.06}
                              >
                                {stage.whatGetsRejected.map((item) => (
                                  <StaggerItem key={item}>
                                    <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                      <span className="mt-0.5 size-4 shrink-0 text-center text-red-500">
                                        &times;
                                      </span>
                                      {item}
                                    </div>
                                  </StaggerItem>
                                ))}
                              </Stagger>
                            </div>
                          </FadeUp>
                        )}

                      {/* Assessment types (stage 2) */}
                      {"assessmentTypes" in stage &&
                        stage.assessmentTypes && (
                          <FadeUp delay={0.25}>
                            <div className="mt-6">
                              <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Example Assessment Tasks
                              </h3>
                              <Stagger
                                className="mt-4 space-y-2.5"
                                stagger={0.06}
                              >
                                {stage.assessmentTypes.map((item) => (
                                  <StaggerItem key={item}>
                                    <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                      <Zap className="mt-0.5 size-3.5 shrink-0 text-amber-600" />
                                      {item}
                                    </div>
                                  </StaggerItem>
                                ))}
                              </Stagger>
                            </div>
                          </FadeUp>
                        )}

                      {/* Interview format (stage 3) */}
                      {"interviewFormat" in stage &&
                        stage.interviewFormat && (
                          <FadeUp delay={0.25}>
                            <div className="mt-6">
                              <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Interview Format
                              </h3>
                              <Stagger
                                className="mt-4 space-y-2.5"
                                stagger={0.06}
                              >
                                {stage.interviewFormat.map((item) => (
                                  <StaggerItem key={item}>
                                    <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                      <Clock className="mt-0.5 size-3.5 shrink-0 text-sky-600" />
                                      {item}
                                    </div>
                                  </StaggerItem>
                                ))}
                              </Stagger>
                            </div>
                          </FadeUp>
                        )}

                      {/* Reference questions (stage 4) */}
                      {"referenceQuestions" in stage &&
                        stage.referenceQuestions && (
                          <FadeUp delay={0.25}>
                            <div className="mt-6">
                              <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                What We Ask References
                              </h3>
                              <Stagger
                                className="mt-4 space-y-2.5"
                                stagger={0.06}
                              >
                                {stage.referenceQuestions.map((item) => (
                                  <StaggerItem key={item}>
                                    <div className="flex items-start gap-2.5 text-sm text-muted-foreground italic">
                                      <MessageSquare className="mt-0.5 size-3.5 shrink-0 text-violet-600" />
                                      &ldquo;{item}&rdquo;
                                    </div>
                                  </StaggerItem>
                                ))}
                              </Stagger>
                            </div>
                          </FadeUp>
                        )}

                      {/* What happens next (stage 5) */}
                      {"whatHappensNext" in stage &&
                        stage.whatHappensNext && (
                          <FadeUp delay={0.2}>
                            <div className="mt-8">
                              <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                After Approval
                              </h3>
                              <Stagger
                                className="mt-4 space-y-2.5"
                                stagger={0.06}
                                delay={0.1}
                              >
                                {stage.whatHappensNext.map((item) => (
                                  <StaggerItem key={item}>
                                    <div className="flex items-start gap-2.5 text-sm">
                                      <CheckCircle className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                                      {item}
                                    </div>
                                  </StaggerItem>
                                ))}
                              </Stagger>
                            </div>
                          </FadeUp>
                        )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t py-20">
          <div className="container mx-auto px-6">
            <ScaleIn>
              <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-muted/30 p-10 text-center md:p-16">
                <h2 className="text-3xl font-semibold tracking-tight lg:text-4xl">
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
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full gap-2"
                  >
                    <a href="/apply">
                      Apply as a Developer
                      <ArrowRight className="size-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </ScaleIn>
          </div>
        </section>
      </main>
      <Footer />
      <JsonLd
        data={[
          webPageSchema({
            path: "/how-we-vet",
            name: "How We Vet — OctogleHire",
            description:
              "From over 25,000 applicants, only 1,000 engineers have been accepted. Learn how OctogleHire's 5-stage vetting process ensures you hire verified, exceptional talent.",
          }),
          breadcrumbSchema("/how-we-vet", [
            { name: "Home", url: SITE_URL },
            { name: "How We Vet" },
          ]),
          {
            "@type": "HowTo",
            "@id": `${SITE_URL}/how-we-vet/#howto`,
            name: "OctogleHire's 5-Stage Vetting Process",
            description:
              "Our rigorous 5-stage vetting process to accept only the top 1 in 25 applicants into the OctogleHire network.",
            step: [
              {
                "@type": "HowToStep",
                position: 1,
                name: "Application Screening",
                text: "Every developer submits a detailed application covering work history, tech stack proficiency, portfolio projects, and salary expectations. Our recruitment team manually reviews each profile against role-specific criteria.",
              },
              {
                "@type": "HowToStep",
                position: 2,
                name: "Technical Assessment",
                text: "Shortlisted candidates complete a rigorous, stack-specific coding assessment designed by senior engineers — real-world scenarios that test how a developer actually works.",
              },
              {
                "@type": "HowToStep",
                position: 3,
                name: "Live Technical Interview",
                text: "Candidates join a live 60-90 minute interview with our engineering panel covering system design, technical deep-dives, and communication evaluation.",
              },
              {
                "@type": "HowToStep",
                position: 4,
                name: "Background & Reference Checks",
                text: "We verify employment history, contact 3+ professional references, and confirm identity. Only candidates with a proven track record make it through.",
              },
              {
                "@type": "HowToStep",
                position: 5,
                name: "Approved & Matched",
                text: "Approved developers join our verified talent network and are immediately eligible for matching based on skill fit, timezone overlap, rate alignment, and availability.",
              },
            ],
          },
          {
            "@type": "Service",
            "@id": `${SITE_URL}/how-we-vet/#service`,
            name: "Pre-Vetted Developer Matching",
            provider: { "@id": `${SITE_URL}/#organization` },
            description:
              "OctogleHire matches companies with pre-vetted, world-class engineers from 30+ countries through a rigorous 5-stage vetting process.",
            serviceType: "Developer Staffing",
            areaServed: "Worldwide",
          },
        ]}
      />
    </>
  );
}
