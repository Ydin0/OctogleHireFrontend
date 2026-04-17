import { fetchWithRetry } from "./fetch-with-retry";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

// ── Types ────────────────────────────────────────────────────────────────────

export interface AdminApplication {
  id: string;
  fullName: string | null;
  email: string;
  professionalTitle: string | null;
  professionalCategory: string | null;
  locationCity: string | null;
  locationState: string | null;
  yearsOfExperience: number | null;
  primaryStack: string[] | null;
  status: string;
  isLive: boolean;
  isFeatured: boolean;
  submittedAt: string | null;
  profilePhotoPath: string | null;
  salaryAmount: number | null;
  salaryCurrency: string | null;
  flowmingoStatus: string | null;
  flowmingoScore: string | null;
  flowmingoSubmissionUrl: string | null;
  source: string;
  agencyId: string | null;
  agencyName: string | null;
  agencyLogo: string | null;
}

export interface AdminApplicationFull {
  id: string;
  clerkUserId: string | null;
  status: string;
  canonicalEmail: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  locationCity: string | null;
  locationState: string | null;
  professionalTitle: string | null;
  professionalCategory: string | null;
  yearsOfExperience: number | null;
  bio: string | null;
  primaryStack: string[] | null;
  secondarySkills: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  resumePath: string | null;
  resumeOriginalName: string | null;
  profilePhotoPath: string | null;
  engagementType: string[] | null;
  availability: string | null;
  englishProficiency: string | null;
  workExperience: { company: string; title: string; startDate: string; endDate: string | null; current: boolean; description: string; companyLogoUrl?: string }[] | null;
  education: { institution: string; degree: string; grade?: string; startYear?: string; endYear?: string; institutionLogoUrl?: string }[] | null;
  certifications: string | null;
  salaryCurrency: string | null;
  salaryAmount: number | null;
  isLive: boolean;
  isFeatured: boolean;
  slug: string | null;
  hourlyRateCents: number | null;
  monthlyRateCents: number | null;
  marketplaceRating: string | null;
  marketplaceProjects: number | null;
  marketplaceAchievements: string[] | null;
  marketplaceAwards: { title: string; issuer: string; year: string }[] | null;
  aboutLong: string | null;
  offer: ApplicationOffer | null;
  introVideoPath: string | null;
  introVideoOriginalName: string | null;
  flowmingoStatus: string | null;
  flowmingoScore: string | null;
  flowmingoSubmissionUrl: string | null;
  agencyId: string | null;
  agencyName: string | null;
  referralCode: string | null;
  source: string;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationOffer {
  id: string;
  hourlyRateCents: number;
  monthlyRateCents: number;
  currency: string;
  engagementType: string;
  startDate: string;
  contractUrl: string | null;
  status: "pending" | "accepted" | "declined";
  developerSignature: string | null;
  respondedAt: string | null;
  createdAt: string;
}

export interface ApplicationNote {
  id: string;
  applicationId: string;
  stage: string;
  content: string;
  authorClerkUserId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FetchApplicationsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  isLive?: string;
  sortBy?: string;
  sortOrder?: string;
  professionalTitle?: string;
  professionalCategory?: string;
  stack?: string;
  location?: string;
  expMin?: string;
  expMax?: string;
  engagementType?: string;
  availability?: string;
  agency?: string;
}

export interface FilterOptions {
  professionalTitles: string[];
  professionalCategories: string[];
  techStacks: string[];
  locations: string[];
  engagementTypes: string[];
  availabilities: string[];
  agencies: { id: string; name: string }[];
}

export interface ScoringCategory {
  name: string;
  score: number;
  maxScore: number;
  notes: string;
}

export interface InterviewScoring {
  categories: ScoringCategory[];
  overallScore: number;
  overallNotes: string;
}

export interface AdminInterview {
  id: string;
  matchId: string | null;
  applicationId: string | null;
  source: "pipeline" | "company_request";
  companyId: string | null;
  companyName: string | null;
  developerId: string;
  developerName: string;
  developerEmail: string;
  developerRole: string;
  developerAvatar: string;
  requirementTitle: string | null;
  scheduledAt: string | null;
  durationMinutes: number;
  type: "video" | "phone" | "in_person";
  meetingLink: string | null;
  location: string | null;
  status: string;
  outcome: string | null;
  proposedSlots: Array<{ start: string; end: string }> | null;
  selectedSlot: string | null;
  alternativeSlots: Array<{ start: string; end: string }> | null;
  adminHostId: string | null;
  adminHostName: string | null;
  adminNotes: string | null;
  companyNotes: string | null;
  companyRating: number | null;
  transcriptPath: string | null;
  transcriptOriginalName: string | null;
  transcriptUrl: string | null;
  scoring: InterviewScoring | null;
  createdAt: string;
}

export interface AdminTeamMember {
  clerkUserId: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  phone: string | null;
  profilePhotoUrl: string | null;
  isSuperAdmin: boolean;
  createdAt: string;
}

export interface AdminStats {
  total: number;
  liveCount: number;
  featuredCount: number;
  byStatus: Record<string, number>;
  companyCount: number;
  agencyCount: number;
  activeRequirementCount: number;
  engagementCount: number;
  enquiryCount: number;
}

export interface SendOfferPayload {
  hourlyRateCents: number;
  monthlyRateCents: number;
  currency: string;
  engagementType: string;
  startDate: string;
  contractFile?: File;
}

// ── API Functions ────────────────────────────────────────────────────────────

export async function fetchApplications(
  token: string | null,
  params: FetchApplicationsParams = {}
): Promise<{ applications: AdminApplication[]; pagination: Pagination } | null> {
  if (!token) return null;

  try {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.search) searchParams.set("search", params.search);
    if (params.status) searchParams.set("status", params.status);
    if (params.isLive) searchParams.set("isLive", params.isLive);
    if (params.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);
    if (params.professionalTitle) searchParams.set("professionalTitle", params.professionalTitle);
    if (params.professionalCategory) searchParams.set("professionalCategory", params.professionalCategory);
    if (params.stack) searchParams.set("stack", params.stack);
    if (params.location) searchParams.set("location", params.location);
    if (params.expMin) searchParams.set("expMin", params.expMin);
    if (params.expMax) searchParams.set("expMax", params.expMax);
    if (params.engagementType) searchParams.set("engagementType", params.engagementType);
    if (params.availability) searchParams.set("availability", params.availability);
    if (params.agency) searchParams.set("agency", params.agency);

    const qs = searchParams.toString();
    const url = `${apiBaseUrl}/api/admin/applications${qs ? `?${qs}` : ""}`;

    const response = await fetchWithRetry(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!response.ok) return null;
    return (await response.json()) as {
      applications: AdminApplication[];
      pagination: Pagination;
    };
  } catch {
    return null;
  }
}

