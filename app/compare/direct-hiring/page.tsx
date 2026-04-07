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
  title: "OctogleHire vs Direct Hiring — Comparison",
  description:
    "Compare OctogleHire with building an in-house recruiting pipeline. Skip 6–12 weeks of sourcing, screening, and negotiations — hire pre-vetted engineers in 48 hours.",
  alternates: { canonical: absoluteUrl("/compare/direct-hiring") },
  openGraph: {
    title: "OctogleHire vs Direct Hiring — Build Teams 10x Faster",
    description:
      "48 hours vs 6–12 weeks. No placement fees vs $20K–$40K per hire. See the full comparison.",
    url: absoluteUrl("/compare/direct-hiring"),
  },
};

const data: ComparePageData = {
  competitorName: "Direct Hiring",
  competitorTagline: "Traditional recruitment",
  heroTitle: (
    <>
      Months of recruiting.{" "}
      <span className="text-pulse">Or 48 hours.</span>
    </>
  ),
  heroDescription:
    "Direct hiring gives you full control — but it costs $20K–$40K per placement and takes 6–12 weeks. OctogleHire delivers the same quality engineers, pre-vetted, in days.",
  verdict:
    "Direct hiring makes sense when you're building a long-term core team in one location. But for scaling engineering capacity quickly, accessing global talent, or filling specialised roles, the traditional process is painfully slow and expensive. OctogleHire gives you agency-quality candidates at a fraction of the cost and timeline.",
  rows: [
    {
      dimension: "Time to Hire",
      competitor: "6–12 weeks average",
      competitorPass: false,
      octogle: "48 hours to first profiles",
    },
    {
      dimension: "Cost per Hire",
      competitor: "$20K–$40K (agency fees)",
      competitorPass: false,
      octogle: "No placement fees",
    },
    {
      dimension: "Screening Effort",
      competitor: "You source, screen, and interview",
      competitorPass: false,
      octogle: "Pre-vetted — 5-stage process done",
    },
    {
      dimension: "Talent Pool",
      competitor: "Limited to job board applicants",
      competitorPass: false,
      octogle: "1,000+ verified engineers, 30+ countries",
    },
    {
      dimension: "Global Compliance",
      competitor: "Complex — legal setup per country",
      competitorPass: false,
      octogle: "Fully managed — contracts, payroll, tax",
    },
    {
      dimension: "Risk",
      competitor: "Bad hire costs 3–6 months salary",
      competitorPass: false,
      octogle: "14–30 day replacement guarantee",
    },
    {
      dimension: "Flexibility",
      competitor: "Full-time only, notice periods",
      competitorPass: false,
      octogle: "Hourly, part-time, or full-time",
    },
    {
      dimension: "Ongoing Support",
      competitor: "Your HR team manages",
      competitorPass: false,
      octogle: "Dedicated account manager + performance tracking",
    },
  ],
  reasons: [
    {
      stat: "10x",
      title: "Faster Time to Productivity",
      description:
        "Skip the 6–12 week recruitment cycle. Our engineers are pre-vetted and match-ready. Post requirements today, review profiles tomorrow, start work this week.",
    },
    {
      stat: "$0",
      title: "No Placement Fees",
      description:
        "Traditional agencies charge $20K–$40K per hire. Recruiters take 15–25% of first-year salary. OctogleHire charges transparent hourly or monthly rates — no placement fees, ever.",
    },
    {
      stat: "30+",
      title: "Global Talent, Zero Setup",
      description:
        "Hiring internationally yourself means legal entities, local compliance, tax registration, and payroll systems in every country. We handle all of it across 30+ countries.",
    },
    {
      stat: "5",
      title: "Screening Already Done",
      description:
        "The average engineering hire requires 15+ hours of internal screening time. Our 5-stage vetting process replaces your entire technical interview pipeline.",
      statLabel: "vetting stages completed",
    },
    {
      stat: "14–30d",
      title: "Risk-Free Replacement",
      description:
        "A bad direct hire costs 3–6 months of salary plus lost productivity. Our replacement guarantee means if the fit isn't right, we replace the engineer at no cost.",
    },
    {
      stat: "94%",
      title: "Proven Retention",
      description:
        "94% of our placements extend beyond 6 months — comparable to full-time retention rates, without the overhead of traditional hiring.",
    },
  ],
  faqs: [
    {
      question: "Should I use OctogleHire instead of building an in-house team?",
      answer:
        "Not necessarily instead — alongside. Many companies use OctogleHire to scale quickly while building their core team through direct hiring. We're ideal for roles where speed matters, specialised skills are needed, or international hiring is required.",
    },
    {
      question: "Are these contractors or full-time employees?",
      answer:
        "Engineers on OctogleHire are engaged as contractors through our compliance infrastructure. We handle all contracts, payroll, and tax obligations. Many clients engage engineers full-time for 12+ months — functionally equivalent to an employee without the overhead.",
    },
    {
      question: "How does the cost compare to a full-time hire?",
      answer:
        "When you factor in recruitment costs ($20K–$40K), benefits (20–30% of salary), office costs, and the risk of a bad hire, OctogleHire is typically 40–60% less expensive than an equivalent US/UK full-time engineer. And there's no commitment beyond the work done.",
    },
    {
      question: "What about IP and confidentiality?",
      answer:
        "All engineers sign IP assignment and NDA agreements as part of their engagement. Work product belongs to you. We can customise agreements to match your legal requirements.",
    },
  ],
  otherComparisons: [
    { name: "Toptal", href: "/compare/toptal" },
    { name: "Upwork", href: "/compare/upwork" },
    { name: "Turing", href: "/compare/turing" },
  ],
};

export default function CompareDirectHiringPage() {
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
            path: "/compare/direct-hiring",
            name: "OctogleHire vs Direct Hiring — Comparison",
            description:
              "Compare OctogleHire with building an in-house recruiting pipeline. Skip 6-12 weeks of sourcing — hire pre-vetted engineers in 48 hours.",
          }),
          breadcrumbSchema("/compare/direct-hiring", [
            { name: "Home", url: SITE_URL },
            { name: "Compare", url: absoluteUrl("/compare") },
            { name: "vs Direct Hiring" },
          ]),
          {
            "@type": "FAQPage",
            "@id": `${SITE_URL}/compare/direct-hiring/#faq`,
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
