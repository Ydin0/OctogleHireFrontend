import { fetchWithRetry } from "./fetch-with-retry";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export interface EngagementChangeRequestAdmin {
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
  companyName: string;
  developerName: string;
  developerRole: string;
  requirementTitle: string;
  engagementType: string;
  engagementStartDate: string | null;
  engagementStatus: string;
  currentMonthlyHours: number | null;
  companyBillingRate: number;
}

export async function fetchAdminChangeRequests(
  token: string | null,
  params?: { status?: string; type?: string; companyId?: string },
): Promise<EngagementChangeRequestAdmin[]> {
  if (!token) return [];

  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set("status", params.status);
  if (params?.type) searchParams.set("type", params.type);
  if (params?.companyId) searchParams.set("companyId", params.companyId);

  const qs = searchParams.toString();
  const url = `${apiBaseUrl}/api/admin/engagement-change-requests${qs ? `?${qs}` : ""}`;

  const response = await fetchWithRetry(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) throw new Error("Failed to fetch change requests");
  return (await response.json()) as EngagementChangeRequestAdmin[];
}

export async function reviewChangeRequest(
  token: string | null,
  id: string,
  action: "approved" | "rejected",
  adminNotes?: string,
): Promise<EngagementChangeRequestAdmin> {
  if (!token) throw new Error("Not authenticated");

  const response = await fetchWithRetry(
    `${apiBaseUrl}/api/admin/engagement-change-requests/${id}/review`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, adminNotes }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Failed to review change request");
  }

  return (await response.json()) as EngagementChangeRequestAdmin;
}
