import { auth } from "@clerk/nextjs/server";

import { fetchUserRole } from "@/lib/auth/fetch-user-role";
import { PayoutDetailClient } from "./_components/payout-detail-client";

export default async function PayoutDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { getToken } = await auth();
  const token = await getToken();
  const { isSuperAdmin } = await fetchUserRole(token);

  return <PayoutDetailClient params={params} isSuperAdmin={isSuperAdmin} />;
}
