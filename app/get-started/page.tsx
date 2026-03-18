import type { Metadata } from "next";

import { absoluteUrl } from "@/lib/seo";
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
  return <GetStartedContent />;
}
