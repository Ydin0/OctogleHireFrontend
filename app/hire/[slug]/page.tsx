import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HirePageLayout } from "@/components/marketing/hire-page-layout";
import { absoluteUrl, SITE_NAME, buildJsonLd } from "@/lib/seo";
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

  return (
    <>
      <HirePageLayout
        label={`Hire ${tech} Developers`}
        title={`Hire Top ${tech} Developers`}
        titleAccent={tech}
        description={`Find pre-vetted, senior ${tech} engineers ready to join your team. OctogleHire connects you with elite ${tech} talent from 150+ countries — start in days, not months.`}
        benefits={benefits}
        techCrossLinks={related}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd} />
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
      description: `Our ${role} professionals come from 150+ countries and bring diverse perspectives and world-class skills to your team.`,
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

  return (
    <>
      <HirePageLayout
        label={`Hire a ${role}`}
        title={`Hire a ${role}`}
        titleAccent={role}
        description={`Looking for a top-tier ${role}? OctogleHire connects you with pre-vetted ${role} professionals from around the world. Start building your team today.`}
        benefits={benefits}
        roleCrossLinks={relatedRoles}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd} />
    </>
  );
}
