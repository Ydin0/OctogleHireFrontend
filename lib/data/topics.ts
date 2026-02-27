export interface Topic {
  slug: string;
  title: string;
  headline: string;
  description: string;
  /** Blog post slugs that belong to this cluster */
  posts: string[];
  /** Related hire page links */
  relatedHireLinks: { label: string; href: string }[];
  /** CTA text */
  cta: { title: string; description: string; href: string; label: string };
}

export const topics: Topic[] = [
  {
    slug: "remote-hiring",
    title: "Remote Hiring",
    headline: "The Complete Guide to Remote Hiring",
    description:
      "Everything you need to hire remote developers — from sourcing and vetting to onboarding and retention. Based on 300+ placements across 150+ countries.",
    posts: [
      "how-to-hire-remote-developers",
      "state-of-remote-hiring-2026",
      "remote-developer-salary-guide",
      "where-to-hire-developers-globally",
      "why-engineering-teams-are-going-remote",
      "octoglehire-vs-toptal-vs-turing",
    ],
    relatedHireLinks: [
      { label: "Hire React Developers", href: "/hire/react-developers" },
      { label: "Hire Python Developers", href: "/hire/python-developers" },
      { label: "Hire Node.js Developers", href: "/hire/node-js-developers" },
      { label: "Developers in India", href: "/hire/developers-in/india" },
      { label: "Developers in Brazil", href: "/hire/developers-in/brazil" },
    ],
    cta: {
      title: "Start hiring remotely",
      description:
        "OctogleHire delivers 3–5 pre-vetted profiles within 48 hours from 150+ countries. Zero upfront fees.",
      href: "/companies/signup",
      label: "Start Hiring",
    },
  },
  {
    slug: "developer-vetting",
    title: "Developer Vetting",
    headline: "How to Vet and Assess Software Developers",
    description:
      "Deep dives into technical assessment, interview design, and quality assurance for engineering hires. Learn how top-3% vetting works in practice.",
    posts: [
      "inside-our-vetting-process",
      "technical-interviews-are-broken",
      "how-to-hire-remote-developers",
      "developer-survey-2026",
    ],
    relatedHireLinks: [
      { label: "Hire Pre-Vetted Developers", href: "/companies/signup" },
      { label: "Browse Developer Profiles", href: "/marketplace" },
      { label: "Our Vetting Process", href: "/blog/inside-our-vetting-process" },
    ],
    cta: {
      title: "Skip the vetting",
      description:
        "Every developer on OctogleHire has already passed a 5-stage vetting process with a 3% acceptance rate.",
      href: "/marketplace",
      label: "Browse Pre-Vetted Engineers",
    },
  },
  {
    slug: "global-compliance",
    title: "International Compliance & Payroll",
    headline: "Compliance, Payroll, and Contracts for Global Teams",
    description:
      "Navigate international employment law, payroll, tax compliance, and IP protection when hiring across borders. OctogleHire manages compliance in 150+ countries.",
    posts: [
      "what-ctos-get-wrong-about-offshore-development",
      "staff-augmentation-vs-full-time-hiring",
      "where-to-hire-developers-globally",
      "state-of-remote-hiring-2026",
    ],
    relatedHireLinks: [
      { label: "Developers in India", href: "/hire/developers-in/india" },
      { label: "Developers in Poland", href: "/hire/developers-in/poland" },
      { label: "Developers in Brazil", href: "/hire/developers-in/brazil" },
      { label: "Developers in Ukraine", href: "/hire/developers-in/ukraine" },
      { label: "Developers in Argentina", href: "/hire/developers-in/argentina" },
    ],
    cta: {
      title: "Compliance handled",
      description:
        "OctogleHire acts as Employer of Record across 150+ countries. Single invoice, zero legal complexity.",
      href: "/companies/signup",
      label: "Start Hiring Compliantly",
    },
  },
  {
    slug: "scaling-engineering-teams",
    title: "Scaling Engineering Teams",
    headline: "How to Scale Engineering Teams Efficiently",
    description:
      "Strategies for growing your engineering capacity without burning runway — covering staff augmentation, async workflows, global hiring, and team architecture.",
    posts: [
      "scale-engineering-team-without-burning-runway",
      "building-async-engineering-teams",
      "staff-augmentation-vs-full-time-hiring",
      "why-engineering-teams-are-going-remote",
      "developer-survey-2026",
    ],
    relatedHireLinks: [
      { label: "Hire React Developers", href: "/hire/react-developers" },
      { label: "Hire Full-Stack Engineers", href: "/hire/full-stack-engineer" },
      { label: "Hire DevOps Engineers", href: "/hire/devops-engineer" },
      { label: "See Pricing", href: "/#pricing" },
    ],
    cta: {
      title: "Scale in days, not months",
      description:
        "300+ companies use OctogleHire to scale engineering teams at 40–60% below US/UK rates. No lock-in.",
      href: "/companies/signup",
      label: "Start Scaling",
    },
  },
];

export function getTopicBySlug(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug);
}

export function getAllTopicSlugs(): string[] {
  return topics.map((t) => t.slug);
}
