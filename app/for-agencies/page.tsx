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
import { JsonLd } from "@/components/json-ld";
import {
  SITE_URL,
  absoluteUrl,
  webPageSchema,
  breadcrumbSchema,
} from "@/lib/seo";

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

      <JsonLd
        data={[
          webPageSchema({
            path: "/for-agencies",
            name: "For Agencies — OctogleHire Recruitment Agency Marketplace",
            description:
              "Join the OctogleHire agency marketplace. Source candidates, earn commissions on every placement, and grow your recruitment agency with real-time tracking and branded referral links.",
          }),
          breadcrumbSchema("/for-agencies", [
            { name: "Home", url: SITE_URL },
            { name: "For Agencies" },
          ]),
          {
            "@type": "Service",
            "@id": absoluteUrl("/for-agencies/#service"),
            name: "Recruitment Agency Marketplace",
            description:
              "Source candidates, earn commissions on every placement, and grow your recruitment agency with OctogleHire.",
            provider: { "@id": `${SITE_URL}/#organization` },
            serviceType: "Recruitment Agency Platform",
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Agency Plans",
              itemListElement: [
                {
                  "@type": "Offer",
                  name: "Free",
                  description:
                    "Register your agency for free. Earn 10% commission on every successful placement.",
                  price: "0",
                  priceCurrency: "USD",
                },
                {
                  "@type": "Offer",
                  name: "Enterprise",
                  description:
                    "Custom commission rates and priority support for high-volume agencies.",
                },
              ],
            },
          },
          {
            "@type": "HowTo",
            "@id": absoluteUrl("/for-agencies/#howto"),
            name: "How to Earn Commissions on OctogleHire",
            description:
              "Register your agency, source candidates, and earn commissions on every placement.",
            step: [
              {
                "@type": "HowToStep",
                position: 1,
                name: "Register",
                text: "Create your agency account and get your unique referral link in under 5 minutes.",
              },
              {
                "@type": "HowToStep",
                position: 2,
                name: "Source",
                text: "Share your referral link with candidates. They apply and are automatically attributed to your agency.",
              },
              {
                "@type": "HowToStep",
                position: 3,
                name: "Earn",
                text: "Earn 10% commission on every successful placement. Track earnings in real-time on your dashboard.",
              },
            ],
          },
          {
            "@type": "FAQPage",
            "@id": absoluteUrl("/for-agencies/#faq"),
            mainEntity: [
              {
                "@type": "Question",
                name: "How do I register my agency?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Click 'Register Your Agency' to create your organization account through Clerk. You'll provide basic agency details, agree to our terms, and receive your unique referral link — the whole process takes under 5 minutes.",
                },
              },
              {
                "@type": "Question",
                name: "What commission rate do agencies earn?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The base commission rate is 10% on every successful placement sourced through your referral link. Enterprise and volume agencies may qualify for custom rates — contact us for details.",
                },
              },
              {
                "@type": "Question",
                name: "How does candidate attribution work?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Every agency gets a unique referral URL (e.g. octoglehire.com/apply/a/your-agency). When candidates apply through your link, they're automatically and permanently attributed to your agency. No manual tracking or spreadsheets required.",
                },
              },
              {
                "@type": "Question",
                name: "When do I get paid?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Commissions are tracked in real-time on your dashboard. Payouts are processed monthly for all placements that have been confirmed and invoiced. You'll see pending and paid amounts clearly in your commission overview.",
                },
              },
              {
                "@type": "Question",
                name: "Can I invite my team?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Your agency organization supports multiple team members. Invite recruiters to your dashboard so they can submit candidates, track pipeline status, and view commission reports — all under your agency umbrella.",
                },
              },
              {
                "@type": "Question",
                name: "What types of roles are available?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "OctogleHire has 300+ active requirements across the full spectrum of software engineering: React, Python, Node.js, Go, Java, DevOps, cloud infrastructure, AI/ML, mobile, and more. New roles are added weekly.",
                },
              },
              {
                "@type": "Question",
                name: "Do I need to vet candidates myself?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "You can submit candidates at any stage. OctogleHire runs its own 5-stage vetting process (technical assessment, live interview, background check) on all candidates. Your role is sourcing — we handle the validation.",
                },
              },
              {
                "@type": "Question",
                name: "Is there a minimum number of submissions?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No. There are no minimums, no quotas, and no penalties. Submit one candidate or one hundred — you earn a commission on every successful placement regardless of volume.",
                },
              },
              {
                "@type": "Question",
                name: "How do I track my commissions?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Your agency dashboard includes a real-time commission tracker showing total earned, pending, and paid amounts. You can also see per-candidate status, placement history, and downloadable reports.",
                },
              },
              {
                "@type": "Question",
                name: "What countries do you operate in?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "OctogleHire operates in 30+ countries. You can source candidates from anywhere — OctogleHire handles all contracts, compliance, payroll, and local employment law on behalf of the hiring company.",
                },
              },
            ],
          },
        ]}
      />
    </>
  );
}
