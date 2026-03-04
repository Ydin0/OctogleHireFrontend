import type { CompanyStatus } from "@/app/admin/dashboard/_components/dashboard-data";

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
  | "declined"
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
  experienceYearsMin?: number;
  experienceYearsMax?: number;
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

export interface CompanyEngagement {
  id: string;
  developerId: string;
  developerName: string;
  developerRole: string;
  developerAvatar: string;
  requirementId: string;
  requirementTitle: string;
  companyBillingRate: number;
  currency: string;
  engagementType: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  monthlyHoursExpected: number | null;
  monthlyHoursCap: number | null;
  currentMonthTimeEntry: { hours: number; status: string } | null;
  pendingChangeRequests: number;
  createdAt: string;
}

export interface EngagementChangeRequest {
  id: string;
  engagementId: string;
  companyId: string;
  type: "cancellation" | "hour_reduction" | "extension";
  status: "pending" | "approved" | "rejected";
  reason: string;
  requestedEffectiveDate: string;
  requestedMonthlyHours: number | null;
  requestedEndDate: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyTimeEntry {
  id: string;
  period: string;
  hours: number;
  description: string | null;
  status: string;
  createdAt: string;
}

export interface CompanyProfileSummary {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  website?: string;
  location?: string;
  domain?: string | null;
  logoUrl?: string | null;
  status: CompanyStatus;
  invoiceCurrency: string;
  createdAt: string;
}

export interface CompanyProfile {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  website?: string;
  location?: string;
  domain?: string | null;
  logoUrl?: string | null;
  status: CompanyStatus;
  invoiceCurrency: string;
  requirements: JobRequirement[];
  teamMembers: TeamMember[];
  createdAt: string;
}

export interface CreateJobRequirementPayload {
  title: string;
  techStack: string[];
  experienceLevel: ExperienceLevel;
  experienceYearsMin?: number;
  experienceYearsMax?: number;
  developersNeeded: number;
  engagementType: EngagementType;
  timezonePreference: string;
  budgetMin?: number;
  budgetMax?: number;
  description: string;
  startDate: string;
  priority: Priority;
}

export interface LinkedInJob {
  externalId: string;
  title: string;
  description: string;
  descriptionHtml: string;
  location: string;
  employmentType: string;
  salary: string;
  postedAt: string;
  url: string;
}

export interface ParsedJobData {
  title: string;
  techStack: string[];
  experienceYearsMin: number;
  experienceYearsMax: number;
  developersNeeded: number;
  engagementType: string;
  timezonePreference: string;
  budgetMin?: number;
  budgetMax?: number;
  description: string;
  startDate?: string;
  priority: string;
}

export interface ProposeMatchPayload {
  developerId: string;
  hourlyRate: number;
  monthlyRate: number;
  currency: string;
}

// ── Company-side API functions ───────────────────────────────────────────────

export async function fetchCompanyProfile(
  token: string | null,
): Promise<CompanyProfileSummary | null> {
  if (!token) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/companies/profile`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 60 },
      },
    );

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as CompanyProfileSummary;
  } catch {
    return null;
  }
}

export async function fetchCompanyTeam(
  token: string | null,
): Promise<TeamMember[] | null> {
  if (!token) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/companies/team`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 60 },
      },
    );

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as TeamMember[];
  } catch {
    return null;
  }
}

