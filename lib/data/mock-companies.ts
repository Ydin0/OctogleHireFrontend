import type { CompanyStatus } from "@/app/admin/dashboard/_components/dashboard-data";
import type {
  RequirementStatus,
  MatchStatus,
  ExperienceLevel,
  EngagementType,
  Priority,
  DeveloperSummary,
} from "@/lib/api/companies";
import { developers } from "./developers";

// ── Mock types (mirror API types but used locally) ───────────────────────────

export interface MockCompany {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  website?: string;
  location?: string;
  status: CompanyStatus;
  createdAt: string;
}

export interface MockJobRequirement {
  id: string;
  companyId: string;
  title: string;
  techStack: string[];
  experienceLevel: ExperienceLevel;
  developersNeeded: number;
  engagementType: EngagementType;
  timezonePreference: string;
  budgetMin?: number;
  budgetMax?: number;
  description: string;
  startDate: string;
  priority: Priority;
  status: RequirementStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MockTeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  joinedAt: string;
}

export interface MockProposedMatch {
  id: string;
  requirementId: string;
  developerId: string;
  developer: DeveloperSummary;
  proposedHourlyRate: number;
  proposedMonthlyRate: number;
  currency: string;
  status: MatchStatus;
  rejectionReason?: string;
  proposedAt: string;
  respondedAt?: string;
}

// ── Developer summaries from marketplace data ────────────────────────────────

function toDeveloperSummary(dev: (typeof developers)[number]): DeveloperSummary {
  return {
    id: dev.id,
    name: dev.name,
    role: dev.role,
    avatar: dev.avatar,
    skills: dev.skills,
    rating: dev.rating,
    projects: dev.projects,
    hourlyRate: dev.hourlyRate,
    monthlyRate: dev.monthlyRate,
    location: dev.location,
    yearsOfExperience: dev.yearsOfExperience,
    bio: dev.bio,
  };
}

const devSummaries: Record<string, DeveloperSummary> = Object.fromEntries(
  developers.map((d) => [d.id, toDeveloperSummary(d)]),
);

// ── Companies ────────────────────────────────────────────────────────────────

const mockCompanies: MockCompany[] = [
  {
    id: "company-1",
    companyName: "Nexora Technologies",
    contactName: "Sarah Chen",
    email: "sarah@nexora.io",
    phone: "+1 (415) 555-0142",
    website: "nexora.io",
    location: "San Francisco, US",
    status: "active",
    createdAt: "2025-11-15T10:00:00Z",
  },
  {
    id: "company-2",
    companyName: "Verdant Health",
    contactName: "Marcus Williams",
    email: "marcus@verdanthealth.com",
    phone: "+1 (212) 555-0198",
    website: "verdanthealth.com",
    location: "New York, US",
    status: "active",
    createdAt: "2025-12-02T14:30:00Z",
  },
  {
    id: "company-3",
    companyName: "Orbital Logistics",
    contactName: "Kenji Nakamura",
    email: "kenji@orbitallogistics.co",
    phone: "+81 3-5555-0177",
    website: "orbitallogistics.co",
    location: "Tokyo, JP",
    status: "enquired",
    createdAt: "2026-01-10T09:15:00Z",
  },
  {
    id: "company-4",
    companyName: "Finley & Associates",
    contactName: "Emma Finley",
    email: "emma@finleyassoc.com",
    phone: "+44 20 5555 0133",
    location: "London, UK",
    status: "contacted",
    createdAt: "2026-01-22T16:45:00Z",
  },
  {
    id: "company-5",
    companyName: "Aurum Capital",
    contactName: "Daniel Park",
    email: "daniel@aurumcap.com",
    phone: "+1 (646) 555-0161",
    website: "aurumcap.com",
    location: "New York, US",
    status: "inactive",
    createdAt: "2025-09-05T11:00:00Z",
  },
];

// ── Requirements ─────────────────────────────────────────────────────────────

