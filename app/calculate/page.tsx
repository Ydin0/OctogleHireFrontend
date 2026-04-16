import type { Metadata } from "next";

import { absoluteUrl, SITE_NAME, webPageSchema, breadcrumbSchema, SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { CalculatorFlow } from "./_components/calculator-flow";

export const metadata: Metadata = {
  title: "How much could you save? — Developer Hiring Calculator | OctogleHire",
  description:
    "Calculate exactly how much you could save by hiring pre-vetted developers through OctogleHire vs. local rates. Get your personalised savings estimate in 60 seconds.",
  alternates: { canonical: absoluteUrl("/calculate") },
  openGraph: {
    title: "How much could you save on developer hiring?",
    description:
      "Calculate your personalised savings estimate in 60 seconds. Pre-vetted engineers at 40-60% lower than US/UK rates.",
    url: absoluteUrl("/calculate"),
  },
};

export default function CalculatePage() {
  const schema = [
    webPageSchema({
      path: "/calculate",
      name: `Developer Hiring Cost Calculator — ${SITE_NAME}`,
      description:
        "Find out how much you could save by hiring pre-vetted developers through OctogleHire.",
    }),
    breadcrumbSchema("/calculate", [
      { name: "Home", url: SITE_URL },
      { name: "Savings Calculator" },
    ]),
  ];

  return (
    <>
      <CalculatorFlow />
      <JsonLd data={schema} />
    </>
  );
}