export async function fetchCompanyEngagements(
  token: string | null,
): Promise<CompanyEngagement[] | null> {
  if (!token) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/companies/engagements`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 60 },
      },
    );

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as CompanyEngagement[];
  } catch {
    return null;
  }
}

export async function fetchEngagementTimeEntries(
  token: string | null,
  engagementId: string,
): Promise<CompanyTimeEntry[]> {
  if (!token) return [];

  const response = await fetch(
    `${apiBaseUrl}/api/companies/engagements/${engagementId}/time-entries`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );

  if (!response.ok) throw new Error("Failed to fetch time entries");
  return (await response.json()) as CompanyTimeEntry[];
}

export async function fetchEngagementChangeRequests(
  token: string | null,
  engagementId: string,
): Promise<EngagementChangeRequest[]> {
  if (!token) return [];

  const response = await fetch(
    `${apiBaseUrl}/api/companies/engagements/${engagementId}/change-requests`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );

  if (!response.ok) throw new Error("Failed to fetch change requests");
  return (await response.json()) as EngagementChangeRequest[];
}

export async function createChangeRequest(
  token: string | null,
  engagementId: string,
  payload: {
    type: "cancellation" | "hour_reduction" | "extension";
    reason: string;
    requestedEffectiveDate: string;
    requestedMonthlyHours?: number;
    requestedEndDate?: string;
  },
): Promise<EngagementChangeRequest> {
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(
    `${apiBaseUrl}/api/companies/engagements/${engagementId}/change-requests`,
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

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Failed to create change request");
  }

  return (await response.json()) as EngagementChangeRequest;
}

export async function fetchCompanyRequirements(
  token: string | null,
): Promise<JobRequirement[] | null> {
  if (!token) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/companies/requirements`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 30 },
      },
    );

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as JobRequirement[];
  } catch {
    return null;
  }
}

export async function fetchCompanyRequirement(
  token: string | null,
  requirementId: string,
): Promise<JobRequirement | null> {
  if (!token) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/companies/requirements/${requirementId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 30 },
      },
    );

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as JobRequirement;
  } catch {
    return null;
  }
}

export async function createJobRequirement(
  token: string | null,
  payload: CreateJobRequirementPayload,
): Promise<JobRequirement> {
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(
    `${apiBaseUrl}/api/companies/requirements`,
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

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Failed to create requirement");
  }

  return (await response.json()) as JobRequirement;
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
      `${apiBaseUrl}/api/companies/matches/${matchId}/respond`,
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

// ── LinkedIn + Document Parsing API functions ────────────────────────────────

export async function fetchLinkedInJobs(
  token: string | null,
  linkedinCompanyUrl: string,
): Promise<LinkedInJob[]> {
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(
    `${apiBaseUrl}/api/companies/linkedin-jobs`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ linkedinCompanyUrl }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Failed to fetch LinkedIn jobs");
  }

  return (await response.json()) as LinkedInJob[];
}

export async function parseLinkedInJob(
  token: string | null,
  data: { title: string; description: string },
): Promise<ParsedJobData> {
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(
    `${apiBaseUrl}/api/companies/linkedin-jobs/parse`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Failed to parse job");
  }

  return (await response.json()) as ParsedJobData;
}

export async function parseJobDocument(
  token: string | null,
  file: File,
): Promise<ParsedJobData> {
  if (!token) throw new Error("Not authenticated");

  const formData = new FormData();
  formData.append("document", file);

  const response = await fetch(
    `${apiBaseUrl}/api/companies/requirements/parse-document`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Failed to parse document");
  }

  return (await response.json()) as ParsedJobData;
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
        next: { revalidate: 60 },
      },
    );

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as CompanyProfile[];
  } catch {
    return null;
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
        next: { revalidate: 60 },
      },
    );

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as CompanyProfile;
  } catch {
    return null;
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
        next: { revalidate: 30 },
      },
    );

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as JobRequirement;
  } catch {
    return null;
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

export async function updateCompanyCurrency(
  token: string | null,
  companyId: string,
  invoiceCurrency: string,
): Promise<{ id: string; companyName: string; invoiceCurrency: string } | null> {
  if (!token) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/admin/companies/${companyId}/currency`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ invoiceCurrency }),
        cache: "no-store",
      },
    );

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as { id: string; companyName: string; invoiceCurrency: string };
  } catch {
    return null;
  }
}

export async function activateCompany(
  token: string | null,
  companyId: string,
): Promise<CompanyProfile | null> {
  if (!token) return null;

  const response = await fetch(
    `${apiBaseUrl}/api/admin/companies/${companyId}/activate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Failed to activate company");
  }

  return (await response.json()) as CompanyProfile;
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

export async function deleteCompany(
  token: string | null,
  companyId: string,
): Promise<{ ok: boolean; message?: string }> {
  if (!token) return { ok: false, message: "No token" };

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/admin/companies/${companyId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );

    if (response.status === 204) return { ok: true };

    const body = await response.json().catch(() => ({}));
    return { ok: false, message: body.message || "Failed to delete company" };
  } catch {
    return { ok: false, message: "Network error" };
  }
}