export async function fetchFilterOptions(
  token: string | null
): Promise<FilterOptions | null> {
  if (!token) return null;

  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/applications/filter-options`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );

    if (!response.ok) return null;
    return (await response.json()) as FilterOptions;
  } catch {
    return null;
  }
}

export async function fetchApplication(
  token: string | null,
  id: string
): Promise<{ application: AdminApplicationFull; notes: ApplicationNote[] } | null> {
  if (!token) return null;

  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/applications/${id}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );

    if (!response.ok) return null;
    return (await response.json()) as {
      application: AdminApplicationFull;
      notes: ApplicationNote[];
    };
  } catch {
    return null;
  }
}

export async function updateApplicationStatus(
  token: string | null,
  id: string,
  status: string,
  note?: string
): Promise<{ application: AdminApplicationFull } | null> {
  if (!token) return null;

  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/applications/${id}/status`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, note }),
        cache: "no-store",
      }
    );

    if (!response.ok) return null;
    return (await response.json()) as { application: AdminApplicationFull };
  } catch {
    return null;
  }
}

export async function toggleApplicationLive(
  token: string | null,
  id: string,
  isLive: boolean
): Promise<{ application: AdminApplicationFull } | null> {
  if (!token) return null;

  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/applications/${id}/live`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isLive }),
        cache: "no-store",
      }
    );

    if (!response.ok) return null;
    return (await response.json()) as { application: AdminApplicationFull };
  } catch {
    return null;
  }
}

export async function createApplicationNote(
  token: string | null,
  id: string,
  content: string,
  stage?: string
): Promise<{ note: ApplicationNote } | null> {
  if (!token) return null;

  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/applications/${id}/notes`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, stage }),
        cache: "no-store",
      }
    );

    if (!response.ok) return null;
    return (await response.json()) as { note: ApplicationNote };
  } catch {
    return null;
  }
}

