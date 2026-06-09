import { auth } from "@clerk/nextjs/server";

import {
  fetchInvoices,
  fetchInvoiceSummary,
  type InvoiceFilters,
} from "@/lib/api/invoices";
import { fetchAdminEngagements } from "@/lib/api/admin";
import { fetchCompanies } from "@/lib/api/companies";
import { fetchUserRole } from "@/lib/auth/fetch-user-role";
import { InvoicesClient } from "./_components/invoices-client";

interface InvoicesPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    companyIds?: string;
    developerIds?: string;
    currencies?: string;
    issuedFrom?: string;
    issuedTo?: string;
    dueFrom?: string;
    dueTo?: string;
    periodFrom?: string;
    periodTo?: string;
    minTotal?: string;
    maxTotal?: string;
    overdueOnly?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

const SORT_KEYS = new Set([
  "issuedAt",
  "dueDate",
  "total",
  "status",
  "companyName",
  "invoiceNumber",
]);

function parseFilters(sp: Awaited<InvoicesPageProps["searchParams"]>): InvoiceFilters {
  const csv = (v: string | undefined): string[] | undefined =>
    v
      ? v
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : undefined;
  const num = (v: string | undefined): number | undefined => {
    if (!v) return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };

  return {
    search: sp.search?.trim() || undefined,
    statuses: csv(sp.status),
    companyIds: csv(sp.companyIds),
    developerIds: csv(sp.developerIds),
    currencies: csv(sp.currencies),
    issuedFrom: sp.issuedFrom,
    issuedTo: sp.issuedTo,
    dueFrom: sp.dueFrom,
    dueTo: sp.dueTo,
    periodFrom: sp.periodFrom,
    periodTo: sp.periodTo,
    minTotal: num(sp.minTotal),
    maxTotal: num(sp.maxTotal),
    overdueOnly: sp.overdueOnly === "true",
    sortBy:
      sp.sortBy && SORT_KEYS.has(sp.sortBy)
        ? (sp.sortBy as InvoiceFilters["sortBy"])
        : "issuedAt",
    sortOrder: sp.sortOrder === "asc" ? "asc" : "desc",
    page: num(sp.page) ?? 1,
    limit: num(sp.limit) ?? 20,
  };
}

export default async function InvoicesPage({ searchParams }: InvoicesPageProps) {
  const { getToken } = await auth();
  const token = await getToken();

  const sp = await searchParams;
  const filters = parseFilters(sp);

  // Fetch list + summary with the SAME filters so KPIs match the visible page.
  // Companies + engagements drive the filter comboboxes and the Create dialog.
  const [listResp, summary, engagements, companies, { isSuperAdmin }] =
    await Promise.all([
      fetchInvoices(token, filters),
      fetchInvoiceSummary(token, filters),
      fetchAdminEngagements(token),
      fetchCompanies(token),
      fetchUserRole(token),
    ]);

  const fallbackSummary = {
    totalInvoices: 0,
    totalRevenue: 0,
    totalPaid: 0,
    totalOutstanding: 0,
    overdueCount: 0,
    agingBuckets: { current: 0, d1to30: 0, d31to60: 0, d61to90: 0, d90plus: 0 },
    monthlyRevenue: [],
    topClientsByOutstanding: [],
    avgDaysToPayLast90Days: null,
  };

  return (
    <InvoicesClient
      invoices={listResp?.invoices ?? []}
      pagination={
        listResp?.pagination ?? {
          page: filters.page ?? 1,
          limit: filters.limit ?? 20,
          total: 0,
          totalPages: 1,
        }
      }
      summary={summary ?? fallbackSummary}
      engagements={engagements}
      companies={(companies ?? []).map((c) => ({
        id: c.id,
        name: c.companyName,
        logoUrl: c.logoUrl ?? null,
      }))}
      filters={filters}
      token={token!}
      isSuperAdmin={isSuperAdmin}
    />
  );
}
