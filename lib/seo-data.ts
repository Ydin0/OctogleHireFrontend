import { MARKETPLACE_TECH_STACK_OPTIONS } from "@/lib/data/developers";
import { PROFESSIONAL_TITLE_OPTIONS } from "@/lib/data/professional-titles";

// ---------------------------------------------------------------------------
// Slug helpers
// ---------------------------------------------------------------------------

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\+/g, "-plus")
    .replace(/#/g, "-sharp")
    .replace(/\./g, "")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function techToSlug(tech: string) {
  const base = slugify(tech);
  return base.endsWith("-developers") ? base : `${base}-developers`;
}

export function slugToTech(slug: string): string | null {
  const match = TECH_SLUG_MAP.get(slug);
  return match ?? null;
}

export function roleToSlug(role: string) {
  return slugify(role);
}

export function slugToRole(slug: string): string | null {
  const match = ROLE_SLUG_MAP.get(slug);
  return match ?? null;
}

export function countryToSlug(country: string) {
  return slugify(country);
}

export function slugToCountry(slug: string): string | null {
  const match = COUNTRY_SLUG_MAP.get(slug);
  return match ?? null;
}

// ---------------------------------------------------------------------------
// Country data (from REGIONAL_HUBS keys → country names)
// ---------------------------------------------------------------------------

export const REGIONAL_COUNTRIES: { isoCode: string; name: string }[] = [
  { isoCode: "IN", name: "India" },
  { isoCode: "GB", name: "United Kingdom" },
  { isoCode: "ZA", name: "South Africa" },
  { isoCode: "EG", name: "Egypt" },
  { isoCode: "NG", name: "Nigeria" },
  { isoCode: "KE", name: "Kenya" },
  { isoCode: "PK", name: "Pakistan" },
  { isoCode: "BD", name: "Bangladesh" },
  { isoCode: "ID", name: "Indonesia" },
  { isoCode: "PH", name: "Philippines" },
  { isoCode: "VN", name: "Vietnam" },
  { isoCode: "BR", name: "Brazil" },
  { isoCode: "MX", name: "Mexico" },
  { isoCode: "AR", name: "Argentina" },
  { isoCode: "CO", name: "Colombia" },
  { isoCode: "TR", name: "Turkey" },
  { isoCode: "UA", name: "Ukraine" },
  { isoCode: "PL", name: "Poland" },
  { isoCode: "RO", name: "Romania" },
  { isoCode: "DE", name: "Germany" },
  { isoCode: "FR", name: "France" },
  { isoCode: "ES", name: "Spain" },
  { isoCode: "IT", name: "Italy" },
  { isoCode: "NL", name: "Netherlands" },
  { isoCode: "PT", name: "Portugal" },
  { isoCode: "AE", name: "United Arab Emirates" },
  { isoCode: "SA", name: "Saudi Arabia" },
  { isoCode: "MA", name: "Morocco" },
  { isoCode: "GH", name: "Ghana" },
  { isoCode: "ET", name: "Ethiopia" },
  { isoCode: "TZ", name: "Tanzania" },
  { isoCode: "UG", name: "Uganda" },
  { isoCode: "US", name: "United States" },
  { isoCode: "CA", name: "Canada" },
];

// ---------------------------------------------------------------------------
// Top 20 technologies (for combined tech × country pages)
// ---------------------------------------------------------------------------

export const TOP_TECHNOLOGIES = [
  "React",
  "Python",
  "Node.js",
  "TypeScript",
  "Java",
  "Go",
  "Next.js",
  "Angular",
  "Vue.js",
  "Ruby on Rails",
  "Django",
  "AWS",
  "Docker",
  "Kubernetes",
  "PostgreSQL",
  "React Native",
  "Flutter",
  "Swift",
  "Kotlin",
  "Rust",
] as const;

// ---------------------------------------------------------------------------
// Precomputed slug maps
// ---------------------------------------------------------------------------

const TECH_SLUG_MAP = new Map(
  MARKETPLACE_TECH_STACK_OPTIONS.map((t) => [techToSlug(t), t] as const),
);

const ROLE_SLUG_MAP = new Map(
  PROFESSIONAL_TITLE_OPTIONS.map((r) => [roleToSlug(r), r] as const),
);

const COUNTRY_SLUG_MAP = new Map(
  REGIONAL_COUNTRIES.map((c) => [countryToSlug(c.name), c.name] as const),
);

// ---------------------------------------------------------------------------
// All slugs (for generateStaticParams)
// ---------------------------------------------------------------------------

export function getAllTechSlugs() {
  return MARKETPLACE_TECH_STACK_OPTIONS.map((t) => techToSlug(t));
}

export function getAllRoleSlugs() {
  return PROFESSIONAL_TITLE_OPTIONS.map((r) => roleToSlug(r));
}

export function getAllCountrySlugs() {
  return REGIONAL_COUNTRIES.map((c) => countryToSlug(c.name));
}

export function getAllTechCountryCombinations() {
  const combos: { tech: string; country: string }[] = [];
  for (const tech of TOP_TECHNOLOGIES) {
    for (const country of REGIONAL_COUNTRIES) {
      combos.push({
        tech: techToSlug(tech),
        country: countryToSlug(country.name),
      });
    }
  }
  return combos;
}

// ---------------------------------------------------------------------------
// Content helpers
// ---------------------------------------------------------------------------

export function getTechBenefits(tech: string) {
  return [
    {
      title: "Pre-Vetted Expertise",
      description: `Every ${tech} developer on OctogleHire passes a rigorous vetting process covering technical skills, communication, and problem-solving ability.`,
    },
    {
      title: "Start in Days, Not Months",
      description: `Skip the lengthy recruitment cycle. Our ${tech} engineers are ready to integrate with your team and start delivering within days.`,
    },
    {
      title: "Up to 60% Cost Savings",
      description: `Access world-class ${tech} talent at a fraction of the cost of local hires, without compromising on quality or experience.`,
    },
    {
      title: "Risk-Free Trial Period",
      description: `Every ${tech} engagement starts with a trial period. If you're not completely satisfied, you pay nothing.`,
    },
  ];
}

export function getCountryBenefits(country: string) {
  return [
    {
      title: `Strong ${country} Talent Pool`,
      description: `${country} has a rapidly growing pool of skilled software engineers with strong technical foundations and global work experience.`,
    },
    {
      title: "Timezone-Friendly Collaboration",
      description: `Work with developers in ${country} who offer overlapping hours with your team, enabling real-time communication and faster iteration cycles.`,
    },
    {
      title: "Cost-Effective Engineering",
      description: `Hiring developers from ${country} through OctogleHire lets you access elite talent at competitive rates — up to 60% less than local equivalents.`,
    },
    {
      title: "Vetted for Quality",
      description: `All ${country}-based developers on OctogleHire pass our multi-stage vetting process covering coding, system design, and communication.`,
    },
  ];
}

export function getDevTechBenefits(tech: string) {
  return [
    {
      title: "Work on Real Products",
      description: `Join teams shipping production ${tech} applications to real users — not outsourced maintenance work.`,
    },
    {
      title: "Above-Market Compensation",
      description: `${tech} developers on OctogleHire earn 40–60% above typical local market rates, with full rate transparency before any interview.`,
    },
    {
      title: "Apply Once, Get Matched",
      description: `Submit your ${tech} profile once and receive curated role matches from vetted companies — no repetitive applications.`,
    },
    {
      title: "Zero Admin Overhead",
      description: `Contracts, invoicing, payroll, and compliance for your ${tech} engagements are fully managed by OctogleHire.`,
    },
  ];
}

export function getDevRoleBenefits(role: string) {
  return [
    {
      title: "Roles That Match Your Skills",
      description: `Get matched to ${role} positions that fit your experience level, preferred stack, and working style.`,
    },
    {
      title: "Transparent Rates",
      description: `Every ${role} opportunity on OctogleHire includes full rate disclosure before you commit to any interview.`,
    },
    {
      title: "Global Companies, Remote-First",
      description: `Work as a ${role} for companies in the US, UK, EU, and Australia — fully remote, no relocation required.`,
    },
    {
      title: "Contracts & Compliance Handled",
      description: `OctogleHire manages all contracts, payroll, and compliance for your ${role} engagements end-to-end.`,
    },
  ];
}

export function getRelatedTechnologies(currentTech: string) {
  const techCategories: Record<string, string[]> = {
    frontend: ["React", "Vue.js", "Angular", "Next.js", "Svelte", "TypeScript"],
    backend: ["Node.js", "Python", "Go", "Java", "Ruby on Rails", "Django", "Spring Boot"],
    mobile: ["React Native", "Flutter", "Swift", "Kotlin"],
    devops: ["AWS", "Docker", "Kubernetes", "Terraform", "Google Cloud", "Azure"],
    database: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "DynamoDB"],
    ai: ["Python", "TensorFlow", "PyTorch", "scikit-learn"],
  };

  for (const [, techs] of Object.entries(techCategories)) {
    if (techs.includes(currentTech)) {
      return techs.filter((t) => t !== currentTech).slice(0, 5);
    }
  }

  return ["React", "Python", "Node.js", "TypeScript", "AWS"]
    .filter((t) => t !== currentTech)
    .slice(0, 5);
}

export function getRelatedRoles(currentRole: string) {
  const related = PROFESSIONAL_TITLE_OPTIONS.filter(
    (r) => r !== currentRole,
  ).slice(0, 6);
  return related;
}
