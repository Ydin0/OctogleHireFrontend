import { auth } from "@clerk/nextjs/server";

import { fetchUserRole } from "@/lib/auth/fetch-user-role";
import { InvoiceDetailClient } from "./_components/invoice-detail-client";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { getToken } = await auth();
  const token = await getToken();
  const { isSuperAdmin } = await fetchUserRole(token);

  return <InvoiceDetailClient params={params} isSuperAdmin={isSuperAdmin} />;
}
