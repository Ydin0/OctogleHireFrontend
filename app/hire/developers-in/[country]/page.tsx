import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HirePageLayout } from "@/components/marketing/hire-page-layout";
import { absoluteUrl, SITE_NAME, buildJsonLd } from "@/lib/seo";
import {
  slugToCountry,
  getAllCountrySlugs,
  getCountryBenefits,
  countryToSlug,
  techToSlug,
  TOP_TECHNOLOGIES,
  REGIONAL_COUNTRIES,
} from "@/lib/seo-data";

// ---------------------------------------------------------------------------
// Static params
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return getAllCountrySlugs().map((country) => ({ country }));
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

interface PageProps {
  params: Promise<{ country: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { country: countrySlug } = await params;
  const country = slugToCountry(countrySlug);
  if (!country) return {};

  return {
    title: `Hire Top Developers in ${country}`,
    description: `Hire pre-vetted software developers in ${country} through OctogleHire. Access elite remote engineers, start in days, and save up to 60% on hiring costs.`,
    keywords: [
      `hire developers in ${country}`,
      `remote engineers ${country}`,
      `${country} software developers`,
      `offshore developers ${country}`,
    ],
    alternates: {
      canonical: absoluteUrl(`/hire/developers-in/${countrySlug}`),
    },
    openGraph: {
      title: `Hire Top Developers in ${country} — ${SITE_NAME}`,
      description: `Access pre-vetted engineers in ${country} ready to join your team.`,
      url: absoluteUrl(`/hire/developers-in/${countrySlug}`),
    },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function CountryHirePage({ params }: PageProps) {
  const { country: countrySlug } = await params;
  const country = slugToCountry(countrySlug);
  if (!country) notFound();

  const benefits = getCountryBenefits(country);

  const topTechLinks = TOP_TECHNOLOGIES.slice(0, 8).map((tech) => ({
    label: `Hire ${tech} Developers in ${country}`,
    href: `/hire/${techToSlug(tech)}/in/${countrySlug}`,
  }));

  const otherCountries = REGIONAL_COUNTRIES.filter(
    (c) => c.name !== country,
  )
    .slice(0, 6)
    .map((c) => c.name);

  const jsonLd = buildJsonLd({
    "@type": "Service",
    name: `Hire Developers in ${country}`,
    description: `Access pre-vetted software engineers in ${country} through OctogleHire.`,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    areaServed: {
      "@type": "Country",
      name: country,
    },
    url: absoluteUrl(`/hire/developers-in/${countrySlug}`),
  });

  return (
    <>
      <HirePageLayout
        label={`Developers in ${country}`}
        title={`Hire Top Developers in ${country}`}
        titleAccent={country}
        description={`Access a curated pool of pre-vetted software engineers based in ${country}. OctogleHire handles vetting, matching, and onboarding so you can build your team in days.`}
        benefits={benefits}
        crossLinks={topTechLinks}
        countryCrossLinks={otherCountries}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd} />
    </>
  );
}
