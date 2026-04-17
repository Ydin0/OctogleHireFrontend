import { auth } from "@clerk/nextjs/server";

import { fetchInvoices, fetchInvoiceSummary } from "@/lib/api/invoices";
import { fetchAdminEngagements } from "@/lib/api/admin";
import { fetchUserRole } from "@/lib/auth/fetch-user-role";
import { InvoicesClient } from "./_components/invoices-client";

export default async function InvoicesPage() {
  const { getToken } = await auth();
  const token = await getToken();

  const [invoices, summary, engagements, { isSuperAdmin }] = await Promise.all([
    fetchInvoices(token),
    fetchInvoiceSummary(token),
    fetchAdminEngagements(token),
    fetchUserRole(token),
  ]);

  return (
    <InvoicesClient
      invoices={invoices ?? []}
      summary={summary ?? { totalInvoices: 0, totalRevenue: 0, totalPaid: 0, totalOutstanding: 0, overdueCount: 0 }}
      engagements={engagements}
      token={token!}
      isSuperAdmin={isSuperAdmin}
    />
  );
}
