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
  | "interview_requested"
  | "interview_scheduled"
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

export interface WorkHistoryEntry {
  company: string;
  role: string;
  duration: string;
  description: string;
  techUsed: string[];
  companyDomain?: string;
  companyLogoUrl?: string;
}

export interface EducationEntry {
  institution: string;
  degree: string;
  field: string;
  year: string;
  institutionLogoUrl?: string;
}

export interface AwardEntry {
  title: string;
  issuer: string;
  year: string;
}

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
  about?: string;
  workHistory?: WorkHistoryEntry[];
  education?: EducationEntry[];
  achievements?: string[];
  awards?: AwardEntry[];
  introVideoUrl?: string | null;
  resumeUrl?: string | null;
  engagementType?: string | null;
  availability?: string | null;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  title: string | null;
  role: string;
  avatar: string | null;
  joinedAt: string;
}

export interface CompanyInterview {
  id: string;
  matchId: string;
  developerId: string;
  developerName: string;
  developerRole: string;
  developerAvatar: string;
  requirementTitle: string;
  scheduledAt: string | null;
  durationMinutes: number;
  type: string;
  meetingLink: string | null;
  status: string;
  proposedSlots: Array<{ start: string; end: string }> | null;
  selectedSlot: string | null;
  alternativeSlots: Array<{ start: string; end: string }> | null;
  companyNotes: string | null;
  companyRating: number | null;
  outcome: string | null;
  createdAt: string;
}

export interface AvailableSlotsResponse {
  availabilityNotSet: boolean;
  developerTimezone?: string;
  companyTimezone?: string;
  slots: Array<{
    start: string;
    end: string;
    developerLocalTime: string;
    companyLocalTime: string;
  }>;
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
  interview?: CompanyInterview;
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
  hiringCountries: string[];
  budgetMin?: number;
  budgetMax?: number;
  budgetType?: "hourly" | "monthly" | "annual";
  description: string;
  startDate: string;
  priority: Priority;
  status: RequirementStatus;
  proposedMatches?: ProposedMatch[];
  createdAt: string;
  updatedAt: string;
}

