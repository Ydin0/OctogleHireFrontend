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
