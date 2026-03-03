import type { Metadata } from "next";

import { Navbar } from "@/components/marketing/navbar";
import { AgencyHero } from "@/components/marketing/agency-hero";
import { AgencyFeaturesShowcase } from "@/components/marketing/agency-features-showcase";
import { AgencyHowItWorks } from "@/components/marketing/agency-how-it-works";
import { AgencyEarnings } from "@/components/marketing/agency-earnings";
import { AgencyBenefits } from "@/components/marketing/agency-benefits";
import { AgencyStats } from "@/components/marketing/agency-stats";
import { AgencyPricing } from "@/components/marketing/agency-pricing";
import { AgencyFaq } from "@/components/marketing/agency-faq";
import { Footer } from "@/components/marketing/footer";
import { SITE_URL, SITE_NAME, buildJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "For Agencies — OctogleHire Recruitment Agency Marketplace",
  description:
    "Join the OctogleHire agency marketplace. Source candidates, earn commissions on every placement, and grow your recruitment agency with real-time tracking and branded referral links.",
  keywords: [
    "recruitment agency marketplace",
    "agency commission platform",
    "recruitment partner program",
    "candidate referral commissions",
    "recruitment agency registration",
    "agency recruitment platform",
    "earn commissions recruitment",
    "recruitment agency dashboard",
  ],
  alternates: {
    canonical: `${SITE_URL}/for-agencies`,
  },
  openGraph: {
    title: "For Agencies — OctogleHire Recruitment Agency Marketplace",
    description:
      "Source candidates, earn commissions on every placement, and grow your recruitment agency with OctogleHire.",
    url: `${SITE_URL}/for-agencies`,
  },
};

export default function ForAgencies() {
  const jsonLd = buildJsonLd({
    "@type": "WebPage",
    name: "For Agencies — OctogleHire",
    url: `${SITE_URL}/for-agencies`,
    description:
      "Join the OctogleHire agency marketplace. Source candidates, earn commissions, and grow your agency.",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  });

  return (
    <>
      <Navbar />
      <AgencyHero />
      <AgencyFeaturesShowcase />
      <AgencyHowItWorks />
      <AgencyEarnings />
      <AgencyBenefits />
      <AgencyStats />
      <AgencyPricing />
      <AgencyFaq />
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd}
      />
    </>
  );
}
