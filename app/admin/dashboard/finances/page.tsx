import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import {
  fetchAdminFinanceSummary,
  fetchAdminRevenueTrend,
  fetchAdminEngagements,
} from "@/lib/api/admin";
import { fetchUserRole } from "@/lib/auth/fetch-user-role";
import { FinancesClient } from "./_components/finances-client";

export default async function AdminFinancesPage() {
  const { getToken } = await auth();
  const token = await getToken();
  const { isSuperAdmin } = await fetchUserRole(token);

  if (!isSuperAdmin) {
    redirect("/admin/dashboard");
  }

  const [summary, trend, engagements] = await Promise.all([
    fetchAdminFinanceSummary(token),
    fetchAdminRevenueTrend(token),
    fetchAdminEngagements(token),
  ]);

  return (
    <FinancesClient
      summary={summary}
      trend={trend}
      engagements={engagements}
    />
  );
}
