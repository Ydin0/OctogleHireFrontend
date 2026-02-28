import type { CompanyStatus } from "@/app/admin/dashboard/_components/dashboard-data";
import {
  getMockCompanies,
  getMockCompanyById,
  getMockRequirementsByCompanyId,
  getMockRequirementById,
  getMockMatchesByRequirementId,
  getMockTeamMembersByCompanyId,
  type MockCompany,
  type MockJobRequirement,
  type MockProposedMatch,
} from "@/lib/data/mock-companies";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

// ── Types ────────────────────────────────────────────────────────────────────

export type RequirementStatus =
  | "open"
  | "matching"
  | "partially_filled"
  | "filled"
  | "closed";

export type MatchStatus =
  | "proposed"
  | "accepted"
  | "rejected"
  | "active"
  | "ended";

export type ExperienceLevel =
  | "junior"
  | "mid"
  | "senior"
  | "lead"
  | "principal";

export type EngagementType =
  | "full-time"
  | "part-time"
  | "contract"
  | "project-based";

export type Priority = "low" | "medium" | "high" | "urgent";

export interface DeveloperSummary {
  id: string;
  name: string;
  role: string;
  avatar: string;
  skills: string[];
  rating: number;
  projects: number;
  hourlyRate: number;
  monthlyRate: number;
  location: string;
  yearsOfExperience: number;
  bio: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  joinedAt: string;
}

export interface ProposedMatch {
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

export interface JobRequirement {
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
  proposedMatches?: ProposedMatch[];
  createdAt: string;
  updatedAt: string;
}

export interface CompanyProfile {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  website?: string;
  location?: string;
  status: CompanyStatus;
  requirements: JobRequirement[];
  teamMembers: TeamMember[];
  createdAt: string;
}

export interface CreateJobRequirementPayload {
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
}

export interface ProposeMatchPayload {
  developerId: string;
  hourlyRate: number;
  monthlyRate: number;
  currency: string;
}

// ── Company-side API functions ───────────────────────────────────────────────

export async function fetchCompanyRequirements(
  token: string | null,
): Promise<JobRequirement[] | null> {
  if (!token) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/company/requirements`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as JobRequirement[];
  } catch {
    // Fallback to mock data
    const companyId = "company-1";
    const reqs = getMockRequirementsByCompanyId(companyId);
    return reqs.map(mapMockRequirement);
  }
}

export async function fetchCompanyRequirement(
  token: string | null,
  requirementId: string,
): Promise<JobRequirement | null> {
  if (!token) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/company/requirements/${requirementId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as JobRequirement;
  } catch {
    const req = getMockRequirementById(requirementId);
    if (!req) return null;
    return mapMockRequirement(req);
  }
}

export async function createJobRequirement(
  token: string | null,
  payload: CreateJobRequirementPayload,
): Promise<JobRequirement | null> {
  if (!token) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/company/requirements`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      },
    );

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as JobRequirement;
  } catch {
    // Mock: return a fake created requirement
    return {
      id: `req-${Date.now()}`,
      companyId: "company-1",
      ...payload,
      status: "open",
      proposedMatches: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}

export async function respondToMatch(
  token: string | null,
  matchId: string,
  action: "accepted" | "rejected",
  rejectionReason?: string,
): Promise<ProposedMatch | null> {
  if (!token) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/company/matches/${matchId}/respond`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, rejectionReason }),
        cache: "no-store",
      },
    );

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as ProposedMatch;
  } catch {
    return null;
  }
}

// ── Admin-side API functions ─────────────────────────────────────────────────

export async function fetchCompanies(
  token: string | null,
): Promise<CompanyProfile[] | null> {
  if (!token) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/admin/companies`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as CompanyProfile[];
  } catch {
    return getMockCompanies().map(mapMockCompany);
  }
}

export async function fetchCompany(
  token: string | null,
  companyId: string,
): Promise<CompanyProfile | null> {
  if (!token) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/admin/companies/${companyId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as CompanyProfile;
  } catch {
    const company = getMockCompanyById(companyId);
    if (!company) return null;
    return mapMockCompany(company);
  }
}

export async function fetchCompanyRequirementAdmin(
  token: string | null,
  requirementId: string,
): Promise<JobRequirement | null> {
  if (!token) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/admin/requirements/${requirementId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as JobRequirement;
  } catch {
    const req = getMockRequirementById(requirementId);
    if (!req) return null;
    return mapMockRequirement(req);
  }
}

export async function updateCompanyStatus(
  token: string | null,
  companyId: string,
  status: CompanyStatus,
): Promise<CompanyProfile | null> {
  if (!token) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/admin/companies/${companyId}/status`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
        cache: "no-store",
      },
    );

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as CompanyProfile;
  } catch {
    return null;
  }
}

export async function proposeMatch(
  token: string | null,
  requirementId: string,
  payload: ProposeMatchPayload,
): Promise<ProposedMatch | null> {
  if (!token) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/admin/requirements/${requirementId}/matches`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      },
    );

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as ProposedMatch;
  } catch {
    return null;
  }
}

export async function removeMatch(
  token: string | null,
  matchId: string,
): Promise<boolean> {
  if (!token) return false;

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/admin/matches/${matchId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );

    return response.ok;
  } catch {
    return false;
  }
}

// ── Mappers (mock → typed) ───────────────────────────────────────────────────

function mapMockRequirement(r: MockJobRequirement): JobRequirement {
  const matches = getMockMatchesByRequirementId(r.id);
  return {
    ...r,
    proposedMatches: matches.map(mapMockMatch),
  };
}

function mapMockMatch(m: MockProposedMatch): ProposedMatch {
  return { ...m };
}

function mapMockCompany(c: MockCompany): CompanyProfile {
  const reqs = getMockRequirementsByCompanyId(c.id);
  const members = getMockTeamMembersByCompanyId(c.id);
  return {
    ...c,
    requirements: reqs.map(mapMockRequirement),
    teamMembers: members.map((m) => ({ ...m })),
  };
}