const mockRequirements: MockJobRequirement[] = [
  {
    id: "req-1",
    companyId: "company-1",
    title: "Senior React Engineers for Dashboard Rebuild",
    techStack: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    experienceLevel: "senior",
    developersNeeded: 3,
    engagementType: "full-time",
    timezonePreference: "overlap-us",
    budgetMin: 70,
    budgetMax: 95,
    description:
      "We are rebuilding our internal analytics dashboard from scratch using Next.js 14 and need experienced React engineers who can work with our existing design system. Must be comfortable with server components and have experience scaling complex data visualizations.",
    startDate: "2026-03-15",
    priority: "high",
    status: "matching",
    createdAt: "2026-02-10T08:00:00Z",
    updatedAt: "2026-02-20T14:30:00Z",
  },
  {
    id: "req-2",
    companyId: "company-1",
    title: "DevOps Engineer for Cloud Migration",
    techStack: ["AWS", "Docker", "Kubernetes", "Terraform"],
    experienceLevel: "senior",
    developersNeeded: 1,
    engagementType: "contract",
    timezonePreference: "any",
    budgetMin: 85,
    budgetMax: 120,
    description:
      "Leading migration from on-premise infrastructure to AWS. Need someone with strong Kubernetes experience and familiarity with infrastructure-as-code patterns. 6 month engagement with possible extension.",
    startDate: "2026-04-01",
    priority: "medium",
    status: "open",
    createdAt: "2026-02-15T10:00:00Z",
    updatedAt: "2026-02-15T10:00:00Z",
  },
  {
    id: "req-3",
    companyId: "company-1",
    title: "Full Stack Node.js Developer",
    techStack: ["Node.js", "PostgreSQL", "React", "TypeScript"],
    experienceLevel: "mid",
    developersNeeded: 2,
    engagementType: "full-time",
    timezonePreference: "overlap-eu",
    description:
      "Building new microservices for our order management platform. Need developers who are comfortable owning features end-to-end from API design through frontend implementation.",
    startDate: "2026-03-01",
    priority: "high",
    status: "partially_filled",
    createdAt: "2026-01-28T12:00:00Z",
    updatedAt: "2026-02-18T09:00:00Z",
  },
  {
    id: "req-4",
    companyId: "company-2",
    title: "Mobile Developer for Patient Portal",
    techStack: ["React Native", "TypeScript", "Firebase"],
    experienceLevel: "senior",
    developersNeeded: 2,
    engagementType: "full-time",
    timezonePreference: "americas",
    budgetMin: 75,
    budgetMax: 100,
    description:
      "Building a cross-platform patient portal for our telehealth platform. Must have healthcare industry experience or be familiar with HIPAA compliance requirements. Strong focus on accessibility.",
    startDate: "2026-03-10",
    priority: "urgent",
    status: "matching",
    createdAt: "2026-02-05T11:30:00Z",
    updatedAt: "2026-02-22T16:00:00Z",
  },
  {
    id: "req-5",
    companyId: "company-2",
    title: "Backend Python Engineers",
    techStack: ["Python", "FastAPI", "PostgreSQL", "Docker"],
    experienceLevel: "mid",
    developersNeeded: 3,
    engagementType: "full-time",
    timezonePreference: "overlap-us",
    description:
      "Expanding our core backend team to handle increased API load and new integrations with insurance providers. Need engineers experienced with async Python and complex data pipelines.",
    startDate: "2026-04-01",
    priority: "medium",
    status: "filled",
    createdAt: "2025-12-20T09:00:00Z",
    updatedAt: "2026-02-01T14:00:00Z",
  },
  {
    id: "req-6",
    companyId: "company-3",
    title: "Go Backend Developer for Logistics Platform",
    techStack: ["Go", "PostgreSQL", "Docker", "Kubernetes"],
    experienceLevel: "senior",
    developersNeeded: 1,
    engagementType: "contract",
    timezonePreference: "asia-pacific",
    budgetMin: 80,
    budgetMax: 110,
    description:
      "Building high-throughput real-time tracking APIs for our logistics platform. Must be comfortable with concurrent programming patterns and distributed systems.",
    startDate: "2026-03-20",
    priority: "high",
    status: "open",
    createdAt: "2026-02-12T07:00:00Z",
    updatedAt: "2026-02-12T07:00:00Z",
  },
  {
    id: "req-7",
    companyId: "company-4",
    title: "Frontend Vue.js Developer",
    techStack: ["Vue.js", "TypeScript", "Tailwind CSS"],
    experienceLevel: "mid",
    developersNeeded: 1,
    engagementType: "part-time",
    timezonePreference: "europe",
    description:
      "Maintaining and extending our client-facing reporting dashboard built with Vue 3. Part-time engagement, approximately 20 hours per week.",
    startDate: "2026-04-15",
    priority: "low",
    status: "open",
    createdAt: "2026-02-18T13:00:00Z",
    updatedAt: "2026-02-18T13:00:00Z",
  },
  {
    id: "req-8",
    companyId: "company-2",
    title: "Data Engineer for Analytics Pipeline",
    techStack: ["Python", "AWS", "PostgreSQL", "Docker"],
    experienceLevel: "senior",
    developersNeeded: 1,
    engagementType: "full-time",
    timezonePreference: "overlap-us",
    budgetMin: 90,
    budgetMax: 130,
    description:
      "Designing and building our real-time analytics pipeline for patient outcomes data. Experience with HIPAA-compliant data handling and large-scale ETL processes required.",
    startDate: "2026-03-01",
    priority: "high",
    status: "partially_filled",
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-02-25T11:00:00Z",
  },
];