export async function updateApplicationNote(
  token: string | null,
  applicationId: string,
  noteId: string,
  content: string
): Promise<{ note: ApplicationNote } | null> {
  if (!token) return null;

  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/applications/${applicationId}/notes/${noteId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
        cache: "no-store",
      }
    );

    if (!response.ok) return null;
    return (await response.json()) as { note: ApplicationNote };
  } catch {
    return null;
  }
}

export async function deleteApplicationNote(
  token: string | null,
  applicationId: string,
  noteId: string
): Promise<boolean> {
  if (!token) return false;

  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/applications/${applicationId}/notes/${noteId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );

    return response.ok;
  } catch {
    return false;
  }
}

export async function bulkUpdateApplicationStatus(
  token: string | null,
  ids: string[],
  status: string,
  note?: string
): Promise<{ updated: number } | null> {
  if (!token) return null;

  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/applications/bulk/status`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids, status, note }),
        cache: "no-store",
      }
    );

    if (!response.ok) return null;
    return (await response.json()) as { updated: number };
  } catch {
    return null;
  }
}

export async function exportApplicationsCsv(
  token: string | null,
  params: FetchApplicationsParams = {}
): Promise<Blob | null> {
  if (!token) return null;

  try {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.set("search", params.search);
    if (params.status) searchParams.set("status", params.status);
    if (params.isLive) searchParams.set("isLive", params.isLive);
    if (params.professionalTitle) searchParams.set("professionalTitle", params.professionalTitle);
    if (params.professionalCategory) searchParams.set("professionalCategory", params.professionalCategory);
    if (params.stack) searchParams.set("stack", params.stack);
    if (params.location) searchParams.set("location", params.location);
    if (params.expMin) searchParams.set("expMin", params.expMin);
    if (params.expMax) searchParams.set("expMax", params.expMax);
    if (params.engagementType) searchParams.set("engagementType", params.engagementType);
    if (params.availability) searchParams.set("availability", params.availability);

    const qs = searchParams.toString();
    const url = `${apiBaseUrl}/api/admin/applications/export${qs ? `?${qs}` : ""}`;

    const response = await fetchWithRetry(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) return null;
    return await response.blob();
  } catch {
    return null;
  }
}

export async function toggleApplicationFeatured(
  token: string | null,
  id: string,
  isFeatured: boolean
): Promise<{ application: AdminApplicationFull } | null> {
  if (!token) return null;

  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/applications/${id}/featured`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isFeatured }),
        cache: "no-store",
      }
    );

    if (!response.ok) return null;
    return (await response.json()) as { application: AdminApplicationFull };
  } catch {
    return null;
  }
}

export async function sendOffer(
  token: string | null,
  applicationId: string,
  payload: SendOfferPayload
): Promise<{ offer: ApplicationOffer } | null> {
  if (!token) return null;

  try {
    const formData = new FormData();
    formData.append("hourlyRateCents", String(payload.hourlyRateCents));
    formData.append("monthlyRateCents", String(payload.monthlyRateCents));
    formData.append("currency", payload.currency);
    formData.append("engagementType", payload.engagementType);
    formData.append("startDate", payload.startDate);
    if (payload.contractFile) {
      formData.append("contractFile", payload.contractFile);
    }

    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/applications/${applicationId}/offer`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
        cache: "no-store",
      }
    );

    if (!response.ok) return null;
    return (await response.json()) as { offer: ApplicationOffer };
  } catch {
    return null;
  }
}

export interface ApplicationProfilePayload {
  email?: string;
  fullName?: string;
  phone?: string;
  locationCity?: string;
  locationState?: string;
  professionalTitle?: string;
  yearsOfExperience?: number | null;
  bio?: string;
  primaryStack?: string[];
  secondarySkills?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  engagementType?: string[];
  availability?: string;
  englishProficiency?: string;
  certifications?: string;
}

export async function updateApplicationProfile(
  token: string | null,
  id: string,
  payload: ApplicationProfilePayload
): Promise<{ application: AdminApplicationFull } | null> {
  if (!token) return null;

  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/applications/${id}/profile`,
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
    return (await response.json()) as { application: AdminApplicationFull };
  } catch {
    return null;
  }
}

