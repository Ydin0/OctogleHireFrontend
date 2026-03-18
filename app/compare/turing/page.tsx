import type { Metadata } from "next";

import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { absoluteUrl } from "@/lib/seo";
import {
  ComparePageLayout,
  type ComparePageData,
} from "../_components/compare-page-layout";

export const metadata: Metadata = {
  title: "OctogleHire vs Turing — Comparison",
  description:
    "Compare OctogleHire and Turing. Faster matching, transparent pricing, and human-led vetting vs AI-first screening. See the full breakdown.",
  alternates: { canonical: absoluteUrl("/compare/turing") },
  openGraph: {
    title: "OctogleHire vs Turing — Human Vetting Beats AI Screening",
    description:
      "Transparent rates, 48-hour matching, and 5-stage human-led vetting. Compare with Turing.",
    url: absoluteUrl("/compare/turing"),
  },
};

const data: ComparePageData = {
  competitorName: "Turing",
  competitorTagline: "AI-powered talent cloud",
  competitorLogo: "/competitor-logos/turing.svg",
  heroTitle: (
    <>
      Human vetting.{" "}
      <span className="text-pulse">Better results.</span>
    </>
  ),
  heroDescription:
    "Turing uses AI-first screening at scale. OctogleHire combines automated assessments with human-led technical interviews and background checks — because algorithms alone can't evaluate how an engineer actually works.",
  verdict:
    "Turing has built impressive AI screening technology, but their model prioritises volume over depth. Their vetting is largely automated, pricing is opaque, and matching can take weeks. OctogleHire's human-led 5-stage process is slower to vet but faster to match — because when every engineer in the network is genuinely verified, matching is just filtering, not screening.",
  rows: [
    {
      dimension: "Vetting Approach",
      competitor: "AI-first automated screening",
      competitorPass: false,
      octogle: "Human-led 5-stage process",
    },
    {
      dimension: "Acceptance Rate",
      competitor: "~3% (AI-filtered)",
      competitorPass: true,
      octogle: "1 in 25 (human-verified)",
    },
    {
      dimension: "Time to Hire",
      competitor: "1–4 weeks",
      competitorPass: false,
      octogle: "48 hours to first profiles",
    },
    {
      dimension: "Pricing",
      competitor: "Opaque — quote-based",
      competitorPass: false,
      octogle: "Transparent published rates",
    },
    {
      dimension: "Live Interviews",
      competitor: "Optional / AI-assessed",
      competitorPass: false,
      octogle: "Mandatory 90-min panel interview",
    },
    {
      dimension: "Background Checks",
      competitor: "Basic identity verification",
      competitorPass: false,
      octogle: "Full reference + employment verification",
    },
    {
      dimension: "Compliance",
      competitor: "Managed — US-focused",
      competitorPass: true,
      octogle: "Fully managed — 30+ countries",
    },
    {
      dimension: "Replacement",
      competitor: "2-week replacement",
      competitorPass: true,
      octogle: "14–30 day replacement guarantee",
    },
  ],
  reasons: [
    {
      stat: "90min",
      title: "Real Technical Interviews",
      description:
        "Every OctogleHire engineer has passed a live 90-minute technical interview with our engineering panel. System design, code review, communication — evaluated by humans, not algorithms.",
    },
    {
      stat: "3+",
      title: "Verified References",
      description:
        "We contact 3+ professional references for every engineer. Past managers confirm delivery track record, collaboration skills, and reliability.",
      statLabel: "references checked",
    },
    {
      stat: "$0",
      title: "Transparent, Published Pricing",
      description:
        "No quote requests, no sales calls to see rates. Our pricing is published and transparent — you know what you'll pay before the first conversation.",
    },
    {
      stat: "48h",
      title: "Faster Than AI Matching",
      description:
        "Turing's large pool means more filtering time. Our smaller, fully-verified network means every engineer is match-ready — 3–5 profiles in 48 hours.",
    },
    {
      stat: "30+",
      title: "True Global Compliance",
      description:
        "Contracts, payroll, and tax handled in 30+ countries. Turing's compliance infrastructure is primarily US and India-focused.",
    },
    {
      stat: "94%",
      title: "Retention Proves the Difference",
      description:
        "94% of placements extend beyond 6 months. Human vetting catches what AI misses — communication skills, cultural fit, and reliability.",
    },
  ],
  faqs: [
    {
      question: "What's wrong with AI-based vetting?",
      answer:
        "Nothing — we use automated assessments too. But AI alone can't evaluate communication clarity, collaboration style, or how an engineer handles ambiguity in real conversations. Our process combines automated coding assessments with live human interviews.",
    },
    {
      question: "Is Turing's talent pool larger than OctogleHire's?",
      answer:
        "Yes, significantly. Turing has 3M+ developers in their database. But size isn't quality — most are AI-screened, not human-verified. Our 1,000+ engineers have all passed live technical interviews and background checks.",
    },
    {
      question: "How does pricing compare?",
      answer:
        "Turing's pricing is quote-based and varies widely. OctogleHire publishes transparent rates — typically 40–60% below US/UK market rates with no placement fees or hidden markups.",
    },
    {
      question: "Can I try OctogleHire alongside Turing?",
      answer:
        "Yes. Many companies run both platforms in parallel to compare candidate quality and matching speed. We're confident the difference speaks for itself.",
    },
  ],
  otherComparisons: [
    { name: "Toptal", href: "/compare/toptal" },
    { name: "Upwork", href: "/compare/upwork" },
    { name: "Direct Hiring", href: "/compare/direct-hiring" },
  ],
};

export default function CompareTuringPage() {
  return (
    <>
      <Navbar />
      <main>
        <ComparePageLayout data={data} />
      </main>
      <Footer />
    </>
  );
}
