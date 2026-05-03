import { fetchWithRetry } from "./fetch-with-retry";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

// ── Types ────────────────────────────────────────────────────────────────────

export interface AdminSalesRepApplication {
  id: string;
  fullName: string | null;
  email: string;
  salesRoleTitle: string | null;
  locationCity: string | null;
  locationState: string | null;
  yearsOfExperience: number | null;
  salesTools: string[] | null;
  salesMethodologies: string[] | null;
  industriesSold: string[] | null;
  status: string;
  isLive: boolean;
  isFeatured: boolean;
  submittedAt: string | null;
  profilePhotoPath: string | null;
  salaryAmount: number | null;
  salaryCurrency: string | null;
  source: string;
  agencyId: string | null;
  agencyName: string | null;
  agencyLogo: string | null;
}

export interface AdminSalesRepApplicationFull {
  id: string;
  clerkUserId: string | null;
  status: string;
  canonicalEmail: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  locationCity: string | null;
  locationState: string | null;
  salesRoleTitle: string | null;
  yearsOfExperience: number | null;
  bio: string | null;
  salesTools: string[] | null;
  salesMethodologies: string[] | null;
  industriesSold: string[] | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  resumePath: string | null;
  resumeOriginalName: string | null;
  profilePhotoPath: string | null;
  engagementType: string[] | null;
  availability: string | null;
  englishProficiency: string | null;
  workExperience:
    | {
        company: string;
        title: string;
        startDate: string;
        endDate: string | null;
        current: boolean;
        description: string;
        companyLogoUrl?: string;
      }[]
    | null;
  certifications: string | null;
  salaryCurrency: string | null;
  salaryAmount: number | null;
  isLive: boolean;
  isFeatured: boolean;
  slug: string | null;
  introVideoPath: string | null;
  introVideoOriginalName: string | null;
  agencyId: string | null;
  agencyName: string | null;
  referralCode: string | null;
  source: string;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SalesRepApplicationNote {
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

export interface FetchSalesRepApplicationsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  isLive?: string;
  sortBy?: string;
  sortOrder?: string;
  salesRoleTitle?: string;
  salesTools?: string;
  salesMethodologies?: string;
  industriesSold?: string;
  location?: string;
  expMin?: string;
  expMax?: string;
  engagementType?: string;
  availability?: string;
  agency?: string;
}

export interface SalesRepFilterOptions {
  salesRoleTitles: string[];
  salesTools: string[];
  salesMethodologies: string[];
  industriesSold: string[];
  locations: string[];
  engagementTypes: string[];
  availabilities: string[];
  agencies: { id: string; name: string }[];
}

// ── API Functions ────────────────────────────────────────────────────────────

export async function fetchSalesRepApplications(
  token: string | null,
  params: FetchSalesRepApplicationsParams = {}
): Promise<{
  applications: AdminSalesRepApplication[];
  pagination: Pagination;
} | null> {
  if (!token) return null;

  try {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.set(key, String(value));
      }
    }

    const qs = searchParams.toString();
    const url = `${apiBaseUrl}/api/admin/sales-rep-applications${qs ? `?${qs}` : ""}`;

    const response = await fetchWithRetry(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!response.ok) return null;
    return (await response.json()) as {
      applications: AdminSalesRepApplication[];
      pagination: Pagination;
    };
  } catch {
    return null;
  }
}

export async function fetchSalesRepFilterOptions(
  token: string | null
): Promise<SalesRepFilterOptions | null> {
  if (!token) return null;

  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/sales-rep-applications/filter-options`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );

    if (!response.ok) return null;
    return (await response.json()) as SalesRepFilterOptions;
  } catch {
    return null;
  }
}

export async function fetchSalesRepApplication(
  token: string | null,
  id: string
): Promise<{
  application: AdminSalesRepApplicationFull;
  notes: SalesRepApplicationNote[];
} | null> {
  if (!token) return null;

  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/sales-rep-applications/${id}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );

    if (!response.ok) return null;
    return (await response.json()) as {
      application: AdminSalesRepApplicationFull;
      notes: SalesRepApplicationNote[];
    };
  } catch {
    return null;
  }
}

export async function updateSalesRepApplicationStatus(
  token: string | null,
  id: string,
  status: string,
  note?: string
): Promise<{ application: AdminSalesRepApplicationFull } | null> {
  if (!token) return null;

  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/sales-rep-applications/${id}/status`,
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
    return (await response.json()) as {
      application: AdminSalesRepApplicationFull;
    };
  } catch {
    return null;
  }
}

export async function toggleSalesRepApplicationLive(
  token: string | null,
  id: string,
  isLive: boolean
): Promise<{ application: AdminSalesRepApplicationFull } | null> {
  if (!token) return null;

  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/sales-rep-applications/${id}/live`,
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
    return (await response.json()) as {
      application: AdminSalesRepApplicationFull;
    };
  } catch {
    return null;
  }
}

export async function toggleSalesRepApplicationFeatured(
  token: string | null,
  id: string,
  isFeatured: boolean
): Promise<{ application: AdminSalesRepApplicationFull } | null> {
  if (!token) return null;

  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/sales-rep-applications/${id}/featured`,
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
    return (await response.json()) as {
      application: AdminSalesRepApplicationFull;
    };
  } catch {
    return null;
  }
}

export async function createSalesRepApplicationNote(
  token: string | null,
  id: string,
  content: string,
  stage?: string
): Promise<{ note: SalesRepApplicationNote } | null> {
  if (!token) return null;

  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/sales-rep-applications/${id}/notes`,
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
    return (await response.json()) as { note: SalesRepApplicationNote };
  } catch {
    return null;
  }
}

export async function updateSalesRepApplicationNote(
  token: string | null,
  applicationId: string,
  noteId: string,
  content: string
): Promise<{ note: SalesRepApplicationNote } | null> {
  if (!token) return null;

  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/sales-rep-applications/${applicationId}/notes/${noteId}`,
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
    return (await response.json()) as { note: SalesRepApplicationNote };
  } catch {
    return null;
  }
}

export async function deleteSalesRepApplicationNote(
  token: string | null,
  applicationId: string,
  noteId: string
): Promise<boolean> {
  if (!token) return false;

  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/sales-rep-applications/${applicationId}/notes/${noteId}`,
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

export async function bulkUpdateSalesRepApplicationStatus(
  token: string | null,
  ids: string[],
  status: string,
  note?: string
): Promise<{ updated: number } | null> {
  if (!token) return null;

  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/sales-rep-applications/bulk/status`,
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
