import type { Metadata } from "next";

import { JsonLd } from "@/components/json-ld";
import { absoluteUrl, SITE_URL, webPageSchema, breadcrumbSchema } from "@/lib/seo";
import { GetStartedContent } from "./_components/content";

export const metadata: Metadata = {
  title: "Hire Pre-Vetted Engineers in 48 Hours — OctogleHire",
  description:
    "Receive 3–5 curated developer profiles within 48 hours. No placement fees. Compliance handled across 30+ countries. 40–60% lower than US/UK rates.",
  alternates: { canonical: absoluteUrl("/get-started") },
  openGraph: {
    title: "Pre-Vetted Engineers, Deployed in Days, at 40–60% Lower Cost",
    description:
      "Receive 3–5 curated developer profiles within 48 hours. No placement fees. Compliance handled.",
    url: absoluteUrl("/get-started"),
  },
};

export default function GetStartedPage() {
  return (
    <>
      <GetStartedContent />
      <JsonLd
        data={[
          webPageSchema({
            path: "/get-started",
            name: "Hire Pre-Vetted Engineers in 48 Hours — OctogleHire",
            description:
              "Receive 3–5 curated developer profiles within 48 hours. No placement fees. Compliance handled across 30+ countries. 40–60% lower than US/UK rates.",
          }),
          breadcrumbSchema("/get-started", [
            { name: "Home", url: SITE_URL },
            { name: "Get Started" },
          ]),
          {
            "@type": "HowTo",
            "@id": absoluteUrl("/get-started/#howto"),
            name: "How to Hire Pre-Vetted Engineers with OctogleHire",
            description:
              "Three simple steps to build your engineering team with OctogleHire.",
            step: [
              {
                "@type": "HowToStep",
                position: 1,
                name: "Tell Us What You Need",
                text: "Share your requirements — tech stack, seniority, timezone, and budget. We'll match you with the right engineers.",
              },
              {
                "@type": "HowToStep",
                position: 2,
                name: "Review Your Shortlist",
                text: "Receive 3–5 curated, pre-vetted developer profiles within 48 hours. Review CVs, watch video intros, and schedule interviews.",
              },
              {
                "@type": "HowToStep",
                position: 3,
                name: "Onboard & Start Building",
                text: "Choose your engineer and start building. We handle contracts, compliance, and payroll across 30+ countries.",
              },
            ],
          },
        ]}
      />
    </>
  );
}
