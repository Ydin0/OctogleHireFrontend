import { auth } from "@clerk/nextjs/server";

import { fetchUnifiedCandidates } from "@/lib/api/agencies";
import { CandidatesClient } from "./_components/candidates-client";

interface CandidatesPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    source?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export default async function AgencyCandidatesPage({
  searchParams,
}: CandidatesPageProps) {
  const { getToken } = await auth();
  const token = await getToken();
  const params = await searchParams;

  const result = await fetchUnifiedCandidates(token, {
    page: params.page ? parseInt(params.page) : 1,
    limit: params.limit ? parseInt(params.limit) : 20,
    search: params.search,
    status: params.status,
    source: params.source,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
  });

  const candidates = result?.candidates ?? [];
  const pagination = result?.pagination ?? {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  };

  return <CandidatesClient candidates={candidates} pagination={pagination} />;
}
