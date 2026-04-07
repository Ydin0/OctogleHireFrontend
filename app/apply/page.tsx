import type { Metadata } from "next";

import { ApplyForm } from "./_components/apply-form";
import { absoluteUrl, SITE_URL, webPageSchema, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Apply as a Professional",
  description:
    "Join our network of pre-vetted professionals. Apply to OctogleHire and get matched with top companies worldwide.",
  keywords: [
    "apply as professional",
    "remote developer jobs",
    "remote design jobs",
    "remote marketing jobs",
    "remote HR jobs",
    "freelance application",
    "join talent network",
  ],
  alternates: { canonical: absoluteUrl("/apply") },
};

export default function ApplyPage() {
  return (
    <>
      <ApplyForm />
      <JsonLd
        data={[
          webPageSchema({
            path: "/apply",
            name: "Apply as a Professional — OctogleHire",
            description:
              "Join our network of pre-vetted professionals. Apply to OctogleHire and get matched with top companies worldwide.",
          }),
          breadcrumbSchema("/apply", [
            { name: "Home", url: SITE_URL },
            { name: "Apply" },
          ]),
          {
            "@type": "HowTo",
            "@id": `${SITE_URL}/apply/#howto`,
            name: "How to Join OctogleHire as a Professional",
            description:
              "Apply to OctogleHire, get reviewed by our vetting team, and get matched with top companies worldwide.",
            step: [
              {
                "@type": "HowToStep",
                position: 1,
                name: "Apply",
                text: "Submit your application with your professional details, skills, and experience.",
              },
              {
                "@type": "HowToStep",
                position: 2,
                name: "Get Reviewed",
                text: "Our team reviews your application through our rigorous 5-stage vetting process.",
              },
              {
                "@type": "HowToStep",
                position: 3,
                name: "Get Matched",
                text: "Once approved, you are matched with top companies based on skill fit, timezone, and availability.",
              },
            ],
          },
        ]}
      />
    </>
  );
}
