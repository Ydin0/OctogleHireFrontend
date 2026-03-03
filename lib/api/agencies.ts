const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

// ── Types ────────────────────────────────────────────────────────────────────

export interface Agency {
  id: string;
  clerkOrgId: string | null;
  name: string;
  contactName: string;
  email: string;
  phone: string | null;
  website: string | null;
  location: string | null;
  logo: string | null;
  referralCode: string;
  commissionRate: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgencyCandidate {
  id: string;
  fullName: string | null;
  email: string;
  professionalTitle: string | null;
  locationCity: string | null;
  locationState: string | null;
  yearsOfExperience: number | null;
  primaryStack: string[] | null;
  status: string;
  source: string;
  profilePhotoPath: string | null;
  availability: string | null;
  engagementType: string[] | null;
  submittedAt: string | null;
  createdAt: string;
}

export interface AgencyRequirement {
  id: string;
  title: string;
  techStack: string[];
  experienceLevel: string;
  developersNeeded: number;
  engagementType: string;
  timezonePreference: string;
  budgetMinCents: number | null;
  budgetMaxCents: number | null;
  description: string;
  startDate: string | null;
  priority: string;
  status: string;
  companyName: string | null;
  createdAt: string;
}

export interface AgencyCommission {
  id: string;
  engagementId: string;
  applicationId: string;
  commissionRate: number;
  status: string;
  totalEarnedCents: number;
  paidAmountCents: number;
  currency: string;
  createdAt: string;
  developerName: string | null;
  companyName: string | null;
}

export interface AgencyCommissionSummary {
  totalEarnedCents: number;
  totalPaidCents: number;
  totalPendingCents: number;
  totalCommissions: number;
}

export interface AgencyStats {
  candidatesSubmitted: number;
  candidatesPlaced: number;
  conversionRate: number;
}

export interface AgencyReferralLink {
  referralCode: string;
  referralUrl: string;
}

export interface AgencyTeamMember {
  id: string;
  userId: string;
  role: string;
  name: string;
  email: string | null;
  avatar: string | null;
  joinedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ── API Functions ────────────────────────────────────────────────────────────

export async function fetchAgencyProfile(
  token: string | null
): Promise<Agency | null> {
  if (!token) return null;
  try {
    const response = await fetch(`${apiBaseUrl}/api/agencies/profile`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    return (await response.json()) as Agency;
  } catch {
    return null;
  }
}

export async function updateAgencyProfile(
  token: string | null,
  payload: Partial<Pick<Agency, "name" | "contactName" | "email" | "phone" | "website" | "location">>
): Promise<Agency | null> {
  if (!token) return null;
  try {
    const response = await fetch(`${apiBaseUrl}/api/agencies/profile`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as Agency;
  } catch {
    return null;
  }
}

export async function fetchAgencyTeam(
  token: string | null
): Promise<AgencyTeamMember[] | null> {
  if (!token) return null;
  try {
    const response = await fetch(`${apiBaseUrl}/api/agencies/team`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    return (await response.json()) as AgencyTeamMember[];
  } catch {
    return null;
  }
}

export async function fetchAgencyCandidates(
  token: string | null,
  params: { page?: number; limit?: number } = {}
): Promise<{ candidates: AgencyCandidate[]; pagination: Pagination } | null> {
  if (!token) return null;
  try {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    const qs = searchParams.toString();

    const response = await fetch(
      `${apiBaseUrl}/api/agencies/candidates${qs ? `?${qs}` : ""}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 30 },
      }
    );
    if (!response.ok) return null;
    return (await response.json()) as {
      candidates: AgencyCandidate[];
      pagination: Pagination;
    };
  } catch {
    return null;
  }
}

export async function fetchAgencyCandidate(
  token: string | null,
  id: string
): Promise<AgencyCandidate | null> {
  if (!token) return null;
  try {
    const response = await fetch(`${apiBaseUrl}/api/agencies/candidates/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as AgencyCandidate;
  } catch {
    return null;
  }
}

export async function fetchAgencyRequirements(
  token: string | null
): Promise<AgencyRequirement[] | null> {
  if (!token) return null;
  try {
    const response = await fetch(`${apiBaseUrl}/api/agencies/requirements`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 30 },
    });
    if (!response.ok) return null;
    return (await response.json()) as AgencyRequirement[];
  } catch {
    return null;
  }
}

export async function fetchAgencyCommissions(
  token: string | null
): Promise<AgencyCommission[] | null> {
  if (!token) return null;
  try {
    const response = await fetch(`${apiBaseUrl}/api/agencies/commissions`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as AgencyCommission[];
  } catch {
    return null;
  }
}

export async function fetchAgencyCommissionSummary(
  token: string | null
): Promise<AgencyCommissionSummary | null> {
  if (!token) return null;
  try {
    const response = await fetch(
      `${apiBaseUrl}/api/agencies/commissions/summary`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );
    if (!response.ok) return null;
    return (await response.json()) as AgencyCommissionSummary;
  } catch {
    return null;
  }
}

export async function fetchAgencyStats(
  token: string | null
): Promise<AgencyStats | null> {
  if (!token) return null;
  try {
    const response = await fetch(`${apiBaseUrl}/api/agencies/stats`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 30 },
    });
    if (!response.ok) return null;
    return (await response.json()) as AgencyStats;
  } catch {
    return null;
  }
}

export async function fetchAgencyReferralLink(
  token: string | null
): Promise<AgencyReferralLink | null> {
  if (!token) return null;
  try {
    const response = await fetch(`${apiBaseUrl}/api/agencies/referral-link`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as AgencyReferralLink;
  } catch {
    return null;
  }
}

// ── Pitch Types ─────────────────────────────────────────────────────────────

export interface AgencyPitchDeveloper {
  id: string;
  name: string | null;
  title: string | null;
  avatar: string | null;
  skills?: string[] | null;
  yearsOfExperience?: number | null;
  location?: string;
}

export interface AgencyPitch {
  id: string;
  requirementId: string;
  developerId: string;
  pitchedHourlyRate: number;
  pitchedMonthlyRate: number;
  currency: string;
  pitchedCommissionRate: number;
  workingDaysPerMonth: number;
  hoursPerDay: number;
  coverNote: string | null;
  status: "pending" | "approved" | "rejected";
  adminNote: string | null;
  proposedMatchId: string | null;
  createdAt: string;
  requirementTitle?: string;
  companyName?: string;
  developer: AgencyPitchDeveloper;
}

export interface AgencyRequirementDetail extends AgencyRequirement {
  experienceYearsMin: number | null;
  experienceYearsMax: number | null;
  updatedAt: string;
  pitches: AgencyPitch[];
}

export interface AgencyPoolCandidate {
  id: string;
  fullName: string | null;
  email: string;
  professionalTitle: string | null;
  locationCity: string | null;
  locationState: string | null;
  yearsOfExperience: number | null;
  primaryStack: string[] | null;
  status: string;
  availability: string | null;
  engagementType: string[] | null;
  hourlyRate: number | null;
  monthlyRate: number | null;
  hourlyRateCents: number | null;
  monthlyRateCents: number | null;
  salaryCurrency: string | null;
  profilePhotoPath: string | null;
  bio: string | null;
  location: string;
}

export interface AdminAgencyPitch extends AgencyPitch {
  agencyId: string;
  agencyName: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
}

// ── Pitch API Functions ─────────────────────────────────────────────────────

export async function fetchAgencyRequirementDetail(
  token: string | null,
  reqId: string
): Promise<AgencyRequirementDetail | null> {
  if (!token) return null;
  try {
    const response = await fetch(
      `${apiBaseUrl}/api/agencies/requirements/${reqId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );
    if (!response.ok) return null;
    return (await response.json()) as AgencyRequirementDetail;
  } catch {
    return null;
  }
}

export async function fetchAgencyCandidatePool(
  token: string | null
): Promise<AgencyPoolCandidate[] | null> {
  if (!token) return null;
  try {
    const response = await fetch(
      `${apiBaseUrl}/api/agencies/candidates/pool`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );
    if (!response.ok) return null;
    return (await response.json()) as AgencyPoolCandidate[];
  } catch {
    return null;
  }
}

export async function submitAgencyPitches(
  token: string | null,
  reqId: string,
  pitches: Array<{
    developerId: string;
    hourlyRate: number;
    monthlyRate: number;
    currency?: string;
    commissionRate: number;
    workingDaysPerMonth?: number;
    hoursPerDay?: number;
    coverNote?: string;
  }>
): Promise<{ created: number; skipped: number } | null> {
  if (!token) return null;
  try {
    const response = await fetch(
      `${apiBaseUrl}/api/agencies/requirements/${reqId}/pitches`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pitches }),
        cache: "no-store",
      }
    );
    if (!response.ok) return null;
    return (await response.json()) as { created: number; skipped: number };
  } catch {
    return null;
  }
}

export async function fetchAgencyPitches(
  token: string | null,
  params: { status?: string } = {}
): Promise<AgencyPitch[] | null> {
  if (!token) return null;
  try {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.set("status", params.status);
    const qs = searchParams.toString();

    const response = await fetch(
      `${apiBaseUrl}/api/agencies/pitches${qs ? `?${qs}` : ""}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );
    if (!response.ok) return null;
    return (await response.json()) as AgencyPitch[];
  } catch {
    return null;
  }
}

export async function addAgencyCandidate(
  token: string | null,
  payload: {
    fullName?: string;
    email: string;
    professionalTitle?: string;
    primaryStack?: string[];
    yearsOfExperience?: number;
    locationCity?: string;
    locationState?: string;
    availability?: string;
    engagementType?: string[];
    hourlyRate?: number;
    monthlyRate?: number;
    salaryCurrency?: string;
  }
): Promise<Record<string, unknown> | null> {
  if (!token) return null;
  try {
    const response = await fetch(`${apiBaseUrl}/api/agencies/candidates`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

// ── Admin Agency Pitch API Functions ────────────────────────────────────────

export async function fetchAdminAgencyPitches(
  token: string | null,
  params: { status?: string } = {}
): Promise<AdminAgencyPitch[] | null> {
  if (!token) return null;
  try {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.set("status", params.status);
    const qs = searchParams.toString();

    const response = await fetch(
      `${apiBaseUrl}/api/admin/agency-pitches${qs ? `?${qs}` : ""}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );
    if (!response.ok) return null;
    return (await response.json()) as AdminAgencyPitch[];
  } catch {
    return null;
  }
}

export async function reviewAdminAgencyPitch(
  token: string | null,
  pitchId: string,
  payload: { action: "approve" | "reject"; adminNote?: string }
): Promise<Record<string, unknown> | null> {
  if (!token) return null;
  try {
    const response = await fetch(
      `${apiBaseUrl}/api/admin/agency-pitches/${pitchId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      }
    );
    if (!response.ok) return null;
    return (await response.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

// ── Admin Agency API Functions ───────────────────────────────────────────────

export async function fetchAdminAgencies(
  token: string | null
): Promise<Agency[] | null> {
  if (!token) return null;
  try {
    const response = await fetch(`${apiBaseUrl}/api/admin/agencies`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 30 },
    });
    if (!response.ok) return null;
    return (await response.json()) as Agency[];
  } catch {
    return null;
  }
}

export async function fetchAdminAgency(
  token: string | null,
  id: string
): Promise<Agency | null> {
  if (!token) return null;
  try {
    const response = await fetch(`${apiBaseUrl}/api/admin/agencies/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as Agency;
  } catch {
    return null;
  }
}

export async function createAdminAgency(
  token: string | null,
  payload: {
    name: string;
    contactName: string;
    email: string;
    phone?: string;
    website?: string;
    location?: string;
    clerkOrgId?: string;
    commissionRate?: number;
    status?: string;
  }
): Promise<Agency | null> {
  if (!token) return null;
  try {
    const response = await fetch(`${apiBaseUrl}/api/admin/agencies`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as Agency;
  } catch {
    return null;
  }
}

export async function updateAdminAgency(
  token: string | null,
  id: string,
  payload: Partial<Agency>
): Promise<Agency | null> {
  if (!token) return null;
  try {
    const response = await fetch(`${apiBaseUrl}/api/admin/agencies/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as Agency;
  } catch {
    return null;
  }
}

export async function fetchAdminAgencyCandidates(
  token: string | null,
  agencyId: string
): Promise<AgencyCandidate[] | null> {
  if (!token) return null;
  try {
    const response = await fetch(
      `${apiBaseUrl}/api/admin/agencies/${agencyId}/candidates`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );
    if (!response.ok) return null;
    return (await response.json()) as AgencyCandidate[];
  } catch {
    return null;
  }
}

export async function fetchAdminAgencyCommissions(
  token: string | null,
  agencyId: string
): Promise<AgencyCommission[] | null> {
  if (!token) return null;
  try {
    const response = await fetch(
      `${apiBaseUrl}/api/admin/agencies/${agencyId}/commissions`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );
    if (!response.ok) return null;
    return (await response.json()) as AgencyCommission[];
  } catch {
    return null;
  }
}

// ── Agency Enquiry Types ───────────────────────────────────────────────────

export interface AgencyEnquiry {
  id: string;
  contactName: string;
  agencyName: string;
  email: string;
  phone: string;
  website: string | null;
  teamSize: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// ── Admin Agency Enquiry API Functions ─────────────────────────────────────

export async function fetchAdminAgencyEnquiries(
  token: string | null
): Promise<AgencyEnquiry[] | null> {
  if (!token) return null;
  try {
    const response = await fetch(
      `${apiBaseUrl}/api/admin/agency-enquiries`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );
    if (!response.ok) return null;
    return (await response.json()) as AgencyEnquiry[];
  } catch {
    return null;
  }
}

export async function updateAdminAgencyEnquiry(
  token: string | null,
  id: string,
  payload: { status: string }
): Promise<AgencyEnquiry | null> {
  if (!token) return null;
  try {
    const response = await fetch(
      `${apiBaseUrl}/api/admin/agency-enquiries/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      }
    );
    if (!response.ok) return null;
    return (await response.json()) as AgencyEnquiry;
  } catch {
    return null;
  }
}

export async function convertAgencyEnquiry(
  token: string | null,
  id: string
): Promise<Agency | null> {
  if (!token) return null;
  try {
    const response = await fetch(
      `${apiBaseUrl}/api/admin/agency-enquiries/${id}/convert`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );
    if (!response.ok) return null;
    return (await response.json()) as Agency;
  } catch {
    return null;
  }
}

export async function markCommissionPaid(
  token: string | null,
  agencyId: string,
  commissionId: string
): Promise<AgencyCommission | null> {
  if (!token) return null;
  try {
    const response = await fetch(
      `${apiBaseUrl}/api/admin/agencies/${agencyId}/commissions/${commissionId}/pay`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );
    if (!response.ok) return null;
    return (await response.json()) as AgencyCommission;
  } catch {
    return null;
  }
}
