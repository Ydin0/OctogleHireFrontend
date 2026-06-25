import type { InvoiceStatus } from "@/app/admin/dashboard/_components/dashboard-data";
import { fetchWithRetry } from "./fetch-with-retry";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

// ── Types ────────────────────────────────────────────────────────────────────

export interface InvoiceLineItem {
  id: string;
  developerId: string | null;
  developerName: string | null;
  developerRole: string | null;
  requirementTitle: string | null;
  description: string | null;
  hourlyRate: number;
  hoursWorked: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  companyId: string;
  companyName: string;
  companyEmail: string;
  developerId?: string | null;
  developerName?: string | null;
  developerRole?: string | null;
  periodStart: string;
  periodEnd: string;
  issuedAt: string;
  dueDate: string;
  paidAt?: string;
  currency: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: InvoiceStatus;
  /** Status with the "sent past due-date → overdue" rule applied. Always set. */
  effectiveStatus: InvoiceStatus;
  /** Days past due date for unpaid/uncancelled invoices. 0 otherwise. */
  daysOverdue: number;
  lineItems: InvoiceLineItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceAgingBuckets {
  current: number;
  d1to30: number;
  d31to60: number;
  d61to90: number;
  d90plus: number;
}

export interface MonthlyRevenuePoint {
  /** YYYY-MM */
  month: string;
  currency: string;
  total: number;
}

export interface TopClientOutstanding {
  companyId: string;
  companyName: string;
  logoUrl: string | null;
  currency: string;
  outstanding: number;
}

export interface InvoiceSummary {
  totalInvoices: number;
  totalRevenue: number;
  totalPaid: number;
  totalOutstanding: number;
  overdueCount: number;
  agingBuckets: InvoiceAgingBuckets;
  monthlyRevenue: MonthlyRevenuePoint[];
  topClientsByOutstanding: TopClientOutstanding[];
  avgDaysToPayLast90Days: number | null;
}

/**
 * Filter shape consumed by every list / summary / export call. All optional;
 * pass only the keys the user has actively set so the URL stays clean.
 */
export interface InvoiceFilters {
  search?: string;
  statuses?: string[];      // multi
  companyIds?: string[];    // multi
  developerIds?: string[];  // multi
  currencies?: string[];    // multi
  issuedFrom?: string;      // YYYY-MM-DD
  issuedTo?: string;
  dueFrom?: string;
  dueTo?: string;
  periodFrom?: string;      // YYYY-MM
  periodTo?: string;
  minTotal?: number;
  maxTotal?: number;
  overdueOnly?: boolean;
  sortBy?:
    | "issuedAt"
    | "dueDate"
    | "total"
    | "status"
    | "companyName"
    | "invoiceNumber";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface InvoiceListResponse {
  invoices: Invoice[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/** Build a URL search string from an InvoiceFilters object, omitting empty values. */
export function buildInvoiceFiltersQuery(filters: InvoiceFilters): string {
  const sp = new URLSearchParams();
  if (filters.search) sp.set("search", filters.search);
  if (filters.statuses?.length) sp.set("status", filters.statuses.join(","));
  if (filters.companyIds?.length)
    sp.set("companyIds", filters.companyIds.join(","));
  if (filters.developerIds?.length)
    sp.set("developerIds", filters.developerIds.join(","));
  if (filters.currencies?.length)
    sp.set("currencies", filters.currencies.join(","));
  if (filters.issuedFrom) sp.set("issuedFrom", filters.issuedFrom);
  if (filters.issuedTo) sp.set("issuedTo", filters.issuedTo);
  if (filters.dueFrom) sp.set("dueFrom", filters.dueFrom);
  if (filters.dueTo) sp.set("dueTo", filters.dueTo);
  if (filters.periodFrom) sp.set("periodFrom", filters.periodFrom);
  if (filters.periodTo) sp.set("periodTo", filters.periodTo);
  if (filters.minTotal !== undefined)
    sp.set("minTotal", String(filters.minTotal));
  if (filters.maxTotal !== undefined)
    sp.set("maxTotal", String(filters.maxTotal));
  if (filters.overdueOnly) sp.set("overdueOnly", "true");
  if (filters.sortBy) sp.set("sortBy", filters.sortBy);
  if (filters.sortOrder) sp.set("sortOrder", filters.sortOrder);
  if (filters.page) sp.set("page", String(filters.page));
  if (filters.limit) sp.set("limit", String(filters.limit));
  return sp.toString();
}

// ── API Functions ────────────────────────────────────────────────────────────

export async function fetchInvoices(
  token: string | null,
  filters: InvoiceFilters = {},
): Promise<InvoiceListResponse | null> {
  if (!token) return null;

  try {
    const qs = buildInvoiceFiltersQuery(filters);
    const url = `${apiBaseUrl}/api/admin/invoices${qs ? `?${qs}` : ""}`;
    const response = await fetchWithRetry(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as InvoiceListResponse;
  } catch {
    return null;
  }
}

export async function fetchInvoice(
  token: string | null,
  id: string,
): Promise<Invoice | null> {
  if (!token) return null;

  try {
    const response = await fetchWithRetry(`${apiBaseUrl}/api/admin/invoices/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as Invoice;
  } catch {
    return null;
  }
}

export async function fetchInvoicesByCompany(
  token: string | null,
  companyId: string,
): Promise<Invoice[] | null> {
  if (!token) return null;

  try {
    // The list endpoint now returns { invoices, pagination } — pull a big page
    // so the company-detail panel sees them all (small per-company N).
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/invoices?companyIds=${companyId}&limit=100`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );

    if (!response.ok) throw new Error("API error");
    const data = (await response.json()) as InvoiceListResponse;
    return data.invoices;
  } catch {
    return null;
  }
}

export async function fetchInvoiceSummary(
  token: string | null,
  filters: InvoiceFilters = {},
): Promise<InvoiceSummary | null> {
  if (!token) return null;

  try {
    const qs = buildInvoiceFiltersQuery(filters);
    const url = `${apiBaseUrl}/api/admin/invoices/summary${qs ? `?${qs}` : ""}`;
    const response = await fetchWithRetry(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as InvoiceSummary;
  } catch {
    return null;
  }
}

export async function fetchCompanyInvoiceSummary(
  token: string | null,
  companyId: string,
): Promise<InvoiceSummary | null> {
  if (!token) return null;

  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/invoices/summary?companyIds=${companyId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as InvoiceSummary;
  } catch {
    return null;
  }
}

// ── Bulk actions + CSV export ──────────────────────────────────────────────

export async function bulkMarkInvoicesPaid(
  token: string | null,
  ids: string[],
): Promise<{ updated: number; skipped: number } | { error: string }> {
  if (!token) return { error: "No token" };
  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/invoices/bulk/mark-paid`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
        cache: "no-store",
      },
    );
    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as {
        message?: string;
      };
      return { error: body.message ?? "Bulk mark-paid failed" };
    }
    return (await response.json()) as { updated: number; skipped: number };
  } catch {
    return { error: "Network error" };
  }
}

export async function bulkSendInvoices(
  token: string | null,
  ids: string[],
): Promise<
  | { sent: number; skipped: number; errors: { id: string; message: string }[] }
  | { error: string }
> {
  if (!token) return { error: "No token" };
  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/invoices/bulk/send`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
        cache: "no-store",
      },
    );
    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as {
        message?: string;
      };
      return { error: body.message ?? "Bulk send failed" };
    }
    return (await response.json()) as {
      sent: number;
      skipped: number;
      errors: { id: string; message: string }[];
    };
  } catch {
    return { error: "Network error" };
  }
}

export async function bulkDeleteInvoices(
  token: string | null,
  ids: string[],
): Promise<{ deleted: number } | { error: string }> {
  if (!token) return { error: "No token" };
  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/invoices/bulk`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
        cache: "no-store",
      },
    );
    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as {
        message?: string;
      };
      return { error: body.message ?? "Bulk delete failed" };
    }
    return (await response.json()) as { deleted: number };
  } catch {
    return { error: "Network error" };
  }
}

/**
 * Email the selected invoices' PDFs (bundled into one email) to an arbitrary
 * address — e.g. a client's accounts department. Does not change invoice state.
 */
export async function bulkEmailInvoices(
  token: string | null,
  ids: string[],
  recipientEmail: string,
  note?: string,
): Promise<
  | { emailed: number; recipientEmail: string; errors: { id: string; message: string }[] }
  | { error: string }
> {
  if (!token) return { error: "No token" };
  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/invoices/bulk/email`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids, recipientEmail, note }),
        cache: "no-store",
      },
    );
    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as {
        message?: string;
        error?: string;
      };
      return {
        error:
          body.message ??
          body.error ??
          `Failed to email invoices (${response.status})`,
      };
    }
    // Normalise — never trust the body to contain every field, so callers can
    // safely read `.errors.length` without an unhandled rejection.
    const body = (await response.json().catch(() => ({}))) as {
      emailed?: number;
      recipientEmail?: string;
      errors?: { id: string; message: string }[];
    };
    return {
      emailed: body.emailed ?? 0,
      recipientEmail: body.recipientEmail ?? recipientEmail,
      errors: Array.isArray(body.errors) ? body.errors : [],
    };
  } catch {
    return { error: "Network error" };
  }
}