export interface MarketplaceProfilePayload {
  hourlyRateCents?: number | null;
  monthlyRateCents?: number | null;
  marketplaceRating?: string | null;
  marketplaceProjects?: number | null;
  marketplaceAchievements?: string[] | null;
  marketplaceAwards?: { title: string; issuer: string; year: string }[] | null;
  aboutLong?: string | null;
}

export async function updateMarketplaceProfile(
  token: string | null,
  id: string,
  payload: MarketplaceProfilePayload
): Promise<{ application: AdminApplicationFull } | null> {
  if (!token) return null;

  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/applications/${id}/marketplace-profile`,
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
    return (await response.json()) as { application: AdminApplicationFull };
  } catch {
    return null;
  }
}

export async function fetchAdminStats(
  token: string | null
): Promise<AdminStats | null> {
  if (!token) return null;

  try {
    const response = await fetchWithRetry(`${apiBaseUrl}/api/admin/stats`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!response.ok) return null;
    return (await response.json()) as AdminStats;
  } catch {
    return null;
  }
}

// ── Admin Requirements Types + API ──────────────────────────────────────────

export interface AdminRequirement {
  id: string;
  companyId: string;
  title: string;
  techStack: string[];
  experienceLevel: string;
  developersNeeded: number;
  engagementType: string;
  timezonePreference: string;
  hiringCountries: string[];
  budgetMinCents: number | null;
  budgetMaxCents: number | null;
  description: string;
  startDate: string | null;
  priority: string;
  status: string;
  isFeatured: boolean;
  companyName: string | null;
  companyLogoUrl: string | null;
  accountManagerName: string | null;
  accountManagerImageUrl: string | null;
  accountManagerEmail: string | null;
  proposedMatchCount: number;
  firstMatchAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FetchAdminRequirementsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  isFeatured?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface CreateAdminRequirementPayload {
  companyId: string;
  title: string;
  techStack?: string[];
  experienceLevel?: string;
  experienceYearsMin?: number;
  experienceYearsMax?: number;
  developersNeeded?: number;
  engagementType: string;
  timezonePreference?: string;
  hiringCountries?: string[];
  budgetMin?: number;
  budgetMax?: number;
  budgetType?: string;
  description: string;
  startDate?: string;
  priority?: string;
  status?: string;
}

export async function createAdminRequirement(
  token: string | null,
  payload: CreateAdminRequirementPayload,
): Promise<{ requirement: AdminRequirement }> {
  if (!token) throw new Error("Authentication token missing — please refresh the page");

  const response = await fetchWithRetry(
    `${apiBaseUrl}/api/admin/requirements`,
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
    throw new Error(
      body.message || body.error || `Failed to create requirement (${response.status})`,
    );
  }

  const data = await response.json();
  if (!data.requirement) {
    throw new Error("Unexpected API response — missing requirement in body");
  }
  return data as { requirement: AdminRequirement };
}

export async function notifyNewRequirement(
  token: string | null,
  requirementId: string,
): Promise<void> {
  if (!token) return;

  // Fire-and-forget — don't block the UI if notification fails
  try {
    await fetchWithRetry(
      `${apiBaseUrl}/api/admin/requirements/${requirementId}/notify`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );
  } catch {
    // Silently fail — notification is non-critical
  }
}

export async function fetchAdminRequirements(
  token: string | null,
  params: FetchAdminRequirementsParams = {}
): Promise<{ requirements: AdminRequirement[]; pagination: Pagination } | null> {
  if (!token) return null;

  try {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.search) searchParams.set("search", params.search);
    if (params.status) searchParams.set("status", params.status);
    if (params.isFeatured) searchParams.set("isFeatured", params.isFeatured);
    if (params.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

    const qs = searchParams.toString();
    const url = `${apiBaseUrl}/api/admin/requirements${qs ? `?${qs}` : ""}`;

    const response = await fetchWithRetry(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!response.ok) return null;
    return (await response.json()) as {
      requirements: AdminRequirement[];
      pagination: Pagination;
    };
  } catch {
    return null;
  }
}

export async function fetchAdminRequirement(
  token: string | null,
  id: string
): Promise<{ requirement: AdminRequirement } | null> {
  if (!token) return null;

  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/requirements/${id}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );

    if (!response.ok) return null;
    return (await response.json()) as { requirement: AdminRequirement };
  } catch {
    return null;
  }
}

export async function updateAdminRequirement(
  token: string | null,
  id: string,
  data: Partial<Omit<AdminRequirement, "id" | "companyId" | "companyName" | "companyLogoUrl" | "createdAt" | "updatedAt">>
): Promise<{ requirement: AdminRequirement } | null> {
  if (!token) return null;

  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/requirements/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        cache: "no-store",
      }
    );

    if (!response.ok) return null;
    return (await response.json()) as { requirement: AdminRequirement };
  } catch {
    return null;
  }
}

export async function toggleRequirementFeatured(
  token: string | null,
  id: string,
  isFeatured: boolean
): Promise<{ requirement: AdminRequirement } | null> {
  if (!token) return null;

  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/requirements/${id}/featured`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isFeatured }),
        cache: "no-store",
      }
    );

    if (!response.ok) return null;
    return (await response.json()) as { requirement: AdminRequirement };
  } catch {
    return null;
  }
}

