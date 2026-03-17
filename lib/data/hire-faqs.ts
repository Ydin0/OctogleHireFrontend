// ---------------------------------------------------------------------------
// Shared FAQ data for all /hire pages (hire-page-layout + app/hire/[slug])
// ---------------------------------------------------------------------------

export interface HireFaqItem {
  q: string;
  a: string;
}

export const hireFaqs: HireFaqItem[] = [
  {
    q: "How quickly can I hire a developer?",
    a: "You'll receive 3–5 vetted candidate profiles within 48 hours of your demo call. Most companies go from first intro to signed contract in under 5 business days — compared to 6–12 weeks with traditional agencies.",
  },
  {
    q: "How are developers vetted?",
    a: "Every developer passes a 5-stage process: application screening, stack-specific technical assessment, live system design interview, soft-skills evaluation, and reference checks. From over 25,000 applicants reviewed, only 1,000 have been accepted into our network.",
  },
  {
    q: "How much does it cost?",
    a: "OctogleHire developers typically cost 40–60% less than hiring locally in the US, UK, or Australia. There are no upfront fees or placement commissions — you only pay a transparent monthly rate once your developer starts.",
  },
  {
    q: "What if a developer isn't the right fit?",
    a: "Every placement includes a risk-free replacement guarantee — 14 days on our On-Demand plan and 30 days on our Marketplace plan. If a developer doesn't meet your expectations, we'll find a replacement at no additional cost and manage the transition for you. Our replacement rate is under 6%.",
  },
  {
    q: "Do you handle contracts and compliance?",
    a: "Yes. We manage all contracts, IP agreements, payroll, and tax compliance end-to-end across 30+ countries. You get a single invoice — no need to set up foreign entities or navigate international employment law.",
  },
  {
    q: "How many developers are in the network?",
    a: "Our active network includes 1,000+ pre-vetted engineers across 40+ tech stacks. From over 25,000 applicants reviewed, only 1,000 have been accepted into our active network.",
  },
  {
    q: "What is the developer retention rate?",
    a: "94% of placements extend beyond 6 months. We achieve this through rigorous vetting, precise matching, and ongoing account management that ensures both sides are supported.",
  },
  {
    q: "What tech stacks do you cover?",
    a: "We cover 40+ stacks including React, Node.js, Python, Go, Java, .NET, mobile (iOS/Android/Flutter), DevOps, cloud infrastructure, AI/ML, data engineering, and more. If it ships software, we can staff it.",
  },
  {
    q: "Can I hire from a specific country?",
    a: "Yes. Our network spans 30+ countries. During matching, we prioritise developers whose working hours overlap with yours by at least 4–6 hours, so real-time collaboration is seamless.",
  },
  {
    q: "How does OctogleHire pricing compare to agencies?",
    a: "Traditional agencies charge $20K–$40K placement fees plus markups. OctogleHire has zero placement fees — you pay a transparent monthly rate that's 40–60% less than equivalent local hires. Over 300 companies have made the switch.",
  },
  {
    q: "What engagement types are available?",
    a: "We support hourly, part-time, full-time, and project-based engagements. Over 300 companies use OctogleHire across all engagement types. Scale up or down with no long-term lock-in.",
  },
  {
    q: "Is there a replacement guarantee?",
    a: "Yes. On-Demand placements include a 14-day replacement guarantee, and Marketplace placements include a 30-day guarantee. Our replacement rate is under 6% — but if you need a swap, we handle the entire transition at no additional cost.",
  },
];