/** Normalise a requirement from the API so array/string fields are never null */
function normalizeRequirement(r: JobRequirement): JobRequirement {
  return {
    ...r,
    techStack: r.techStack ?? [],
    hiringCountries: r.hiringCountries ?? [],
    proposedMatches: (r.proposedMatches ?? []).map((m) => ({
      ...m,
      developer: m.developer
        ? { ...m.developer, skills: m.developer.skills ?? [] }
        : m.developer,
    })),
    engagementType: r.engagementType ?? ("" as EngagementType),
    timezonePreference: r.timezonePreference ?? "",
    description: r.description ?? "",
  };
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

export interface CompanyTimeEntryFull {
  id: string;
  engagementId: string;
  developerId: string;
  developerName: string;
  developerRole: string;
  developerAvatar: string;
  requirementTitle: string;
  period: string;
  hours: number;
  description: string | null;
  status: string;
  approvedAt: string | null;
  adminApproved: boolean;
  adminApprovedAt: string | null;
  companyApproved: boolean;
  companyApprovedAt: string | null;
  createdAt: string;
}

export interface AccountManager {
  name: string;
  email: string;
  phone: string | null;
  profilePhotoUrl: string | null;
}

export interface CompanyProfileSummary {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  website?: string;
  linkedinCompanyUrl?: string | null;
  location?: string;
  domain?: string | null;
  logoUrl?: string | null;
  status: CompanyStatus;
  invoiceCurrency: string;
  accountManagerId?: string | null;
  accountManager?: AccountManager | null;
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
  accountManagerId?: string | null;
  accountManager?: AccountManager | null;
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
  hiringCountries: string[];
  budgetMin?: number;
  budgetMax?: number;
  budgetType?: "hourly" | "monthly" | "annual";
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
  hiringCountries: string[];
  budgetMin?: number;
  budgetMax?: number;
  budgetType?: "hourly" | "monthly" | "annual";
  description: string;
  startDate?: string;
  priority: string;
}

export interface DiscoveredJob {
  id: string;
  companyId: string;
  source: "linkedin" | "indeed";
  externalId: string;
  title: string;
  description: string;
  descriptionHtml: string;
  location: string;
  employmentType: string;
  salary: string;
  postedAt: string;
  url: string;
  importedAsRequirementId: string | null;
  discoveredAt: string;
}

export interface DiscoverJobsResponse {
  jobs: DiscoveredJob[];
  linkedinCompanyUrl: string | null;
  lastDiscoveredAt: string | null;
  cached: boolean;
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

export async function fetchCompanyTimeEntries(
  token: string | null,
  params?: { status?: string; period?: string; engagementId?: string },
): Promise<CompanyTimeEntryFull[]> {
  if (!token) return [];

  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set("status", params.status);
  if (params?.period) searchParams.set("period", params.period);
  if (params?.engagementId) searchParams.set("engagementId", params.engagementId);

  const qs = searchParams.toString();
  const url = `${apiBaseUrl}/api/companies/time-entries${qs ? `?${qs}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) return [];
  return (await response.json()) as CompanyTimeEntryFull[];
}

export async function approveCompanyTimeEntry(
  token: string | null,
  id: string,
): Promise<CompanyTimeEntryFull | null> {
  if (!token) return null;

  const response = await fetch(
    `${apiBaseUrl}/api/companies/time-entries/${id}/approve`,
    {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Failed to approve time entry");
  }

  return (await response.json()) as CompanyTimeEntryFull;
}

export async function rejectCompanyTimeEntry(
  token: string | null,
  id: string,
): Promise<CompanyTimeEntryFull | null> {
  if (!token) return null;

  const response = await fetch(
    `${apiBaseUrl}/api/companies/time-entries/${id}/reject`,
    {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Failed to reject time entry");
  }

  return (await response.json()) as CompanyTimeEntryFull;
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
        cache: "no-store",
      },
    );

    if (!response.ok) throw new Error("API error");
    const data = (await response.json()) as JobRequirement[];
    return data.map(normalizeRequirement);
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
        cache: "no-store",
      },
    );

    if (!response.ok) throw new Error("API error");
    return normalizeRequirement((await response.json()) as JobRequirement);
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

  return normalizeRequirement((await response.json()) as JobRequirement);
}

