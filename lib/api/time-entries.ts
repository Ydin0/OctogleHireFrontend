import type { TimeEntryStatus } from "@/app/admin/dashboard/_components/dashboard-data";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

// ── Types ────────────────────────────────────────────────────────────────────

export interface AdminTimeEntry {
  id: string;
  engagementId: string;
  developerId: string;
  developerName: string;
  developerEmail: string;
  developerRole: string;
  companyId: string;
  companyName: string;
  requirementTitle: string;
  period: string;
  hours: number;
  billingRate: number;
  billingAmount: number;
  payoutRate: number;
  description?: string;
  status: TimeEntryStatus;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
}

// ── API Functions ────────────────────────────────────────────────────────────

export async function fetchTimeEntries(
  token: string | null,
  params?: {
    status?: string;
    developerId?: string;
    period?: string;
    companyId?: string;
  },
): Promise<AdminTimeEntry[] | null> {
  if (!token) return null;

  try {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set("status", params.status);
    if (params?.developerId) searchParams.set("developerId", params.developerId);
    if (params?.period) searchParams.set("period", params.period);
    if (params?.companyId) searchParams.set("companyId", params.companyId);
    const qs = searchParams.toString();

    const response = await fetch(
      `${apiBaseUrl}/api/admin/time-entries${qs ? `?${qs}` : ""}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 60 },
      },
    );

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as AdminTimeEntry[];
  } catch {
    return null;
  }
}

export async function approveTimeEntry(
  token: string | null,
  id: string,
): Promise<AdminTimeEntry | null> {
  if (!token) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/admin/time-entries/${id}/approve`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as AdminTimeEntry;
  } catch {
    return null;
  }
}

export async function rejectTimeEntry(
  token: string | null,
  id: string,
): Promise<AdminTimeEntry | null> {
  if (!token) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/admin/time-entries/${id}/reject`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as AdminTimeEntry;
  } catch {
    return null;
  }
}
