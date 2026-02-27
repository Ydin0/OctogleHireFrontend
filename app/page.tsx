import type { Metadata } from "next";

import { Navbar } from "@/components/marketing/navbar";
import { Hero } from "@/components/marketing/hero";
import { FeaturesShowcase } from "@/components/marketing/features-showcase";
import { DeveloperProfiles } from "@/components/marketing/developer-profiles";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { HiringCalculator } from "@/components/marketing/hiring-calculator";
import { DeveloperSpecializations } from "@/components/marketing/developer-specializations";
import { Benefits } from "@/components/marketing/benefits";
import { ComparisonTable } from "@/components/marketing/comparison-table";
import { Testimonials } from "@/components/marketing/testimonials";
import { Pricing } from "@/components/marketing/pricing";
import { Faq } from "@/components/marketing/faq";
import { Footer } from "@/components/marketing/footer";
import { SITE_URL, SITE_NAME, buildJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "OctogleHire — Hire Top Global Developer Talent",
  description:
    "Connect with pre-vetted, world-class engineers from 150+ countries. Build your dream team in days, not months with OctogleHire.",
  keywords: [
    "hire developers",
    "hire remote developers",
    "pre-vetted engineers",
    "global developer talent",
    "remote software engineers",
    "hire Indian developers",
    "offshore development team",
  ],
  alternates: {
    canonical: SITE_URL,
  },
};

export default function Home() {
  const organizationJsonLd = buildJsonLd({
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/Octogle Darkmode.svg`,
    description:
      "The global talent platform for pre-vetted developers. Build world-class engineering teams in days, not months.",
    sameAs: [
      "https://twitter.com/octoglehire",
      "https://linkedin.com/company/octoglehire",
    ],
  });

  const websiteJsonLd = buildJsonLd({
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/marketplace?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  });

  return (
    <>
      <Navbar />
      <Hero />
      <FeaturesShowcase />
      <DeveloperProfiles />
      <HowItWorks />
      <HiringCalculator />
      <DeveloperSpecializations />
      <Benefits />
      <ComparisonTable />
      <Testimonials />
      <Pricing />
      <Faq />
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={organizationJsonLd}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={websiteJsonLd}
      />
    </>
  );
}