export async function updateJobRequirement(
  token: string | null,
  requirementId: string,
  payload: Partial<CreateJobRequirementPayload>,
): Promise<JobRequirement> {
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(
    `${apiBaseUrl}/api/companies/requirements/${requirementId}`,
    {
      method: "PATCH",
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
    throw new Error(body.message || "Failed to update requirement");
  }

  return normalizeRequirement((await response.json()) as JobRequirement);
}

export async function updateRequirementStatus(
  token: string | null,
  requirementId: string,
  status: RequirementStatus,
): Promise<JobRequirement> {
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(
    `${apiBaseUrl}/api/companies/requirements/${requirementId}/status`,
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

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Failed to update requirement status");
  }

  return normalizeRequirement((await response.json()) as JobRequirement);
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

export async function inviteCompanyTeamMember(
  token: string | null,
  payload: { email: string; name: string; role: string; phone?: string; title?: string },
): Promise<TeamMember> {
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(
    `${apiBaseUrl}/api/companies/team/invite`,
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
    throw new Error(body.message || "Failed to invite team member");
  }

  return (await response.json()) as TeamMember;
}

export async function removeCompanyTeamMember(
  token: string | null,
  memberId: string,
): Promise<boolean> {
  if (!token) return false;

  const response = await fetch(
    `${apiBaseUrl}/api/companies/team/${memberId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );

  return response.ok;
}

export async function updateCompanyTeamMember(
  token: string | null,
  memberId: string,
  payload: { name?: string; email?: string; phone?: string; title?: string; role?: string },
): Promise<TeamMember> {
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(
    `${apiBaseUrl}/api/companies/team/${memberId}`,
    {
      method: "PATCH",
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
    throw new Error(body.message || "Failed to update team member");
  }

  return (await response.json()) as TeamMember;
}

export async function uploadTeamMemberAvatar(
  token: string | null,
  memberId: string,
  file: File,
): Promise<string> {
  if (!token) throw new Error("Not authenticated");

  const formData = new FormData();
  formData.append("avatar", file);

  const response = await fetch(
    `${apiBaseUrl}/api/companies/team/${memberId}/avatar`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Failed to upload avatar");
  }

  const data = (await response.json()) as { avatar: string };
  return data.avatar;
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
  data: {
    title: string;
    description: string;
    descriptionHtml?: string;
    location?: string;
    employmentType?: string;
  },
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

// ── Discover Jobs API functions ──────────────────────────────────────────────

export async function updateCompanyProfile(
  token: string | null,
  payload: Partial<Pick<CompanyProfileSummary, "companyName" | "contactName" | "email" | "phone" | "website" | "linkedinCompanyUrl" | "location" | "logoUrl">>,
): Promise<CompanyProfileSummary> {
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(
    `${apiBaseUrl}/api/companies/profile`,
    {
      method: "PATCH",
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
    throw new Error(body.message || "Failed to update profile");
  }

  return (await response.json()) as CompanyProfileSummary;
}

export async function uploadCompanyLogo(
  token: string | null,
  file: File,
): Promise<{ logoUrl: string }> {
  if (!token) throw new Error("Not authenticated");

  const formData = new FormData();
  formData.append("logo", file);

  const response = await fetch(
    `${apiBaseUrl}/api/companies/profile/logo`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Failed to upload logo");
  }

  return (await response.json()) as { logoUrl: string };
}

export async function getDiscoveredJobs(
  token: string | null,
): Promise<DiscoverJobsResponse> {
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(
    `${apiBaseUrl}/api/companies/discover-jobs`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Failed to fetch discovered jobs");
  }

  return (await response.json()) as DiscoverJobsResponse;
}

export async function discoverJobs(
  token: string | null,
  payload: { linkedinCompanyUrl?: string; companyName?: string; force?: boolean },
): Promise<DiscoverJobsResponse> {
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(
    `${apiBaseUrl}/api/companies/discover-jobs`,
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
    throw new Error(body.message || "Failed to discover jobs");
  }

  return (await response.json()) as DiscoverJobsResponse;
}

export async function parseDiscoveredJobs(
  token: string | null,
  jobIds: string[],
): Promise<Array<{ discoveredJobId: string; parsed: ParsedJobData }>> {
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(
    `${apiBaseUrl}/api/companies/discover-jobs/parse`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jobIds }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Failed to parse discovered jobs");
  }

  return (await response.json()) as Array<{ discoveredJobId: string; parsed: ParsedJobData }>;
}

export async function importDiscoveredJobs(
  token: string | null,
  jobs: Array<{
    discoveredJobId: string;
    title: string;
    techStack: string[];
    experienceYearsMin?: number;
    experienceYearsMax?: number;
    experienceLevel?: string;
    developersNeeded?: number;
    engagementType: string;
    timezonePreference?: string;
    hiringCountries?: string[];
    budgetMin?: number;
    budgetMax?: number;
    budgetType?: "hourly" | "monthly" | "annual";
    description: string;
    startDate?: string;
    priority?: string;
  }>,
): Promise<JobRequirement[]> {
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(
    `${apiBaseUrl}/api/companies/discover-jobs/import`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jobs }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Failed to import jobs");
  }

  const data = (await response.json()) as JobRequirement[];
  return data.map(normalizeRequirement);
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
    const data = (await response.json()) as CompanyProfile;
    if (data.requirements) {
      data.requirements = data.requirements.map(normalizeRequirement);
    }
    return data;
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
        cache: "no-store",
      },
    );

    if (!response.ok) throw new Error("API error");
    const data = await response.json();
    // Admin endpoint wraps in { requirement: { ... } } and returns cents
    const raw = data.requirement ?? data;
    const req: JobRequirement = {
      ...raw,
      budgetMin: raw.budgetMin ?? (raw.budgetMinCents ? raw.budgetMinCents / 100 : undefined),
      budgetMax: raw.budgetMax ?? (raw.budgetMaxCents ? raw.budgetMaxCents / 100 : undefined),
    };
    return normalizeRequirement(req);
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

// ── Browse Developers ─────────────────────────────────────────────────────────

export interface BrowseDevelopersParams {
  page?: number;
  limit?: number;
  search?: string;
  stack?: string;
  experience?: string;
  availability?: string;
}

export interface BrowseDeveloper {
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
  availability: string | null;
  engagementType: string[];
}

export interface BrowseDevelopersResponse {
  developers: BrowseDeveloper[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function browseCompanyDevelopers(
  token: string | null,
  params: BrowseDevelopersParams = {},
): Promise<BrowseDevelopersResponse> {
  if (!token) return { developers: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } };

  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.stack) query.set("stack", params.stack);
  if (params.experience) query.set("experience", params.experience);
  if (params.availability) query.set("availability", params.availability);

  const qs = query.toString();
  const url = `${apiBaseUrl}/api/companies/developers${qs ? `?${qs}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) {
    return { developers: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } };
  }

  return (await response.json()) as BrowseDevelopersResponse;
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
  developerId: string | null;
  developerName: string | null;
  developerRole: string | null;
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

// ── Interview API Functions ─────────────────────────────────────────────────

export async function fetchAvailableSlots(
  token: string | null,
  matchId: string,
  params?: { companyTimezone?: string; durationMinutes?: number; weeksAhead?: number },
): Promise<AvailableSlotsResponse | null> {
  if (!token) return null;

  try {
    const sp = new URLSearchParams();
    if (params?.companyTimezone) sp.set("companyTimezone", params.companyTimezone);
    if (params?.durationMinutes) sp.set("durationMinutes", String(params.durationMinutes));
    if (params?.weeksAhead) sp.set("weeksAhead", String(params.weeksAhead));
    const qs = sp.toString();

    const response = await fetch(
      `${apiBaseUrl}/api/companies/matches/${matchId}/available-slots${qs ? `?${qs}` : ""}`,
      { method: "GET", headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
    );
    if (!response.ok) return null;
    return (await response.json()) as AvailableSlotsResponse;
  } catch {
    return null;
  }
}

export async function requestInterview(
  token: string | null,
  matchId: string,
  data: {
    proposedSlots: Array<{ start: string; end: string }>;
    durationMinutes?: number;
    type?: string;
    companyTimezone?: string;
    meetingLink?: string;
    location?: string;
  },
): Promise<CompanyInterview | null> {
  if (!token) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/companies/matches/${matchId}/request-interview`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(data),
        cache: "no-store",
      },
    );
    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.message ?? "Failed to request interview");
    }
    return (await response.json()) as CompanyInterview;
  } catch (error) {
    throw error;
  }
}