// ── Proposed Matches ─────────────────────────────────────────────────────────

const mockMatches: MockProposedMatch[] = [
  // req-1: Senior React Engineers (matching) — 2 proposed, 1 accepted
  {
    id: "match-1",
    requirementId: "req-1",
    developerId: "sofia-martinez",
    developer: devSummaries["sofia-martinez"],
    proposedHourlyRate: 80,
    proposedMonthlyRate: 12800,
    currency: "USD",
    status: "accepted",
    proposedAt: "2026-02-12T10:00:00Z",
    respondedAt: "2026-02-14T09:30:00Z",
  },
  {
    id: "match-2",
    requirementId: "req-1",
    developerId: "emma-larsson",
    developer: devSummaries["emma-larsson"],
    proposedHourlyRate: 72,
    proposedMonthlyRate: 11520,
    currency: "USD",
    status: "proposed",
    proposedAt: "2026-02-18T14:00:00Z",
  },
  {
    id: "match-3",
    requirementId: "req-1",
    developerId: "nina-kowalski",
    developer: devSummaries["nina-kowalski"],
    proposedHourlyRate: 68,
    proposedMonthlyRate: 10880,
    currency: "USD",
    status: "proposed",
    proposedAt: "2026-02-20T11:00:00Z",
  },
  // req-3: Full Stack Node.js (partially_filled) — 1 accepted, 1 rejected
  {
    id: "match-4",
    requirementId: "req-3",
    developerId: "david-kimani",
    developer: devSummaries["david-kimani"],
    proposedHourlyRate: 85,
    proposedMonthlyRate: 13600,
    currency: "USD",
    status: "accepted",
    proposedAt: "2026-02-01T09:00:00Z",
    respondedAt: "2026-02-03T15:00:00Z",
  },
  {
    id: "match-5",
    requirementId: "req-3",
    developerId: "lucas-weber",
    developer: devSummaries["lucas-weber"],
    proposedHourlyRate: 70,
    proposedMonthlyRate: 11200,
    currency: "USD",
    status: "rejected",
    rejectionReason: "Timezone overlap insufficient for our EU team coordination needs.",
    proposedAt: "2026-02-05T10:00:00Z",
    respondedAt: "2026-02-07T12:00:00Z",
  },
  // req-4: Mobile Developer (matching) — 2 proposed
  {
    id: "match-6",
    requirementId: "req-4",
    developerId: "arjun-patel",
    developer: devSummaries["arjun-patel"],
    proposedHourlyRate: 78,
    proposedMonthlyRate: 12480,
    currency: "USD",
    status: "proposed",
    proposedAt: "2026-02-22T08:00:00Z",
  },
  {
    id: "match-7",
    requirementId: "req-4",
    developerId: "carlos-rivera",
    developer: devSummaries["carlos-rivera"],
    proposedHourlyRate: 74,
    proposedMonthlyRate: 11840,
    currency: "USD",
    status: "proposed",
    proposedAt: "2026-02-23T10:00:00Z",
  },
  // req-5: Backend Python Engineers (filled) — 3 active
  {
    id: "match-8",
    requirementId: "req-5",
    developerId: "mei-lin-chen",
    developer: devSummaries["mei-lin-chen"],
    proposedHourlyRate: 88,
    proposedMonthlyRate: 14080,
    currency: "USD",
    status: "active",
    proposedAt: "2026-01-05T10:00:00Z",
    respondedAt: "2026-01-07T14:00:00Z",
  },
  {
    id: "match-9",
    requirementId: "req-5",
    developerId: "alex-petrov",
    developer: devSummaries["alex-petrov"],
    proposedHourlyRate: 76,
    proposedMonthlyRate: 12160,
    currency: "USD",
    status: "active",
    proposedAt: "2026-01-08T09:00:00Z",
    respondedAt: "2026-01-10T11:00:00Z",
  },
  {
    id: "match-10",
    requirementId: "req-5",
    developerId: "aisha-hassan",
    developer: devSummaries["aisha-hassan"],
    proposedHourlyRate: 72,
    proposedMonthlyRate: 11520,
    currency: "USD",
    status: "active",
    proposedAt: "2026-01-12T10:00:00Z",
    respondedAt: "2026-01-14T16:00:00Z",
  },
  // req-8: Data Engineer (partially_filled) — 1 accepted
  {
    id: "match-11",
    requirementId: "req-8",
    developerId: "priya-sharma",
    developer: devSummaries["priya-sharma"],
    proposedHourlyRate: 95,
    proposedMonthlyRate: 15200,
    currency: "USD",
    status: "accepted",
    proposedAt: "2026-02-20T09:00:00Z",
    respondedAt: "2026-02-22T10:00:00Z",
  },
];

