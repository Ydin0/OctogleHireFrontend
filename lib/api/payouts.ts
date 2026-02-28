import type { PayoutStatus } from "@/app/admin/dashboard/_components/dashboard-data";
import {
  getMockPayouts,
  getMockPayoutById,
  getMockPayoutsByDeveloperId,
  getMockPayoutSummary,
  getMockDeveloperPayoutSummary,
} from "@/lib/data/mock-payouts";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

// ── Types ────────────────────────────────────────────────────────────────────

export interface PayoutLineItem {
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
}

export interface Payout {
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
  status: PayoutStatus;
  lineItems: PayoutLineItem[];
  notes?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PayoutSummary {
  totalPayouts: number;
  totalPaidOut: number;
  totalPending: number;
  totalBilledToCompanies: number;
  totalMargin: number;
  averageMarginPercent: number;
}

// ── API Functions ────────────────────────────────────────────────────────────

export async function fetchPayouts(
  token: string | null,
): Promise<Payout[] | null> {
  if (!token) return null;

  try {
    const response = await fetch(`${apiBaseUrl}/api/admin/payouts`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as Payout[];
  } catch {
    return getMockPayouts();
  }
}

export async function fetchPayout(
  token: string | null,
  id: string,
): Promise<Payout | null> {
  if (!token) return null;

  try {
    const response = await fetch(`${apiBaseUrl}/api/admin/payouts/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as Payout;
  } catch {
    return getMockPayoutById(id) ?? null;
  }
}

export async function fetchPayoutsByDeveloper(
  token: string | null,
  developerId: string,
): Promise<Payout[] | null> {
  if (!token) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/admin/payouts?developerId=${developerId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as Payout[];
  } catch {
    return getMockPayoutsByDeveloperId(developerId);
  }
}

export async function fetchPayoutSummary(
  token: string | null,
): Promise<PayoutSummary | null> {
  if (!token) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/admin/payouts/summary`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as PayoutSummary;
  } catch {
    return getMockPayoutSummary();
  }
}

export async function fetchDeveloperPayoutSummary(
  token: string | null,
  developerId: string,
): Promise<PayoutSummary | null> {
  if (!token) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/admin/payouts/summary?developerId=${developerId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as PayoutSummary;
  } catch {
    return getMockDeveloperPayoutSummary(developerId);
  }
}

export async function updatePayoutStatus(
  token: string | null,
  payoutId: string,
  status: PayoutStatus,
): Promise<Payout | null> {
  if (!token) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/admin/payouts/${payoutId}/status`,
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
    return (await response.json()) as Payout;
  } catch {
    return null;
  }
}
