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

  const data = await fetchAdminRequirements(token, {
    page: sp.page ? Number(sp.page) : 1,
    limit: sp.limit ? Number(sp.limit) : 20,
    search: sp.search,
    status: sp.status,
    isFeatured: sp.isFeatured,
    sortBy: sp.sortBy,
    sortOrder: sp.sortOrder,
  });

  return (
    <RequirementsClient
      requirements={data?.requirements ?? []}
      pagination={data?.pagination ?? { page: 1, limit: 20, total: 0, totalPages: 0 }}
      token={token!}
    />
  );
}