// ── Team Members ─────────────────────────────────────────────────────────────

const mockTeamMembers: Record<string, MockTeamMember[]> = {
  "company-1": [
    {
      id: "tm-1",
      name: "Sarah Chen",
      email: "sarah@nexora.io",
      role: "CTO",
      joinedAt: "2025-11-15T10:00:00Z",
    },
    {
      id: "tm-2",
      name: "James Park",
      email: "james@nexora.io",
      role: "Engineering Manager",
      joinedAt: "2025-12-01T09:00:00Z",
    },
    {
      id: "tm-3",
      name: "Lina Torres",
      email: "lina@nexora.io",
      role: "HR Lead",
      joinedAt: "2026-01-10T11:00:00Z",
    },
  ],
  "company-2": [
    {
      id: "tm-4",
      name: "Marcus Williams",
      email: "marcus@verdanthealth.com",
      role: "VP Engineering",
      joinedAt: "2025-12-02T14:30:00Z",
    },
    {
      id: "tm-5",
      name: "Rachel Nguyen",
      email: "rachel@verdanthealth.com",
      role: "Technical Recruiter",
      joinedAt: "2026-01-05T10:00:00Z",
    },
  ],
  "company-3": [
    {
      id: "tm-6",
      name: "Kenji Nakamura",
      email: "kenji@orbitallogistics.co",
      role: "Founder & CEO",
      joinedAt: "2026-01-10T09:15:00Z",
    },
  ],
  "company-4": [
    {
      id: "tm-7",
      name: "Emma Finley",
      email: "emma@finleyassoc.com",
      role: "Managing Partner",
      joinedAt: "2026-01-22T16:45:00Z",
    },
    {
      id: "tm-8",
      name: "Tom Bradley",
      email: "tom@finleyassoc.com",
      role: "Senior Consultant",
      joinedAt: "2026-02-01T09:00:00Z",
    },
  ],
  "company-5": [
    {
      id: "tm-9",
      name: "Daniel Park",
      email: "daniel@aurumcap.com",
      role: "Head of Technology",
      joinedAt: "2025-09-05T11:00:00Z",
    },
  ],
};

// ── Getters ──────────────────────────────────────────────────────────────────

export function getMockCompanies(): MockCompany[] {
  return mockCompanies;
}

export function getMockCompanyById(id: string): MockCompany | undefined {
  return mockCompanies.find((c) => c.id === id);
}

export function getMockRequirementsByCompanyId(
  companyId: string,
): MockJobRequirement[] {
  return mockRequirements.filter((r) => r.companyId === companyId);
}

export function getMockRequirementById(
  id: string,
): MockJobRequirement | undefined {
  return mockRequirements.find((r) => r.id === id);
}

export function getMockMatchesByRequirementId(
  requirementId: string,
): MockProposedMatch[] {
  return mockMatches.filter((m) => m.requirementId === requirementId);
}

export function getMockAllRequirements(): MockJobRequirement[] {
  return mockRequirements;
}

export function getMockTeamMembersByCompanyId(
  companyId: string,
): MockTeamMember[] {
  return mockTeamMembers[companyId] ?? [];
}

export function getAllDeveloperSummaries(): DeveloperSummary[] {
  return developers.map(toDeveloperSummary);
}