export interface DeleteRequirementResult {
  success: boolean;
  hasReferences?: boolean;
  references?: { engagements: number; interviews: number; matches: number };
}

export async function deleteAdminRequirement(
  token: string | null,
  id: string,
  force = false,
): Promise<DeleteRequirementResult> {
  if (!token) return { success: false };

  try {
    const url = `${apiBaseUrl}/api/admin/requirements/${id}${force ? "?force=true" : ""}`;
    const response = await fetchWithRetry(url, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (response.ok) return { success: true };

    if (response.status === 409) {
      const data = await response.json();
      return {
        success: false,
        hasReferences: true,
        references: data.references,
      };
    }

    return { success: false };
  } catch {
    return { success: false };
  }
}

export async function reofferApplication(
  token: string,
  applicationId: string,
  payload: {
    hourlyRateCents: number;
    monthlyRateCents: number;
    currency: string;
    engagementType: string;
    startDate: string;
    note?: string;
  },
): Promise<void> {
  const response = await fetchWithRetry(
    `${apiBaseUrl}/api/admin/applications/${applicationId}/reoffer`,
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
    const err = await response.json().catch(() => null);
    throw new Error(err?.message ?? "Failed to re-offer");
  }
}

// ── Interviews ──────────────────────────────────────────────────────────────

export async function fetchInterviews(
  token: string | null,
  params: { status?: string; source?: string } = {},
): Promise<AdminInterview[]> {
  if (!token) return [];

  try {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.set("status", params.status);
    if (params.source) searchParams.set("source", params.source);

    const qs = searchParams.toString();
    const url = `${apiBaseUrl}/api/admin/interviews${qs ? `?${qs}` : ""}`;

    const response = await fetchWithRetry(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!response.ok) return [];
    const data = await response.json();
    return data as AdminInterview[];
  } catch {
    return [];
  }
}

export async function fetchPendingApprovalCount(
  token: string | null,
): Promise<number> {
  if (!token) return 0;
  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/matches/awaiting-approval`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );
    if (!response.ok) return 0;
    const data = (await response.json()) as unknown[];
    return Array.isArray(data) ? data.length : 0;
  } catch {
    return 0;
  }
}

export async function fetchOpenRequirementCount(
  token: string | null,
): Promise<number> {
  if (!token) return 0;

  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/requirements/open-count`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );

    if (!response.ok) return 0;
    const data = (await response.json()) as { count: number };
    return data.count ?? 0;
  } catch {
    return 0;
  }
}

