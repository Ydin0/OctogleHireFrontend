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
  title: "OctogleHire vs Toptal — Comparison",
  description:
    "Compare OctogleHire and Toptal side-by-side. Same quality vetting, faster matching (48h vs 1–3 weeks), and 40–60% lower rates with no placement fees.",
  alternates: { canonical: absoluteUrl("/compare/toptal") },
  openGraph: {
    title: "OctogleHire vs Toptal — Which Is Better for Hiring Engineers?",
    description:
      "Same quality, faster delivery, lower cost. See the full comparison.",
    url: absoluteUrl("/compare/toptal"),
  },
};

const data: ComparePageData = {
  competitorName: "Toptal",
  competitorTagline: "Elite freelance network",
  competitorLogo: "/competitor-logos/toptal.svg",
  heroTitle: (
    <>
      Same elite talent.{" "}
      <span className="text-pulse">Half the cost.</span>
    </>
  ),
  heroDescription:
    "Toptal pioneered vetted freelance talent. OctogleHire delivers the same quality with faster matching, transparent pricing, and no $500+ hourly rates.",
  verdict:
    "Toptal is a strong platform with rigorous vetting — we respect that. But their pricing puts them out of reach for most growing teams. OctogleHire matches the vetting quality at 40–60% lower rates, with 48-hour delivery instead of 1–3 weeks. If you've been priced out of Toptal, you don't have to compromise on quality.",
  rows: [
    {
      dimension: "Vetting",
      competitor: "Rigorous multi-stage screening",
      competitorPass: true,
      octogle: "5-stage vetting — 1 in 25 accepted",
    },
    {
      dimension: "Time to Hire",
      competitor: "1–3 weeks",
      competitorPass: false,
      octogle: "48 hours to first matched profiles",
    },
    {
      dimension: "Pricing",
      competitor: "$150–$250+/hr, opaque markups",
      competitorPass: false,
      octogle: "Transparent rates, 40–60% lower",
    },
    {
      dimension: "Placement Fee",
      competitor: "Included in markup",
      competitorPass: false,
      octogle: "No placement fees",
    },
    {
      dimension: "Compliance",
      competitor: "Managed — limited countries",
      competitorPass: true,
      octogle: "Fully managed — 30+ countries",
    },
    {
      dimension: "Replacement",
      competitor: "2-week trial period",
      competitorPass: true,
      octogle: "14–30 day replacement guarantee",
    },
    {
      dimension: "Support",
      competitor: "Account manager",
      competitorPass: true,
      octogle: "Dedicated account manager",
    },
    {
      dimension: "Minimum Commitment",
      competitor: "Part-time or full-time",
      competitorPass: true,
      octogle: "Flexible — hourly to full-time",
    },
  ],
  reasons: [
    {
      stat: "40–60%",
      title: "Lower Rates, Same Quality",
      description:
        "Our engineers pass the same calibre of vetting. The difference is our global talent pool and lean operating model — savings we pass directly to you.",
    },
    {
      stat: "48h",
      title: "Faster Matching",
      description:
        "Toptal's matching can take 1–3 weeks. Our pre-vetted network means we deliver 3–5 curated profiles within 48 hours of your brief.",
    },
    {
      stat: "$0",
      title: "No Hidden Fees",
      description:
        "No placement fees, no deposit, no minimum contract. Pay a transparent hourly or monthly rate — what you see is what you pay.",
    },
    {
      stat: "30+",
      title: "Broader Global Coverage",
      description:
        "We handle compliance, payroll, and contracts in 30+ countries. Toptal's coverage is more limited outside the US and Western Europe.",
    },
    {
      stat: "94%",
      title: "Retention That Proves Quality",
      description:
        "94% of our placements extend beyond 6 months. That's not just vetting — it's matching the right engineer to the right team.",
    },
    {
      stat: "1 in 25",
      title: "Equally Rigorous Vetting",
      description:
        "25,000+ applicants reviewed, 1,000 accepted. Technical assessments, live interviews, background checks — no shortcuts.",
    },
  ],
  faqs: [
    {
      question: "Is OctogleHire's vetting as rigorous as Toptal's?",
      answer:
        "Yes. Our 5-stage process includes application screening, stack-specific coding assessments, live technical interviews, and background checks. Only 1 in 25 applicants are accepted — comparable to Toptal's claimed 3% acceptance rate.",
    },
    {
      question: "Why is OctogleHire cheaper than Toptal?",
      answer:
        "We source from a broader global talent pool (30+ countries) and operate with a leaner model. Our engineers are equally skilled but based in regions with lower cost of living — savings we pass to you without cutting their pay.",
    },
    {
      question: "Can I switch from Toptal to OctogleHire mid-project?",
      answer:
        "Absolutely. We can match replacement engineers within 48 hours and handle the transition. Many clients run both platforms in parallel initially before switching fully.",
    },
    {
      question: "Do you offer the same trial period as Toptal?",
      answer:
        "We offer a 14-day replacement guarantee for on-demand hires and 30 days for marketplace placements. If the engineer isn't the right fit, we replace them at no cost.",
    },
  ],
  otherComparisons: [
    { name: "Upwork", href: "/compare/upwork" },
    { name: "Turing", href: "/compare/turing" },
    { name: "Direct Hiring", href: "/compare/direct-hiring" },
  ],
};

export default function CompareToptalPage() {
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
            path: "/compare/toptal",
            name: "OctogleHire vs Toptal — Comparison",
            description:
              "Compare OctogleHire and Toptal side-by-side. Same quality vetting, faster matching (48h vs 1-3 weeks), and 40-60% lower rates with no placement fees.",
          }),
          breadcrumbSchema("/compare/toptal", [
            { name: "Home", url: SITE_URL },
            { name: "Compare", url: absoluteUrl("/compare") },
            { name: "vs Toptal" },
          ]),
          {
            "@type": "FAQPage",
            "@id": `${SITE_URL}/compare/toptal/#faq`,
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
