import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HirePageLayout } from "@/components/marketing/hire-page-layout";
import { absoluteUrl, SITE_NAME, buildJsonLd } from "@/lib/seo";
import { hireFaqs } from "@/lib/data/hire-faqs";
import {
  slugToTech,
  slugToRole,
  getAllTechSlugs,
  getAllRoleSlugs,
  getTechBenefits,
  getRelatedTechnologies,
  getRelatedRoles,
  techToSlug,
  roleToSlug,
} from "@/lib/seo-data";

// FAQ data — shared across hire pages
const HIRE_FAQS = hireFaqs;

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
      title: `Hire Top ${tech} Developers`,
      description: `Hire pre-vetted ${tech} developers from OctogleHire. Access elite remote ${tech} engineers, start in days, and save up to 60% on hiring costs.`,
      keywords: [
        `hire ${tech} developers`,
        `remote ${tech} engineers`,
        `${tech} developer for hire`,
        `${tech} freelancer`,
        `${tech} contractor`,
      ],
      alternates: { canonical: absoluteUrl(`/hire/${slug}`) },
      openGraph: {
        type: "website",
        siteName: SITE_NAME,
        title: `Hire Top ${tech} Developers — ${SITE_NAME}`,
        description: `Access pre-vetted ${tech} engineers ready to join your team in days.`,
        url: absoluteUrl(`/hire/${slug}`),
      },
    };
  }

  const role = resolved.name;
  return {
    title: `Hire a ${role}`,
    description: `Hire a pre-vetted ${role} from OctogleHire. Find elite remote talent, start in days, and save up to 60% on hiring costs.`,
    keywords: [
      `hire ${role}`,
      `remote ${role}`,
      `${role} for hire`,
      `freelance ${role}`,
    ],
    alternates: { canonical: absoluteUrl(`/hire/${slug}`) },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: `Hire a ${role} — ${SITE_NAME}`,
      description: `Access pre-vetted ${role} professionals ready to join your team in days.`,
      url: absoluteUrl(`/hire/${slug}`),
    },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function HireSlugPage({ params }: PageProps) {
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
  const benefits = getTechBenefits(tech);
  const related = getRelatedTechnologies(tech);

  const jsonLd = buildJsonLd({
    "@type": "Service",
    name: `Hire ${tech} Developers`,
    description: `Access pre-vetted ${tech} engineers through OctogleHire's global talent platform.`,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    url: absoluteUrl(`/hire/${slug}`),
  });

  const faqJsonLd = buildJsonLd({
    "@type": "FAQPage",
    mainEntity: HIRE_FAQS.map((faq) => ({
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
      { "@type": "ListItem", position: 2, name: `Hire ${tech} Developers`, item: absoluteUrl(`/hire/${slug}`) },
    ],
  });

  return (
    <>
      <HirePageLayout
        label={`Hire ${tech} Developers`}
        title={`Hire Top ${tech} Developers`}
        titleAccent={tech}
        description={`OctogleHire connects you with rigorously vetted ${tech} engineers from 30+ countries. Receive 3–5 matched profiles within 48 hours at 40–60% below market rates — no recruitment fees.`}
        benefits={benefits}
        techCrossLinks={related}
        applySlug={slug}
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
  const benefits = [
    {
      title: "Rigorous Vetting",
      description: `Every ${role} on OctogleHire passes multi-stage technical and communication assessments before joining our talent pool.`,
    },
    {
      title: "Fast Matching",
      description: `Get matched with a qualified ${role} in days. No lengthy recruitment cycles or agency fees.`,
    },
    {
      title: "Global Talent, Local Quality",
      description: `Our ${role} professionals come from 30+ countries and bring diverse perspectives and world-class skills to your team.`,
    },
    {
      title: "Risk-Free Engagement",
      description: `Start with a trial period. If the ${role} isn't the right fit, you pay nothing.`,
    },
  ];

  const relatedRoles = getRelatedRoles(role);

  const jsonLd = buildJsonLd({
    "@type": "Service",
    name: `Hire a ${role}`,
    description: `Access pre-vetted ${role} professionals through OctogleHire's global talent platform.`,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    url: absoluteUrl(`/hire/${slug}`),
  });

  const faqJsonLd = buildJsonLd({
    "@type": "FAQPage",
    mainEntity: HIRE_FAQS.map((faq) => ({
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
      { "@type": "ListItem", position: 2, name: `Hire a ${role}`, item: absoluteUrl(`/hire/${slug}`) },
    ],
  });

  return (
    <>
      <HirePageLayout
        label={`Hire a ${role}`}
        title={`Hire a ${role}`}
        titleAccent={role}
        description={`OctogleHire connects you with rigorously vetted ${role} professionals from 30+ countries. Receive 3–5 matched profiles within 48 hours at 40–60% below market rates — no recruitment fees.`}
        benefits={benefits}
        roleCrossLinks={relatedRoles}
        applySlug={slug}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd} />
      <script type="application/ld+json" dangerouslySetInnerHTML={faqJsonLd} />
      <script type="application/ld+json" dangerouslySetInnerHTML={breadcrumbJsonLd} />
    </>
  );
}
