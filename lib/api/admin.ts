const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

// ── Types ────────────────────────────────────────────────────────────────────

export interface AdminApplication {
  id: string;
  fullName: string | null;
  email: string;
  professionalTitle: string | null;
  locationCity: string | null;
  locationState: string | null;
  yearsOfExperience: number | null;
  primaryStack: string[] | null;
  status: string;
  isLive: boolean;
  isFeatured: boolean;
  submittedAt: string | null;
  profilePhotoPath: string | null;
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
  stack?: string;
  location?: string;
  expMin?: string;
  expMax?: string;
  engagementType?: string;
  availability?: string;
}

export interface FilterOptions {
  professionalTitles: string[];
  techStacks: string[];
  locations: string[];
  engagementTypes: string[];
  availabilities: string[];
}

export interface AdminStats {
  total: number;
  liveCount: number;
  featuredCount: number;
  byStatus: Record<string, number>;
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
    if (params.stack) searchParams.set("stack", params.stack);
    if (params.location) searchParams.set("location", params.location);
    if (params.expMin) searchParams.set("expMin", params.expMin);
    if (params.expMax) searchParams.set("expMax", params.expMax);
    if (params.engagementType) searchParams.set("engagementType", params.engagementType);
    if (params.availability) searchParams.set("availability", params.availability);

    const qs = searchParams.toString();
    const url = `${apiBaseUrl}/api/admin/applications${qs ? `?${qs}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 30 },
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
    const response = await fetch(
      `${apiBaseUrl}/api/admin/applications/filter-options`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 30 },
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
    const response = await fetch(
      `${apiBaseUrl}/api/admin/applications/${id}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 30 },
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
    const response = await fetch(
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
    const response = await fetch(
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
    const response = await fetch(
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
    const response = await fetch(
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
    const response = await fetch(
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
    const response = await fetch(
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
    if (params.stack) searchParams.set("stack", params.stack);
    if (params.location) searchParams.set("location", params.location);
    if (params.expMin) searchParams.set("expMin", params.expMin);
    if (params.expMax) searchParams.set("expMax", params.expMax);
    if (params.engagementType) searchParams.set("engagementType", params.engagementType);
    if (params.availability) searchParams.set("availability", params.availability);

    const qs = searchParams.toString();
    const url = `${apiBaseUrl}/api/admin/applications/export${qs ? `?${qs}` : ""}`;

    const response = await fetch(url, {
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
    const response = await fetch(
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

    const response = await fetch(
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
    const response = await fetch(
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
    const response = await fetch(
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
    const response = await fetch(`${apiBaseUrl}/api/admin/stats`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 30 },
    });

    if (!response.ok) return null;
    return (await response.json()) as AdminStats;
  } catch {
    return null;
  }
}