/** Builds the CSV-export URL for the Export button (browser navigates to it). */
export function buildInvoicesCsvUrl(filters: InvoiceFilters): string {
  const qs = buildInvoiceFiltersQuery(filters);
  return `${apiBaseUrl}/api/admin/invoices/export${qs ? `?${qs}` : ""}`;
}

export interface AdminCreateInvoicePayload {
  engagementId: string;
  period: string; // YYYY-MM
  hours: number;
  hourlyRate: number;
  currency?: string;
  taxRate?: number;
  dueInDays?: number;
  notes?: string;
}

export async function adminCreateInvoice(
  token: string | null,
  payload: AdminCreateInvoicePayload,
): Promise<{ success: true; invoiceId: string } | { success: false; error: string }> {
  if (!token) return { success: false, error: "No token" };
  try {
    const response = await fetchWithRetry(`${apiBaseUrl}/api/admin/invoices`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as {
        message?: string;
      };
      return { success: false, error: body.message ?? "Failed to create invoice" };
    }
    const data = (await response.json()) as { id: string };
    return { success: true, invoiceId: data.id };
  } catch {
    return { success: false, error: "Network error" };
  }
}

export async function updateInvoice(
  token: string | null,
  invoiceId: string,
  payload: {
    dueDate?: string | null;
    taxRate?: number;
    currency?: string;
    notes?: string | null;
    status?: InvoiceStatus;
  },
): Promise<{ success: boolean; error?: string }> {
  if (!token) return { success: false, error: "No token" };
  try {
    const response = await fetchWithRetry(`${apiBaseUrl}/api/admin/invoices/${invoiceId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      return { success: false, error: body.message ?? "Failed to update invoice" };
    }
    return { success: true };
  } catch {
    return { success: false, error: "Network error" };
  }
}

export async function addInvoiceLineItem(
  token: string | null,
  invoiceId: string,
  payload: {
    description?: string;
    developerName?: string;
    developerRole?: string;
    hourlyRate?: number;
    hoursWorked?: number;
    amount?: number;
  },
): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!token) return { success: false, error: "No token" };
  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/invoices/${invoiceId}/line-items`,
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
      return { success: false, error: body.message ?? "Failed to add line item" };
    }
    const data = (await response.json()) as { id: string };
    return { success: true, id: data.id };
  } catch {
    return { success: false, error: "Network error" };
  }
}

