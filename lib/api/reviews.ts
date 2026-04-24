import { fetchWithRetry } from "./fetch-with-retry";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

// ── Types ───────────────────────────────────────────────────────────────────

export type ReviewStatus = "pending" | "approved" | "rejected";

export interface Review {
  id: string;
  name: string;
  role: string;
  company: string;
  linkedinUrl: string;
  quote: string;
  hiredRole: string;
  hiredCount: number;
  localRate: number;
  octogleRate: number;
  market: string;
  flag: string;
  currency: string;
  avatarUrl: string | null;
  logoUrl: string | null;
  status: ReviewStatus;
  createdAt: string;
  approvedAt: string | null;
  rejectedAt: string | null;
  note: string | null;
}

export interface ReviewSubmission {
  name: string;
  role: string;
  company: string;
  linkedinUrl: string;
  quote: string;
  hiredRole: string;
  hiredCount: number;
  localRate: number;
  octogleRate: number;
  market: string;
  flag: string;
  currency: string;
  avatar: File;
  logo?: File;
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Submit a new review. Sends multipart/form-data so the backend can accept
 * the reviewer's photo (required) and their company logo (optional).
 */
export async function submitReview(
  input: ReviewSubmission,
): Promise<{ review: Review } | { error: string }> {
  const form = new FormData();
  form.set("name", input.name);
  form.set("role", input.role);
  form.set("company", input.company);
  form.set("linkedinUrl", input.linkedinUrl);
  form.set("quote", input.quote);
  form.set("hiredRole", input.hiredRole);
  form.set("hiredCount", String(input.hiredCount));
  form.set("localRate", String(input.localRate));
  form.set("octogleRate", String(input.octogleRate));
  form.set("market", input.market);
  form.set("flag", input.flag);
  form.set("currency", input.currency);
  form.set("avatar", input.avatar);
  if (input.logo) form.set("logo", input.logo);

  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/public/reviews`,
      {
        method: "POST",
        body: form,
      },
    );

    if (!response.ok) {
      let message = "Failed to submit review";
      try {
        const err = await response.json();
        message = err?.message || err?.error || message;
      } catch {
        // ignore
      }
      return { error: message };
    }

    return (await response.json()) as { review: Review };
  } catch {
    return { error: "Network error. Please try again." };
  }
}

/**
 * Fetch approved reviews to render on the homepage. Returns `null` when the
 * endpoint isn't available yet so callers can fall back to the hardcoded seed.
 */
export async function fetchApprovedReviews(): Promise<Review[] | null> {
  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/public/reviews?status=approved`,
      {
        method: "GET",
        cache: "no-store",
      },
    );
    if (!response.ok) return null;
    const data = (await response.json()) as { reviews?: Review[] };
    return data.reviews ?? [];
  } catch {
    return null;
  }
}

// ── Admin API ───────────────────────────────────────────────────────────────

export async function fetchAdminReviews(
  token: string | null,
  status?: ReviewStatus,
): Promise<Review[]> {
  if (!token) return [];
  try {
    const qs = status ? `?status=${encodeURIComponent(status)}` : "";
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/reviews${qs}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );
    if (!response.ok) return [];
    const data = (await response.json()) as { reviews?: Review[] };
    return data.reviews ?? [];
  } catch {
    return [];
  }
}

export async function updateReviewStatus(
  token: string | null,
  id: string,
  status: ReviewStatus,
  note?: string,
): Promise<{ review: Review } | { error: string }> {
  if (!token) return { error: "Not authenticated" };
  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/reviews/${id}/status`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, note }),
        cache: "no-store",
      },
    );
    if (!response.ok) {
      let message = "Failed to update review";
      try {
        const err = await response.json();
        message = err?.message || err?.error || message;
      } catch {
        // ignore
      }
      return { error: message };
    }
    return (await response.json()) as { review: Review };
  } catch {
    return { error: "Network error" };
  }
}
