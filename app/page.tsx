import type { Metadata } from "next";

import { Navbar } from "@/components/marketing/navbar";
import { Hero } from "@/components/marketing/hero";
import { FeaturesShowcase } from "@/components/marketing/features-showcase";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { SavingsComparison } from "@/components/marketing/savings-comparison";
import { HiringCalculator } from "@/components/marketing/hiring-calculator";
import { DeveloperSpecializations } from "@/components/marketing/developer-specializations";
import { Benefits } from "@/components/marketing/benefits";
import { PlatformStats } from "@/components/marketing/platform-stats";
import { ComparisonTable } from "@/components/marketing/comparison-table";
import { Pricing } from "@/components/marketing/pricing";
import { Faq } from "@/components/marketing/faq";
import { Footer } from "@/components/marketing/footer";
import { SITE_URL, SITE_NAME, webPageSchema, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "OctogleHire — AI Native Engineers, 40–60% Lower Cost",
  description:
    "Every OctogleHire engineer is trained in modern AI workflows — Cursor, Claude Code, RAG, agentic development. Hire pre-vetted teams from 30+ countries in 48 hours at a fraction of local rates.",
  keywords: [
    "hire AI native developers",
    "AI-fluent engineers",
    "Cursor engineers",
    "Claude Code developers",
    "hire remote developers",
    "pre-vetted engineers",
    "global developer talent",
    "remote software engineers",
    "AI engineering team",
    "offshore development team",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "OctogleHire — AI Native Engineers, 40–60% Lower Cost",
    description:
      "Pre-vetted engineers trained in Cursor, Claude Code, RAG, and agentic workflows. Delivered from 30+ countries in 48 hours.",
    url: SITE_URL,
  },
};

export default function Home() {
  const homeSchema = [
    webPageSchema({
      path: "",
      name: `${SITE_NAME} — Hire Top Global Developer Talent`,
      description: "Connect with pre-vetted, world-class engineers from 30+ countries at up to 60% less than UK & US rates. Build your dream team in days, not months.",
    }),
    {
      "@type": "Service",
      "@id": `${SITE_URL}/#service-developer-matching`,
      name: "Pre-Vetted Developer Matching",
      description: "Receive 3-5 curated, vetted developer profiles within 48 hours. 1 in 25 acceptance rate from 25,000+ applicants.",
      provider: { "@id": `${SITE_URL}/#organization` },
      serviceType: "Developer Talent Marketplace",
      areaServed: "Worldwide",
    },
    {
      "@type": "Service",
      "@id": `${SITE_URL}/#service-eor`,
      name: "Employer of Record & Compliance",
      description: "Contracts, payroll, tax, and local employment law fully managed across 30+ countries. Single invoice billing.",
      provider: { "@id": `${SITE_URL}/#organization` },
      serviceType: "Employer of Record",
      areaServed: "Worldwide",
    },
    {
      "@type": "HowTo",
      "@id": `${SITE_URL}/#howto`,
      name: "Hire world-class engineers in three simple steps",
      inLanguage: "en",
      step: [
        { "@type": "HowToStep", position: 1, name: "Post a Role", text: "Jump on a quick call with our team to walk through your requirements — role, tech stack, timeline, and budget." },
        { "@type": "HowToStep", position: 2, name: "Get Matched", text: "Receive 3-5 curated, vetted profiles within 48 hours of your demo call." },
        { "@type": "HowToStep", position: 3, name: "Start Hiring", text: "Once you find the right fit, they join your team through OctogleHire — we handle contracts, payroll, and compliance." },
      ],
    },
    {
      "@type": "Product",
      "@id": `${SITE_URL}/#product-ondemand`,
      name: "OctogleHire On-Demand Plan",
      description: "Free to start. Post roles, receive candidates free. Monthly rate per developer on engagement.",
      brand: { "@id": `${SITE_URL}/#organization` },
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD", description: "Free to post and receive candidates. Monthly rate per developer begins on their start date. 14-day replacement guarantee.", availability: "https://schema.org/InStock", url: `${SITE_URL}/companies/signup` },
    },
    {
      "@type": "Product",
      "@id": `${SITE_URL}/#product-marketplace`,
      name: "OctogleHire Marketplace Plan",
      description: "Direct access to browse and engage from 1,000+ pre-vetted engineers with custom monthly rates and volume pricing.",
      brand: { "@id": `${SITE_URL}/#organization` },
      offers: { "@type": "Offer", priceCurrency: "USD", description: "Custom monthly rates. Volume pricing available. 30-day replacement guarantee.", availability: "https://schema.org/InStock", url: `${SITE_URL}/companies/signup` },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: [
        { "@type": "Question", name: "How quickly can I hire a developer?", acceptedAnswer: { "@type": "Answer", text: "You'll receive 3-5 vetted candidate profiles within 48 hours of your demo call. Most companies go from first intro to signed contract in under 5 business days." } },
        { "@type": "Question", name: "How are developers vetted?", acceptedAnswer: { "@type": "Answer", text: "Every developer passes a 5-stage process: application screening, stack-specific technical assessment, live system design interview, soft-skills evaluation, and reference checks. Only 1 in 25 applicants are accepted." } },
        { "@type": "Question", name: "What does \"AI native\" actually mean here?", acceptedAnswer: { "@type": "Answer", text: "Every engineer completes the Octogle AI Playbook — 40+ hours of hands-on training across six modules: Cursor & Claude Code, RAG & context engineering, agentic development, prompt-driven testing, model selection & cost control, and spec-first collaboration." } },
        { "@type": "Question", name: "Do your engineers just use AI, or do they understand it?", acceptedAnswer: { "@type": "Answer", text: "Both. Vetting covers system design, debugging, and production judgement. Engineers are explicitly trained on when to lean on AI, when to override it, and how to critically evaluate model output." } },
        { "@type": "Question", name: "What roles and tech stacks do you cover?", acceptedAnswer: { "@type": "Answer", text: "We cover the full spectrum: React, Node.js, Python, Go, Java, .NET, mobile, DevOps, cloud, AI/ML, data engineering, and more." } },
        { "@type": "Question", name: "How much does it cost?", acceptedAnswer: { "@type": "Answer", text: "OctogleHire developers typically cost 40-60% less than hiring locally in the US, UK, or Australia. No upfront fees — you only pay when you hire." } },
        { "@type": "Question", name: "What happens if a developer isn't the right fit?", acceptedAnswer: { "@type": "Answer", text: "Every placement includes a replacement guarantee — 14 days on On-Demand, 30 days on Marketplace. We handle the transition at no cost." } },
        { "@type": "Question", name: "Do you handle contracts and compliance?", acceptedAnswer: { "@type": "Answer", text: "Yes. We manage all contracts, IP agreements, payroll, and tax compliance end-to-end across 30+ countries. You receive a single invoice." } },
        { "@type": "Question", name: "Can I scale my team up or down?", acceptedAnswer: { "@type": "Answer", text: "Yes. Add developers within 48 hours or wind down engagements with no long-term lock-in or cancellation fees." } },
      ],
    },
  ];

  return (
    <>
      <Navbar />
      <Hero />
      <FeaturesShowcase />
      <HowItWorks />
      <SavingsComparison />
      <HiringCalculator />
      <DeveloperSpecializations />
      <Benefits />
      <PlatformStats />
      <ComparisonTable />
      <Pricing />
      <Faq />
      <Footer />

      <JsonLd data={homeSchema} />
    </>
  );
}