export async function updateInvoiceLineItem(
  token: string | null,
  invoiceId: string,
  lineId: string,
  payload: {
    description?: string | null;
    developerName?: string | null;
    developerRole?: string | null;
    hourlyRate?: number;
    hoursWorked?: number;
    amount?: number;
  },
): Promise<{ success: boolean; error?: string }> {
  if (!token) return { success: false, error: "No token" };
  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/invoices/${invoiceId}/line-items/${lineId}`,
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
      return { success: false, error: body.message ?? "Failed to update line item" };
    }
    return { success: true };
  } catch {
    return { success: false, error: "Network error" };
  }
}

export async function deleteInvoiceLineItem(
  token: string | null,
  invoiceId: string,
  lineId: string,
): Promise<boolean> {
  if (!token) return false;
  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/invoices/${invoiceId}/line-items/${lineId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );
    return response.ok;
  } catch {
    return false;
  }
}

export async function sendInvoiceToCompany(
  token: string | null,
  invoiceId: string,
): Promise<{ success: boolean; error?: string }> {
  if (!token) return { success: false, error: "No token" };
  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/invoices/${invoiceId}/send`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      return { success: false, error: body.message ?? "Failed to send invoice" };
    }
    return { success: true };
  } catch {
    return { success: false, error: "Network error" };
  }
}

export async function updateInvoiceStatus(
  token: string | null,
  invoiceId: string,
  status: InvoiceStatus,
): Promise<Invoice | null> {
  if (!token) return null;

  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/invoices/${invoiceId}/status`,
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
    return (await response.json()) as Invoice;
  } catch {
    return null;
  }
}

export async function deleteInvoice(
  token: string | null,
  invoiceId: string,
): Promise<boolean> {
  if (!token) return false;

  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/invoices/${invoiceId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );

    return response.ok;
  } catch {
    return false;
  }
}
