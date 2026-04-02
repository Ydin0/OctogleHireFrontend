import type { Metadata } from "next";

import { absoluteUrl } from "@/lib/seo";
import { StartForm } from "./_components/start-form";

export const metadata: Metadata = {
  title: "Hire Pre-Vetted Engineers in 48 Hours — OctogleHire",
  description:
    "Tell us what you need and receive 3-5 curated, vetted developer profiles within 48 hours. No placement fees.",
  alternates: { canonical: absoluteUrl("/start") },
  openGraph: {
    title: "Hire Pre-Vetted Engineers in 48 Hours",
    description:
      "Tell us what you need and receive 3-5 curated, vetted developer profiles within 48 hours.",
    url: absoluteUrl("/start"),
  },
};

export default function StartPage() {
  return <StartForm />;
}