export async function fetchCompanyInterviews(
  token: string | null,
): Promise<CompanyInterview[] | null> {
  if (!token) return null;

  try {
    const response = await fetch(`${apiBaseUrl}/api/companies/interviews`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    return (await response.json()) as CompanyInterview[];
  } catch {
    return null;
  }
}

export async function fetchCompanyInterview(
  token: string | null,
  interviewId: string,
): Promise<CompanyInterview | null> {
  if (!token) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/companies/interviews/${interviewId}`,
      { method: "GET", headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
    );
    if (!response.ok) return null;
    return (await response.json()) as CompanyInterview;
  } catch {
    return null;
  }
}

export async function updateCompanyInterview(
  token: string | null,
  interviewId: string,
  data: {
    meetingLink?: string;
    companyNotes?: string;
    companyRating?: number;
    acceptAlternativeSlot?: string;
  },
): Promise<CompanyInterview | null> {
  if (!token) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/companies/interviews/${interviewId}`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(data),
        cache: "no-store",
      },
    );
    if (!response.ok) return null;
    return (await response.json()) as CompanyInterview;
  } catch {
    return null;
  }
}

export async function completeInterview(
  token: string | null,
  interviewId: string,
  data: { outcome: "passed" | "failed" | "undecided"; companyNotes?: string; companyRating?: number },
): Promise<CompanyInterview | null> {
  if (!token) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/companies/interviews/${interviewId}/complete`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(data),
        cache: "no-store",
      },
    );
    if (!response.ok) return null;
    return (await response.json()) as CompanyInterview;
  } catch {
    return null;
  }
}

// ── Calendar Integration ────────────────────────────────────────────────────

export interface CalendarConnection {
  connected: boolean;
  id?: string;
  provider?: "google" | "microsoft";
  email?: string;
  status?: string;
}

export interface CalendarBusyBlock {
  startTime: string;
  endTime: string;
}

export interface CompanyAvailabilitySlot {
  id: string;
  companyId: string;
  startTime: string;
  endTime: string;
  timezone: string;
  recurring: boolean;
  dayOfWeek?: number | null;
  recurringStartTime?: string | null;
  recurringEndTime?: string | null;
}

export interface CalendarInterview {
  id: string;
  title: string;
  requirementTitle: string;
  startTime: string;
  endTime: string;
  status: string;
  meetingLink?: string | null;
}

export async function fetchCalendarStatus(
  token: string | null,
): Promise<CalendarConnection> {
  if (!token) return { connected: false };
  try {
    const res = await fetch(`${apiBaseUrl}/api/companies/calendar/status`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return { connected: false };
    return (await res.json()) as CalendarConnection;
  } catch {
    return { connected: false };
  }
}

export async function startCalendarConnect(
  token: string | null,
  provider: "google" | "microsoft" = "google",
): Promise<{ authUrl: string } | null> {
  if (!token) return null;
  try {
    const res = await fetch(`${apiBaseUrl}/api/companies/calendar/connect?provider=${provider}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as { authUrl: string };
  } catch {
    return null;
  }
}

