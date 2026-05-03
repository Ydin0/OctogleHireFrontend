import type { Metadata } from "next";

import { ApplySalesForm } from "./_components/apply-sales-form";
import {
  absoluteUrl,
  SITE_URL,
  webPageSchema,
  breadcrumbSchema,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Apply as a Sales Rep",
  description:
    "Apply once and get matched to quota-bearing AE, SDR, and CSM roles at vetted B2B SaaS, FinTech, and enterprise software companies.",
  keywords: [
    "sales rep jobs",
    "remote sales jobs",
    "AE jobs",
    "SDR jobs",
    "BDR jobs",
    "Account Manager jobs",
    "CSM jobs",
    "B2B sales jobs",
  ],
  alternates: { canonical: absoluteUrl("/apply/sales") },
};

export default function ApplySalesPage() {
  return (
    <>
      <ApplySalesForm />
      <JsonLd
        data={[
          webPageSchema({
            path: "/apply/sales",
            name: "Apply as a Sales Rep — OctogleHire",
            description:
              "Apply once and get matched to quota-bearing sales roles at vetted B2B SaaS and enterprise companies.",
          }),
          breadcrumbSchema("/apply/sales", [
            { name: "Home", url: SITE_URL },
            { name: "Apply", url: absoluteUrl("/apply") },
            { name: "Sales" },
          ]),
        ]}
      />
    </>
  );
}
