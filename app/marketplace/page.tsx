import type { Metadata } from "next";

import { Footer } from "@/components/marketing/footer";
import { Navbar } from "@/components/marketing/navbar";
import { DevelopersPage } from "@/app/developers/_components/developers-page";
import { absoluteUrl, SITE_NAME, buildJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Developer Marketplace",
  description:
    "Search and hire pre-vetted developers from 150+ countries. Filter by tech stack, skills, and experience to find your perfect engineering match.",
  keywords: [
    "hire remote developers",
    "vetted engineers",
    "developer marketplace",
    "remote software engineers",
    "hire freelance developers",
  ],
  alternates: { canonical: absoluteUrl("/marketplace") },
};

export default function MarketplaceRoute() {
  const jsonLd = buildJsonLd({
    "@type": "ItemList",
    name: "Developer Marketplace",
    description:
      "Browse and hire pre-vetted software developers from 150+ countries.",
    url: absoluteUrl("/marketplace"),
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Pre-vetted Software Developers",
        url: absoluteUrl("/marketplace"),
      },
    ],
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  });

  return (
    <div className="marketplace-route bg-gradient-to-b from-background via-background to-pulse/5">
      <Navbar />
      <DevelopersPage />
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd} />
    </div>
  );
}