export async function disconnectCalendar(
  token: string | null,
): Promise<boolean> {
  if (!token) return false;
  try {
    const res = await fetch(`${apiBaseUrl}/api/companies/calendar/connection`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchCalendarAvailability(
  token: string | null,
  start: string,
  end: string,
): Promise<CalendarBusyBlock[]> {
  if (!token) return [];
  try {
    const res = await fetch(
      `${apiBaseUrl}/api/companies/calendar/availability?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`,
      { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as { busyBlocks: CalendarBusyBlock[] };
    return data.busyBlocks;
  } catch {
    return [];
  }
}

export async function fetchCompanySlots(
  token: string | null,
): Promise<CompanyAvailabilitySlot[]> {
  if (!token) return [];
  try {
    const res = await fetch(`${apiBaseUrl}/api/companies/calendar/slots`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json()) as CompanyAvailabilitySlot[];
  } catch {
    return [];
  }
}

export async function createCompanySlot(
  token: string | null,
  slot: { startTime: string; endTime: string; timezone: string; recurring?: boolean; dayOfWeek?: number },
): Promise<CompanyAvailabilitySlot | null> {
  if (!token) return null;
  try {
    const res = await fetch(`${apiBaseUrl}/api/companies/calendar/slots`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(slot),
    });
    if (!res.ok) return null;
    return (await res.json()) as CompanyAvailabilitySlot;
  } catch {
    return null;
  }
}

export async function deleteCompanySlot(
  token: string | null,
  slotId: string,
): Promise<boolean> {
  if (!token) return false;
  try {
    const res = await fetch(`${apiBaseUrl}/api/companies/calendar/slots/${slotId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchCalendarInterviews(
  token: string | null,
  start: string,
  end: string,
): Promise<CalendarInterview[]> {
  if (!token) return [];
  try {
    const res = await fetch(
      `${apiBaseUrl}/api/companies/calendar/interviews?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`,
      { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
    );
    if (!res.ok) return [];
    return (await res.json()) as CalendarInterview[];
  } catch {
    return [];
  }
}
