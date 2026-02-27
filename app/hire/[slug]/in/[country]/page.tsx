import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HirePageLayout } from "@/components/marketing/hire-page-layout";
import { absoluteUrl, SITE_NAME, buildJsonLd } from "@/lib/seo";
import {
  slugToTech,
  slugToCountry,
  getAllTechCountryCombinations,
  techToSlug,
  countryToSlug,
} from "@/lib/seo-data";

// ---------------------------------------------------------------------------
// Static params (top 20 tech × 34 countries)
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return getAllTechCountryCombinations().map((c) => ({
    slug: c.tech,
    country: c.country,
  }));
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

interface PageProps {
  params: Promise<{ slug: string; country: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug: techSlug, country: countrySlug } = await params;
  const tech = slugToTech(techSlug);
  const country = slugToCountry(countrySlug);
  if (!tech || !country) return {};

  return {
    title: `Hire ${tech} Developers in ${country}`,
    description: `Hire pre-vetted ${tech} developers in ${country}. Access elite remote ${tech} engineers based in ${country} through OctogleHire — start in days, save up to 60%.`,
    keywords: [
      `hire ${tech} developers in ${country}`,
      `${tech} engineer ${country}`,
      `remote ${tech} developer ${country}`,
    ],
    alternates: {
      canonical: absoluteUrl(`/hire/${techSlug}/in/${countrySlug}`),
    },
    openGraph: {
      title: `Hire ${tech} Developers in ${country} — ${SITE_NAME}`,
      description: `Pre-vetted ${tech} engineers in ${country}, ready in days.`,
      url: absoluteUrl(`/hire/${techSlug}/in/${countrySlug}`),
    },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function TechCountryPage({ params }: PageProps) {
  const { slug: techSlug, country: countrySlug } = await params;
  const tech = slugToTech(techSlug);
  const country = slugToCountry(countrySlug);
  if (!tech || !country) notFound();

  const benefits = [
    {
      title: `${tech} Expertise in ${country}`,
      description: `${country} has a strong community of ${tech} developers. OctogleHire sources the top talent and puts them through rigorous vetting.`,
    },
    {
      title: "Cost-Effective Hiring",
      description: `Access world-class ${tech} engineers in ${country} at competitive rates — up to 60% less than hiring locally in the US or Europe.`,
    },
    {
      title: "Start in Days",
      description: `Skip months of recruiting. Our pre-vetted ${tech} developers in ${country} are ready to integrate with your team immediately.`,
    },
    {
      title: "Risk-Free Trial",
      description: `Every engagement starts with a trial period. If the ${tech} developer isn't the right fit, you pay nothing.`,
    },
  ];

  const jsonLd = buildJsonLd({
    "@type": "Service",
    name: `Hire ${tech} Developers in ${country}`,
    description: `Access pre-vetted ${tech} engineers in ${country} through OctogleHire.`,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    areaServed: {
      "@type": "Country",
      name: country,
    },
    url: absoluteUrl(`/hire/${techSlug}/in/${countrySlug}`),
  });

  return (
    <>
      <HirePageLayout
        label={`${tech} in ${country}`}
        title={`Hire ${tech} Developers in ${country}`}
        titleAccent={tech}
        description={`OctogleHire connects you with top-3%, pre-vetted ${tech} engineers in ${country}. Receive 3–5 matched profiles within 48 hours at 40–60% below market rates — compliance fully managed.`}
        benefits={benefits}
        crossLinks={[
          {
            label: `All ${tech} Developers`,
            href: `/hire/${techToSlug(tech)}`,
          },
          {
            label: `All Developers in ${country}`,
            href: `/hire/developers-in/${countryToSlug(country)}`,
          },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd} />
    </>
  );
}
