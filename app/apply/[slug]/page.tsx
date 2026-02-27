import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ApplyPageLayout } from "@/components/marketing/apply-page-layout";
import { absoluteUrl, SITE_NAME, buildJsonLd } from "@/lib/seo";
import { devFaqs } from "@/lib/data/apply-shared";
import {
  slugToTech,
  slugToRole,
  getAllTechSlugs,
  getAllRoleSlugs,
  getDevTechBenefits,
  getDevRoleBenefits,
  getRelatedTechnologies,
  getRelatedRoles,
  techToSlug,
  roleToSlug,
} from "@/lib/seo-data";

// ---------------------------------------------------------------------------
// Static params — generate all tech + role slugs
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  const techSlugs = getAllTechSlugs().map((slug) => ({ slug }));
  const roleSlugs = getAllRoleSlugs().map((slug) => ({ slug }));
  return [...techSlugs, ...roleSlugs];
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

interface PageProps {
  params: Promise<{ slug: string }>;
}

function resolveSlug(slug: string) {
  const tech = slugToTech(slug);
  if (tech) return { type: "tech" as const, name: tech };
  const role = slugToRole(slug);
  if (role) return { type: "role" as const, name: role };
  return null;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolved = resolveSlug(slug);
  if (!resolved) return {};

  if (resolved.type === "tech") {
    const tech = resolved.name;
    return {
      title: `Remote ${tech} Developer Jobs`,
      description: `Find remote ${tech} developer jobs through OctogleHire. Apply once, get matched with top companies, and earn above local market rates.`,
      keywords: [
        `remote ${tech} developer jobs`,
        `freelance ${tech} engineer`,
        `${tech} developer work`,
        `${tech} remote jobs`,
        `${tech} contractor jobs`,
      ],
      alternates: { canonical: absoluteUrl(`/apply/${slug}`) },
      openGraph: {
        type: "website",
        siteName: SITE_NAME,
        title: `Remote ${tech} Developer Jobs — ${SITE_NAME}`,
        description: `Apply once and get matched with top ${tech} roles at global companies.`,
        url: absoluteUrl(`/apply/${slug}`),
      },
    };
  }

  const role = resolved.name;
  return {
    title: `${role} — Remote & Freelance`,
    description: `Apply for remote ${role} positions on OctogleHire. One application, curated role matches, and above-market compensation.`,
    keywords: [
      `remote ${role} jobs`,
      `freelance ${role}`,
      `${role} remote work`,
      `${role} contract jobs`,
    ],
    alternates: { canonical: absoluteUrl(`/apply/${slug}`) },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: `${role} — Remote & Freelance — ${SITE_NAME}`,
      description: `Apply once and get matched with ${role} roles at vetted companies worldwide.`,
      url: absoluteUrl(`/apply/${slug}`),
    },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ApplySlugPage({ params }: PageProps) {
  const { slug } = await params;
  const resolved = resolveSlug(slug);
  if (!resolved) notFound();

  if (resolved.type === "tech") {
    return <TechPage tech={resolved.name} slug={slug} />;
  }

  return <RolePage role={resolved.name} slug={slug} />;
}

// ---------------------------------------------------------------------------
// Tech sub-page
// ---------------------------------------------------------------------------

function TechPage({ tech, slug }: { tech: string; slug: string }) {
  const benefits = getDevTechBenefits(tech);
  const related = getRelatedTechnologies(tech);

  const jsonLd = buildJsonLd({
    "@type": "WebPage",
    name: `Remote ${tech} Developer Jobs`,
    description: `Find remote ${tech} developer positions through OctogleHire's global talent platform.`,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    url: absoluteUrl(`/apply/${slug}`),
  });

  const faqJsonLd = buildJsonLd({
    "@type": "FAQPage",
    mainEntity: devFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  });

  const breadcrumbJsonLd = buildJsonLd({
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Apply", item: absoluteUrl("/apply") },
      { "@type": "ListItem", position: 3, name: `${tech} Developer Jobs`, item: absoluteUrl(`/apply/${slug}`) },
    ],
  });

  return (
    <>
      <ApplyPageLayout
        label={`${tech} Developer Jobs`}
        title={`Remote ${tech} Developer Jobs`}
        titleAccent={tech}
        description={`Join the top 3% of ${tech} engineers on OctogleHire. Get matched with 300+ vetted companies within 48 hours, earn 40–60% above local rates, and let us handle contracts and compliance across 150+ countries.`}
        benefits={benefits}
        techCrossLinks={related}
        hireSlug={slug}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd} />
      <script type="application/ld+json" dangerouslySetInnerHTML={faqJsonLd} />
      <script type="application/ld+json" dangerouslySetInnerHTML={breadcrumbJsonLd} />
    </>
  );
}

// ---------------------------------------------------------------------------
// Role sub-page
// ---------------------------------------------------------------------------

function RolePage({ role, slug }: { role: string; slug: string }) {
  const benefits = getDevRoleBenefits(role);
  const relatedRoles = getRelatedRoles(role);

  const jsonLd = buildJsonLd({
    "@type": "WebPage",
    name: `${role} — Remote & Freelance`,
    description: `Apply for remote ${role} positions through OctogleHire's global talent platform.`,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    url: absoluteUrl(`/apply/${slug}`),
  });

  const faqJsonLd = buildJsonLd({
    "@type": "FAQPage",
    mainEntity: devFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  });

  const breadcrumbJsonLd = buildJsonLd({
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Apply", item: absoluteUrl("/apply") },
      { "@type": "ListItem", position: 3, name: `${role} Jobs`, item: absoluteUrl(`/apply/${slug}`) },
    ],
  });

  return (
    <>
      <ApplyPageLayout
        label={`${role} Jobs`}
        title={`${role} — Remote & Freelance`}
        titleAccent={role}
        description={`Join the top 3% of ${role} professionals on OctogleHire. Get matched with 300+ vetted companies within 48 hours, earn 40–60% above local rates, and let us handle contracts and compliance.`}
        benefits={benefits}
        roleCrossLinks={relatedRoles}
        hireSlug={slug}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd} />
      <script type="application/ld+json" dangerouslySetInnerHTML={faqJsonLd} />
      <script type="application/ld+json" dangerouslySetInnerHTML={breadcrumbJsonLd} />
    </>
  );
}
