import {
  Clock,
  Globe,
  HandCoins,
  Rocket,
  Scale,
  Shield,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Benefits
// ---------------------------------------------------------------------------

export interface DevBenefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const devBenefits: DevBenefit[] = [
  {
    icon: Globe,
    title: "Work with Global Teams",
    description:
      "Access roles at 300+ companies in the US, EU, UK, and Australia — without relocating. Build your career at scale across 150+ countries.",
  },
  {
    icon: HandCoins,
    title: "Transparent Compensation",
    description:
      "Rates 40–60% above local benchmarks are shared before any interview. No surprises, no drawn-out negotiations — just clarity from the start.",
  },
  {
    icon: Zap,
    title: "Fast Role Matching",
    description:
      "Approved developers receive their first matched role within 48 hours. Less waiting, more building.",
  },
  {
    icon: Scale,
    title: "Zero Admin Overhead",
    description:
      "Contracts, invoicing, payroll, and compliance — fully handled by OctogleHire so you can focus on your work.",
  },
  {
    icon: Shield,
    title: "Vetted Companies Only",
    description:
      "Every company is screened before they can access the network. Your time is spent on real opportunities.",
  },
  {
    icon: Clock,
    title: "Hourly, Monthly, or Annual Contracts",
    description:
      "Choose the engagement model that fits you — from short-term hourly projects to stable annual contracts. 94% of developers renew beyond 6 months.",
  },
];

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

export interface DevTestimonial {
  name: string;
  title: string;
  quote: string;
  image: string;
}

export const testimonials: DevTestimonial[] = [
  {
    name: "Pratteek Shaurya",
    title: "Software Engineer",
    quote: "Applied once, started my first client project within two weeks.",
    image:
      "https://media.licdn.com/dms/image/v2/D4D03AQHq-t4Dd0zoug/profile-displayphoto-shrink_800_800/B4DZSdNblZGcAc-/0/1737804331792?e=1773878400&v=beta&t=aio0pJ_ARRaiXzF5qA0cneSDRLIBrJJyTs2ImdiyADI",
  },
  {
    name: "Anil Wadghule",
    title: "Solutions Architect",
    quote:
      "They matched me with a project that actually needed my Elixir expertise.",
    image:
      "https://media.licdn.com/dms/image/v2/C4E03AQGQaEZ5cwQnpA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1641360584592?e=1773878400&v=beta&t=lvIRhWnRA7GHoOmIY2_y7ZoYK1gpq1DYulFP8UqoODk",
  },
  {
    name: "Mahindra Danane",
    title: "Software Engineer",
    quote:
      "I get to work with international teams I wouldn't have had access to otherwise.",
    image:
      "https://media.licdn.com/dms/image/v2/D4D03AQFEoQR7Nvvv9g/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1729739461690?e=1773878400&v=beta&t=jbwJDsgsH73JA3MF1gjqqHMVHdZoibZsSojf6ZlqZN0",
  },
  {
    name: "Prasanna Wagh",
    title: "Fullstack Developer",
    quote:
      "As a junior, getting access to global clients felt impossible — until OctogleHire.",
    image:
      "https://media.licdn.com/dms/image/v2/D4D03AQGXvk1r3zg35Q/profile-displayphoto-crop_800_800/B4DZpvFnA8IkAI-/0/1762800335197?e=1773878400&v=beta&t=HIEcMS-LgRWHo6cWNalpP4EwqfYhD-e-FIDVDX3xdfw",
  },
  {
    name: "Yash Chavan",
    title: "Frontend Developer",
    quote:
      "Compensation was transparent and I started building from day one.",
    image:
      "https://media.licdn.com/dms/image/v2/D4D03AQF0dQB7XJcuwg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1709399954775?e=1773878400&v=beta&t=CAorsQS2n78aS4UgQ5LBDmnWVJmDtPT42a7jkvkk3r8",
  },
  {
    name: "Neha Shirsat",
    title: "QA Engineer",
    quote:
      "The onboarding was seamless — I was writing production code within my first week.",
    image:
      "https://media.licdn.com/dms/image/v2/D4D03AQEyX_RPVHe7PA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1696576746610?e=1773878400&v=beta&t=nx0WhyC1gZv9LZgpi46cZ1SCEpYKAQP9Jbk75D2wK7k",
  },
];

// ---------------------------------------------------------------------------
// CTA feature bullets
// ---------------------------------------------------------------------------

export interface CtaItem {
  icon: LucideIcon;
  text: string;
}

export const ctaList: CtaItem[] = [
  { icon: Zap, text: "Reviewed within 48 hours" },
  { icon: HandCoins, text: "Transparent rates, always" },
  { icon: Globe, text: "Global companies, remote-first" },
  { icon: Scale, text: "Contracts & compliance handled" },
  { icon: Users, text: "Dedicated account support" },
  { icon: Rocket, text: "Career-defining opportunities" },
];

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

export interface FaqItem {
  q: string;
  a: string;
}

export const devFaqs: FaqItem[] = [
  {
    q: "What does the vetting process involve?",
    a: "Every application goes through 5 stages: profile review, stack-specific technical assessment, live system design interview, background check, and reference verification. Only the top 3% of applicants are approved.",
  },
  {
    q: "How long until I start receiving role matches?",
    a: "Once your application is approved — typically within 48 hours — we begin matching you to relevant roles. Most approved developers receive their first match within 48 hours of approval.",
  },
  {
    q: "What rates can I expect?",
    a: "Rates vary by stack and experience level but are consistently 40–60% higher than typical local market rates. All rates are disclosed up front before any interview takes place.",
  },
  {
    q: "Who are the companies I would work with?",
    a: "We work with funded startups, scale-ups, and enterprise teams primarily based in the US, UK, EU, and Australia. Every company is vetted before they can access the developer network.",
  },
  {
    q: "What engagement types are available?",
    a: "We support hourly, part-time, full-time, and project-based engagements. You specify your preferences during the application and we match you accordingly.",
  },
  {
    q: "How does payment work for developers?",
    a: "OctogleHire acts as your employer of record. You receive a single monthly payment from us regardless of how many roles you're engaged on. No invoicing, no chasing clients.",
  },
  {
    q: "How many companies use the platform?",
    a: "Over 300 companies — from funded startups to enterprise teams — hire through OctogleHire. Every company is vetted before they can access the developer network.",
  },
  {
    q: "What is the acceptance rate?",
    a: "Only the top 3% of applicants are accepted into the network. We've reviewed over 30,000 applications to build our current pool of 1,000+ active engineers.",
  },
  {
    q: "Is invoicing handled for me?",
    a: "Yes. OctogleHire acts as employer of record. We handle all invoicing, tax compliance, and payroll — you receive a single monthly payment with no admin overhead.",
  },
  {
    q: "Can I work with multiple clients?",
    a: "Yes, if your availability allows it. Many developers on OctogleHire manage part-time engagements with multiple clients simultaneously.",
  },
  {
    q: "What if I want to leave a project?",
    a: "We ask for a 2-week notice period to ensure a smooth transition. Our team handles the offboarding process and can match you with a new role immediately.",
  },
  {
    q: "Is there a minimum commitment?",
    a: "No minimum commitment is required. That said, 94% of developers extend beyond 6 months — most engagements turn into long-term partnerships.",
  },
];
