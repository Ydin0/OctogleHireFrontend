import { auth } from "@clerk/nextjs/server";

import { fetchAdminStats, fetchApplications } from "@/lib/api/admin";
import { MarketplaceClient } from "./_components/marketplace-client";

interface MarketplacePageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function AdminMarketplacePage({
  searchParams,
}: MarketplacePageProps) {
  const { getToken } = await auth();
  const token = await getToken();
  const params = await searchParams;

  const tab = params.tab ?? "live";

  // Map the tab to backend filters (reuses GET /api/admin/applications).
  const filters: { isLive?: string; status?: string } = {};
  if (tab === "live") filters.isLive = "true";
  else if (tab === "approved") filters.status = "approved";

  const [result, stats] = await Promise.all([
    fetchApplications(token, {
      page: params.page ? parseInt(params.page) : 1,
      limit: params.limit ? parseInt(params.limit) : 20,
      search: params.search,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
      ...filters,
    }),
    fetchAdminStats(token),
  ]);

  const applications = result?.applications ?? [];
  const pagination = result?.pagination ?? {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  };

  return (
    <MarketplaceClient
      applications={applications}
      pagination={pagination}
      liveCount={stats?.liveCount ?? 0}
    />
  );
}
