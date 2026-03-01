const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

// ── Types ────────────────────────────────────────────────────────────────────

export interface DeveloperEngagement {
  id: string;
  companyId: string;
  companyName: string;
  requirementId: string;
  requirementTitle: string;
  companyBillingRate: number;
  developerPayoutRate: number;
  currency: string;
  engagementType: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
}

export interface DeveloperTimeEntry {
  id: string;
  engagementId: string;
  developerId: string;
  companyName: string;
  requirementTitle: string;
  period: string;
  hours: number;
  description?: string;
  status: string;
  approvedAt?: string;
  createdAt: string;
}

export interface DeveloperPayout {
  id: string;
  payoutNumber: string;
  developerId: string;
  developerName: string;
  developerEmail: string;
  developerRole: string;
  periodStart: string;
  periodEnd: string;
  currency: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: string;
  lineItems: {
    id: string;
    companyId: string;
    companyName: string;
    requirementTitle: string;
    developerPayoutRate: number;
    companyBillingRate: number;
    hoursWorked: number;
    payoutAmount: number;
    billingAmount: number;
    margin: number;
  }[];
  notes?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeveloperPayoutSummary {
  totalPayouts: number;
  totalPaidOut: number;
  totalPending: number;
  totalBilledToCompanies: number;
  totalMargin: number;
  averageMarginPercent: number;
}

export interface DeveloperProfile {
  id: string;
  slug: string | null;
  fullName: string | null;
  email: string;
  phone: string | null;
  locationCity: string | null;
  locationState: string | null;
  professionalTitle: string | null;
  yearsOfExperience: number | null;
  bio: string | null;
  aboutLong: string | null;
  primaryStack: string[] | null;
  secondarySkills: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  profilePhotoUrl: string | null;
  engagementType: string[] | null;
  availability: string | null;
  englishProficiency: string | null;
  workExperience: unknown;
  education: unknown;
  certifications: string | null;
  hourlyRate: number | null;
  monthlyRate: number | null;
  marketplaceRating: string | null;
  marketplaceProjects: number | null;
  marketplaceAchievements: unknown;
  marketplaceAwards: unknown;
  isLive: boolean;
  isFeatured: boolean;
  status: string;
  createdAt: string;
}

export interface DeveloperOffer {
  id: string;
  applicationId: string;
  hourlyRate: number;
  monthlyRate: number;
  currency: string;
  engagementType: string;
  startDate: string;
  contractUrl: string | null;
  status: string;
  respondedAt: string | null;
  createdAt: string;
}

export interface DeveloperOpportunity {
  id: string;
  requirementId: string;
  requirementTitle: string;
  requirementDescription: string;
  techStack: string[];
  experienceLevel: string;
  engagementType: string;
  companyName: string;
  companyWebsite: string | null;
  companyLocation: string | null;
  proposedHourlyRate: number;
  proposedMonthlyRate: number;
  currency: string;
  status: string;
  rejectionReason: string | null;
  proposedAt: string;
  respondedAt: string | null;
}

// ── API Functions ────────────────────────────────────────────────────────────

export async function fetchDeveloperEngagements(
  token: string | null,
): Promise<DeveloperEngagement[] | null> {
  if (!token) return null;

  try {
    const response = await fetch(`${apiBaseUrl}/api/developers/engagements`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 },
    });

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as DeveloperEngagement[];
  } catch {
    return null;
  }
}

export async function fetchDeveloperTimeEntries(
  token: string | null,
  params?: { status?: string; period?: string },
): Promise<DeveloperTimeEntry[] | null> {
  if (!token) return null;

  try {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set("status", params.status);
    if (params?.period) searchParams.set("period", params.period);
    const qs = searchParams.toString();

    const response = await fetch(
      `${apiBaseUrl}/api/developers/time-entries${qs ? `?${qs}` : ""}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 60 },
      },
    );

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as DeveloperTimeEntry[];
  } catch {
    return null;
  }
}

export async function submitTimeEntry(
  token: string | null,
  data: {
    engagementId: string;
    hours: number;
    period: string;
    description?: string;
  },
): Promise<DeveloperTimeEntry | null> {
  if (!token) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/developers/time-entries`,
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
      const err = await response.json().catch(() => null);
      throw new Error(err?.message ?? "API error");
    }
    return (await response.json()) as DeveloperTimeEntry;
  } catch (error) {
    throw error;
  }
}

export async function fetchDeveloperEarnings(
  token: string | null,
): Promise<DeveloperPayout[] | null> {
  if (!token) return null;

  try {
    const response = await fetch(`${apiBaseUrl}/api/developers/earnings`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 },
    });

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as DeveloperPayout[];
  } catch {
    return null;
  }
}

export async function fetchDeveloperEarningsSummary(
  token: string | null,
): Promise<DeveloperPayoutSummary | null> {
  if (!token) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/developers/earnings/summary`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 60 },
      },
    );

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as DeveloperPayoutSummary;
  } catch {
    return null;
  }
}

// ── Profile ─────────────────────────────────────────────────────────────────

export async function fetchDeveloperProfile(
  token: string | null,
): Promise<DeveloperProfile | null> {
  if (!token) return null;

  try {
    const response = await fetch(`${apiBaseUrl}/api/developers/profile`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 },
    });

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as DeveloperProfile;
  } catch {
    return null;
  }
}

export async function updateDeveloperProfile(
  token: string | null,
  data: Record<string, unknown>,
): Promise<DeveloperProfile | null> {
  if (!token) return null;

  try {
    const response = await fetch(`${apiBaseUrl}/api/developers/profile`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.message ?? "API error");
    }
    return (await response.json()) as DeveloperProfile;
  } catch (error) {
    throw error;
  }
}

// ── Offers ──────────────────────────────────────────────────────────────────

export async function fetchDeveloperOffers(
  token: string | null,
): Promise<DeveloperOffer[] | null> {
  if (!token) return null;

  try {
    const response = await fetch(`${apiBaseUrl}/api/developers/offers`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 },
    });

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as DeveloperOffer[];
  } catch {
    return null;
  }
}

export async function respondToDeveloperOffer(
  token: string | null,
  offerId: string,
  action: "accepted" | "declined",
): Promise<DeveloperOffer | null> {
  if (!token) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/developers/offers/${offerId}/respond`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.message ?? "API error");
    }
    return (await response.json()) as DeveloperOffer;
  } catch (error) {
    throw error;
  }
}

// ── Opportunities ───────────────────────────────────────────────────────────

export async function fetchDeveloperOpportunities(
  token: string | null,
): Promise<DeveloperOpportunity[] | null> {
  if (!token) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/developers/opportunities`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 60 },
      },
    );

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as DeveloperOpportunity[];
  } catch {
    return null;
  }
}

export async function respondToDeveloperOpportunity(
  token: string | null,
  matchId: string,
  action: "accepted" | "declined",
  rejectionReason?: string,
): Promise<unknown> {
  if (!token) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/developers/opportunities/${matchId}/respond`,
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

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.message ?? "API error");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}
