import type { Metadata } from "next";

import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { absoluteUrl, SITE_URL, webPageSchema, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import {
  ComparePageLayout,
  type ComparePageData,
} from "../_components/compare-page-layout";

export const metadata: Metadata = {
  title: "OctogleHire vs Upwork — Comparison",
  description:
    "Compare OctogleHire and Upwork. Skip weeks of filtering unvetted profiles — get 3–5 pre-vetted engineers matched to your stack in 48 hours.",
  alternates: { canonical: absoluteUrl("/compare/upwork") },
  openGraph: {
    title: "OctogleHire vs Upwork — Stop Filtering, Start Building",
    description:
      "Pre-vetted engineers in 48 hours vs weeks of sorting through open marketplace profiles.",
    url: absoluteUrl("/compare/upwork"),
  },
};

const data: ComparePageData = {
  competitorName: "Upwork",
  competitorTagline: "Open freelance marketplace",
  competitorLogo: "/competitor-logos/upwork.svg",
  heroTitle: (
    <>
      Stop filtering.{" "}
      <span className="text-pulse">Start building.</span>
    </>
  ),
  heroDescription:
    "Upwork has millions of freelancers. The problem is finding the right one. OctogleHire delivers pre-vetted, interview-ready engineers in 48 hours — no sorting required.",
  verdict:
    "Upwork is great for quick, low-stakes freelance tasks. But for engineering roles where quality matters, you'll spend weeks filtering through proposals, running your own technical screens, and managing compliance. OctogleHire does all of that for you — and only sends you engineers who've already passed a 5-stage vetting process.",
  rows: [
    {
      dimension: "Vetting",
      competitor: "None — self-reported skills",
      competitorPass: false,
      octogle: "5-stage vetting — 1 in 25 accepted",
    },
    {
      dimension: "Time to Hire",
      competitor: "Weeks of filtering proposals",
      competitorPass: false,
      octogle: "48 hours to matched profiles",
    },
    {
      dimension: "Talent Quality",
      competitor: "Inconsistent — you screen",
      competitorPass: false,
      octogle: "Verified, interview-ready engineers",
    },
    {
      dimension: "Pricing",
      competitor: "Low rates, variable quality",
      competitorPass: false,
      octogle: "Competitive rates, guaranteed quality",
    },
    {
      dimension: "Compliance",
      competitor: "You manage contracts and tax",
      competitorPass: false,
      octogle: "Fully managed — 30+ countries",
    },
    {
      dimension: "Replacement",
      competitor: "None — rehire from scratch",
      competitorPass: false,
      octogle: "14–30 day replacement guarantee",
    },
    {
      dimension: "Support",
      competitor: "Community forums and tickets",
      competitorPass: false,
      octogle: "Dedicated account manager",
    },
    {
      dimension: "Technical Screening",
      competitor: "DIY — you run interviews",
      competitorPass: false,
      octogle: "Done for you — assessments + interviews",
    },
  ],
  reasons: [
    {
      stat: "0",
      title: "Zero Screening Work",
      description:
        "No more reading 50 proposals to find 2 worth interviewing. Every engineer we send has already passed technical assessments, live interviews, and background checks.",
      statLabel: "proposals to review",
    },
    {
      stat: "48h",
      title: "Matched in Hours, Not Weeks",
      description:
        "Post your requirements and receive 3–5 curated, stack-matched profiles within 48 hours. Not 48 proposals — 48 hours to vetted candidates.",
    },
    {
      stat: "5",
      title: "5-Stage Vetting Built In",
      description:
        "Application screening, coding assessments, live technical interviews, background checks, and ongoing performance monitoring. We do the work Upwork leaves to you.",
      statLabel: "vetting stages",
    },
    {
      stat: "30+",
      title: "Compliance Handled",
      description:
        "Contracts, payroll, tax compliance — managed across 30+ countries. On Upwork, you're responsible for classifying workers and managing international compliance.",
    },
    {
      stat: "94%",
      title: "Retention Over Churn",
      description:
        "94% of our placements extend beyond 6 months. Upwork freelancers average 2–3 month engagements before moving to the next project.",
    },
    {
      stat: "14–30d",
      title: "Replacement Guarantee",
      description:
        "If an engineer isn't the right fit, we replace them free of charge. On Upwork, you start the search from scratch.",
    },
  ],
  faqs: [
    {
      question: "I've had bad experiences hiring on Upwork. How is OctogleHire different?",
      answer:
        "The core difference is vetting. Upwork is an open marketplace — anyone can create a profile and bid on your job. OctogleHire only presents engineers who've passed our 5-stage vetting process. You're choosing from verified talent, not filtering through an ocean of self-reported profiles.",
    },
    {
      question: "Is OctogleHire more expensive than Upwork?",
      answer:
        "Our rates are higher than Upwork's bottom tier, but competitive with quality Upwork freelancers ($40–80+/hr range). The difference is you're not paying for screening time — every hour you'd spend filtering and interviewing Upwork candidates is saved.",
    },
    {
      question: "Can I use OctogleHire for short-term projects?",
      answer:
        "Yes. We offer flexible engagements from part-time to full-time, with no minimum contract length. Our on-demand tier is designed for project-based work.",
    },
    {
      question: "What if I need a very niche tech stack?",
      answer:
        "We support 40+ tech stacks and can source specialists for niche requirements. If we don't have an immediate match, we'll tell you upfront rather than sending unqualified profiles.",
    },
  ],
  otherComparisons: [
    { name: "Toptal", href: "/compare/toptal" },
    { name: "Turing", href: "/compare/turing" },
    { name: "Direct Hiring", href: "/compare/direct-hiring" },
  ],
};

export default function CompareUpworkPage() {
  return (
    <>
      <Navbar />
      <main>
        <ComparePageLayout data={data} />
      </main>
      <Footer />
      <JsonLd
        data={[
          webPageSchema({
            path: "/compare/upwork",
            name: "OctogleHire vs Upwork — Comparison",
            description:
              "Compare OctogleHire and Upwork. Skip weeks of filtering unvetted profiles — get 3-5 pre-vetted engineers matched to your stack in 48 hours.",
          }),
          breadcrumbSchema("/compare/upwork", [
            { name: "Home", url: SITE_URL },
            { name: "Compare", url: absoluteUrl("/compare") },
            { name: "vs Upwork" },
          ]),
          {
            "@type": "FAQPage",
            "@id": `${SITE_URL}/compare/upwork/#faq`,
            mainEntity: data.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          },
        ]}
      />
    </>
  );
}
