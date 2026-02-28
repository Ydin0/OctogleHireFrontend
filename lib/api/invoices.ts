import type { InvoiceStatus } from "@/app/admin/dashboard/_components/dashboard-data";
import {
  getMockInvoices,
  getMockInvoiceById,
  getMockInvoicesByCompanyId,
  getMockInvoiceSummary,
  getMockCompanyInvoiceSummary,
} from "@/lib/data/mock-invoices";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

// ── Types ────────────────────────────────────────────────────────────────────

export interface InvoiceLineItem {
  id: string;
  developerId: string;
  developerName: string;
  developerRole: string;
  requirementTitle: string;
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
  lineItems: InvoiceLineItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceSummary {
  totalInvoices: number;
  totalRevenue: number;
  totalPaid: number;
  totalOutstanding: number;
  overdueCount: number;
}

// ── API Functions ────────────────────────────────────────────────────────────

export async function fetchInvoices(
  token: string | null,
): Promise<Invoice[] | null> {
  if (!token) return null;

  try {
    const response = await fetch(`${apiBaseUrl}/api/admin/invoices`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 },
    });

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as Invoice[];
  } catch {
    return getMockInvoices();
  }
}

export async function fetchInvoice(
  token: string | null,
  id: string,
): Promise<Invoice | null> {
  if (!token) return null;

  try {
    const response = await fetch(`${apiBaseUrl}/api/admin/invoices/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 },
    });

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as Invoice;
  } catch {
    return getMockInvoiceById(id) ?? null;
  }
}

export async function fetchInvoicesByCompany(
  token: string | null,
  companyId: string,
): Promise<Invoice[] | null> {
  if (!token) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/admin/invoices?companyId=${companyId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 60 },
      },
    );

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as Invoice[];
  } catch {
    return getMockInvoicesByCompanyId(companyId);
  }
}

export async function fetchInvoiceSummary(
  token: string | null,
): Promise<InvoiceSummary | null> {
  if (!token) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/admin/invoices/summary`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 60 },
      },
    );

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as InvoiceSummary;
  } catch {
    return getMockInvoiceSummary();
  }
}

export async function fetchCompanyInvoiceSummary(
  token: string | null,
  companyId: string,
): Promise<InvoiceSummary | null> {
  if (!token) return null;

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/admin/invoices/summary?companyId=${companyId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 60 },
      },
    );

    if (!response.ok) throw new Error("API error");
    return (await response.json()) as InvoiceSummary;
  } catch {
    return getMockCompanyInvoiceSummary(companyId);
  }
}

export async function updateInvoiceStatus(
  token: string | null,
  invoiceId: string,
  status: InvoiceStatus,
): Promise<Invoice | null> {
  if (!token) return null;

  try {
    const response = await fetch(
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
