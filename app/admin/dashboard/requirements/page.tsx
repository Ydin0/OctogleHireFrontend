import { auth } from "@clerk/nextjs/server";

import { fetchAdminRequirements } from "@/lib/api/admin";
import { RequirementsClient } from "./_components/requirements-client";

interface RequirementsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    isFeatured?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export default async function RequirementsPage({
  searchParams,
}: RequirementsPageProps) {
  const { getToken } = await auth();
  const token = await getToken();

  const sp = await searchParams;

  const effectiveStatus = sp.status ?? "open";

  // Fetch current page data AND counts for all statuses in parallel
  const [data, allData, openData, filledData, closedData] = await Promise.all([
    fetchAdminRequirements(token, {
      page: sp.page ? Number(sp.page) : 1,
      limit: sp.limit ? Number(sp.limit) : 20,
      search: sp.search,
      status: effectiveStatus === "all" ? undefined : effectiveStatus,
      isFeatured: sp.isFeatured,
      sortBy: sp.sortBy,
      sortOrder: sp.sortOrder,
    }),
    fetchAdminRequirements(token, { limit: 1, search: sp.search, isFeatured: sp.isFeatured }),
    fetchAdminRequirements(token, { limit: 1, status: "open", search: sp.search, isFeatured: sp.isFeatured }),
    fetchAdminRequirements(token, { limit: 1, status: "filled", search: sp.search, isFeatured: sp.isFeatured }),
    fetchAdminRequirements(token, { limit: 1, status: "closed", search: sp.search, isFeatured: sp.isFeatured }),
  ]);

  const statusCounts = {
    all: allData?.pagination.total ?? 0,
    open: openData?.pagination.total ?? 0,
    filled: filledData?.pagination.total ?? 0,
    closed: closedData?.pagination.total ?? 0,
  };

  return (
    <RequirementsClient
      requirements={data?.requirements ?? []}
      pagination={data?.pagination ?? { page: 1, limit: 20, total: 0, totalPages: 0 }}
      token={token!}
      statusCounts={statusCounts}
    />
  );
}