export async function toggleSuperAdmin(
  token: string | null,
  clerkUserId: string,
  isSuperAdmin: boolean,
): Promise<boolean> {
  if (!token) return false;

  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/team/${clerkUserId}/super-admin`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isSuperAdmin }),
        cache: "no-store",
      },
    );

    return response.ok;
  } catch {
    return false;
  }
}

export async function fetchAdminTeam(
  token: string | null,
): Promise<AdminTeamMember[]> {
  if (!token) return [];

  try {
    const response = await fetchWithRetry(`${apiBaseUrl}/api/admin/team`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!response.ok) return [];
    const data = await response.json();
    return data.admins ?? [];
  } catch {
    return [];
  }
}

// ── Admin document/LinkedIn parsing ─────────────────────────────────────────

export async function adminFetchLinkedInJobs(
  token: string | null,
  linkedinCompanyUrl: string,
): Promise<Record<string, unknown>[]> {
  if (!token) throw new Error("Not authenticated");

  const response = await fetchWithRetry(
    `${apiBaseUrl}/api/admin/linkedin-jobs`,
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

  return response.json();
}

export async function adminParseLinkedInJob(
  token: string | null,
  data: {
    title: string;
    description: string;
    descriptionHtml?: string;
    location?: string;
    employmentType?: string;
  },
): Promise<Record<string, unknown>> {
  if (!token) throw new Error("Not authenticated");

  const response = await fetchWithRetry(
    `${apiBaseUrl}/api/admin/linkedin-jobs/parse`,
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

  return response.json();
}

export async function adminParseJobDocument(
  token: string | null,
  file: File,
): Promise<Record<string, unknown>> {
  if (!token) throw new Error("Not authenticated");

  const formData = new FormData();
  formData.append("document", file);

  const response = await fetchWithRetry(
    `${apiBaseUrl}/api/admin/requirements/parse-document`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Failed to parse document");
  }

  return response.json();
}

// ── Admin Engagements ─────────────────────────────────────────────────────

export interface AdminEngagement {
  id: string;
  developerId: string;
  developerName: string;
  developerRole: string;
  developerAvatar: string | null;
  companyId: string;
  companyName: string;
  companyLogoUrl: string | null;
  requirementId: string;
  requirementTitle: string;
  engagementType: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  companyBillingRate: number;
  developerPayoutRate: number;
  currency: string;
  payoutCurrency: string;
  monthlyHoursExpected: number | null;
  monthlyHoursCap: number | null;
  currentMonthTimeEntry: { hours: number; status: string } | null;
  pendingChangeRequests: number;
  createdAt: string;
}

export async function fetchAdminEngagements(
  token: string | null,
  params?: {
    status?: string;
    companyId?: string;
    developerId?: string;
  },
): Promise<AdminEngagement[]> {
  if (!token) return [];

  try {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set("status", params.status);
    if (params?.companyId) searchParams.set("companyId", params.companyId);
    if (params?.developerId) searchParams.set("developerId", params.developerId);
    const qs = searchParams.toString();

    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/engagements${qs ? `?${qs}` : ""}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );

    if (!response.ok) return [];
    return (await response.json()) as AdminEngagement[];
  } catch {
    return [];
  }
}

export async function createAdminTimeEntry(
  token: string | null,
  payload: {
    engagementId: string;
    period: string;
    hours: number;
    description?: string;
  },
): Promise<{ success: boolean; error?: string }> {
  if (!token) return { success: false, error: "No token" };

  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/time-entries`,
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
      return { success: false, error: body.message || "Failed to create time entry" };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Network error" };
  }
}

// ── Admin Finances ────────────────────────────────────────────────────────

export interface InvoiceCurrencyBucket {
  paid: number;
  outstanding: number;
  overdue: number;
  thisMonth: number;
  invoiceCount: number;
  overdueCount: number;
}

export interface PayoutCurrencyBucket {
  paid: number;
  pending: number;
  count: number;
}

export interface EngagementCurrencyBucket {
  count: number;
  monthlyBilling: number;
  monthlyPayout: number;
  monthlyMargin: number;
  predictedNextMonth: number;
  annualizedRevenue: number;
  annualizedMargin: number;
}

export interface AdminFinanceSummary {
  invoicesByCurrency: Record<string, InvoiceCurrencyBucket>;
  payoutsByCurrency: Record<string, PayoutCurrencyBucket>;
  currencyBreakdown: Record<string, EngagementCurrencyBucket>;
  engagements: {
    activeCount: number;
    pendingCount: number;
    upcomingStartCount: number;
  };
}

export interface RevenueTrendPoint {
  month: string;
  invoiced: number;
  paid: number;
}