export interface CreateCompanyPayload {
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  website?: string;
  location?: string;
}

export async function createCompany(
  token: string | null,
  payload: CreateCompanyPayload,
): Promise<CompanyProfile | null> {
  if (!token) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/admin/companies`,
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

    if (!response.ok) return null;
    return (await response.json()) as CompanyProfile;
  } catch {
    return null;
  }
}

// ── Company Developer Profile ─────────────────────────────────────────────────

export interface CompanyDeveloperMatch {
  id: string;
  requirementTitle: string;
  proposedHourlyRate: number;
  proposedMonthlyRate: number;
  currency: string;
  status: string;
  proposedAt: string;
  engagementType: string;
}

export interface CompanyDeveloperProfile {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isOnline: boolean;
  skills: string[];
  secondarySkills: string;
  rating: number;
  projects: number;
  hourlyRate: number;
  monthlyRate: number;
  location: string;
  yearsOfExperience: number;
  bio: string;
  about: string;
  englishProficiency: string | null;
  availability: string | null;
  engagementType: string[];
  certifications: string | null;
  hasResume: boolean;
  workHistory: {
    company: string;
    role: string;
    duration: string;
    description: string;
    techUsed: string[];
    companyDomain?: string;
    companyLogoUrl?: string;
  }[];
  achievements: string[];
  education: {
    institution: string;
    degree: string;
    field: string;
    year: string;
    institutionLogoUrl?: string;
  }[];
  awards: {
    title: string;
    issuer: string;
    year: string;
  }[];
  matches: CompanyDeveloperMatch[];
}

// ── Company Invoice types ────────────────────────────────────────────────────

export interface CompanyInvoiceLineItem {
  id: string;
  developerName: string;
  developerRole: string;
  requirementTitle: string;
  hourlyRate: number;
  hoursWorked: number;
  amount: number;
}

export interface CompanyInvoice {
  id: string;
  invoiceNumber: string;
  periodStart: string;
  periodEnd: string;
  issuedAt: string | null;
  dueDate: string | null;
  paidAt: string | null;
  currency: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: string;
  notes: string | null;
  lineItems: CompanyInvoiceLineItem[];
  createdAt: string;
}

export interface CompanyInvoiceSummary {
  totalInvoices: number;
  totalBilled: number;
  totalPaid: number;
  totalOutstanding: number;
  overdueCount: number;
}

export async function fetchCompanyInvoices(
  token: string | null,
): Promise<CompanyInvoice[]> {
  if (!token) return [];
  try {
    const response = await fetch(`${apiBaseUrl}/api/companies/invoices`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) return [];
    return (await response.json()) as CompanyInvoice[];
  } catch {
    return [];
  }
}

export async function fetchCompanyInvoiceSummaryData(
  token: string | null,
): Promise<CompanyInvoiceSummary | null> {
  if (!token) return null;
  try {
    const response = await fetch(`${apiBaseUrl}/api/companies/invoices/summary`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as CompanyInvoiceSummary;
  } catch {
    return null;
  }
}

export async function fetchCompanyDeveloperProfile(
  token: string | null,
  developerId: string,
): Promise<CompanyDeveloperProfile | null> {
  if (!token) return null;
  try {
    const response = await fetch(
      `${apiBaseUrl}/api/companies/developers/${developerId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 60 },
      },
    );
    if (!response.ok) return null;
    const data = (await response.json()) as { developer: CompanyDeveloperProfile };
    return data.developer;
  } catch {
    return null;
  }
}