export async function fetchAdminFinanceSummary(
  token: string | null,
): Promise<AdminFinanceSummary | null> {
  if (!token) return null;
  try {
    const response = await fetchWithRetry(`${apiBaseUrl}/api/admin/finances/summary`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as AdminFinanceSummary;
  } catch {
    return null;
  }
}

export async function fetchAdminRevenueTrend(
  token: string | null,
): Promise<RevenueTrendPoint[]> {
  if (!token) return [];
  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/finances/revenue-trend`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );
    if (!response.ok) return [];
    const data = (await response.json()) as { trend: RevenueTrendPoint[] };
    return data.trend ?? [];
  } catch {
    return [];
  }
}

// ── Admin Match Approvals ─────────────────────────────────────────────────

export interface AdminPendingApproval {
  id: string;
  status: string;
  proposedHourlyRate: number;
  proposedMonthlyRate: number;
  currency: string;
  developerId: string;
  developerName: string;
  developerEmail: string;
  developerRole: string;
  developerAvatar: string;
  requirementId: string;
  requirementTitle: string;
  engagementType: string;
  companyId: string | null;
  companyName: string;
  companyLogoUrl: string | null;
  proposedAt: string;
  respondedAt: string | null;
}

export interface AdminUpcomingStart {
  id: string;
  status: string;
  startDate: string | null;
  engagementType: string;
  companyBillingRate: number;
  developerPayoutRate: number;
  currency: string;
  monthlyHoursExpected: number | null;
  developerId: string;
  developerName: string;
  developerEmail: string;
  developerRole: string;
  developerAvatar: string;
  requirementId: string;
  requirementTitle: string;
  companyId: string;
  companyName: string;
  companyLogoUrl: string | null;
}

export async function fetchMatchesAwaitingApproval(
  token: string | null,
): Promise<AdminPendingApproval[]> {
  if (!token) return [];
  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/matches/awaiting-approval`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );
    if (!response.ok) return [];
    return (await response.json()) as AdminPendingApproval[];
  } catch {
    return [];
  }
}

export async function fetchUpcomingStarts(
  token: string | null,
): Promise<AdminUpcomingStart[]> {
  if (!token) return [];
  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/engagements/upcoming-starts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );
    if (!response.ok) return [];
    return (await response.json()) as AdminUpcomingStart[];
  } catch {
    return [];
  }
}

export async function adminApproveMatch(
  token: string | null,
  matchId: string,
  payload?: {
    startDate?: string;
    engagementType?: string;
    monthlyHoursExpected?: number | null;
    companyBillingRate?: number;
    developerPayoutRate?: number;
    currency?: string;
  },
): Promise<{ success: boolean; error?: string }> {
  if (!token) return { success: false, error: "No token" };
  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/matches/${matchId}/approve`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload ?? {}),
        cache: "no-store",
      },
    );
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      return { success: false, error: body.message ?? "Failed to approve match" };
    }
    return { success: true };
  } catch {
    return { success: false, error: "Network error" };
  }
}

export async function adminRejectMatch(
  token: string | null,
  matchId: string,
  reason?: string,
): Promise<{ success: boolean; error?: string }> {
  if (!token) return { success: false, error: "No token" };
  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/matches/${matchId}/reject`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
        cache: "no-store",
      },
    );
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      return { success: false, error: body.message ?? "Failed to reject match" };
    }
    return { success: true };
  } catch {
    return { success: false, error: "Network error" };
  }
}

export async function adminConfirmEngagementStart(
  token: string | null,
  engagementId: string,
): Promise<{ success: boolean; error?: string }> {
  if (!token) return { success: false, error: "No token" };
  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/engagements/${engagementId}/confirm-start`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      return {
        success: false,
        error: body.message ?? "Failed to confirm engagement start",
      };
    }
    return { success: true };
  } catch {
    return { success: false, error: "Network error" };
  }
}

export async function updateAdminEngagement(
  token: string | null,
  id: string,
  payload: {
    companyBillingRate?: number;
    developerPayoutRate?: number;
    currency?: string;
    payoutCurrency?: string;
    engagementType?: string;
    status?: string;
    monthlyHoursExpected?: number | null;
    monthlyHoursCap?: number | null;
    startDate?: string | null;
    endDate?: string | null;
  },
): Promise<{ success: boolean; error?: string }> {
  if (!token) return { success: false, error: "No token" };

  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/engagements/${id}`,
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
      return { success: false, error: body.message || "Failed to update engagement" };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Network error" };
  }
}
