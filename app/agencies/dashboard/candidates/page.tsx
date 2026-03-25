import { auth } from "@clerk/nextjs/server";

import { fetchUnifiedCandidates, fetchAgencyTeam } from "@/lib/api/agencies";
import { CandidatesClient } from "./_components/candidates-client";

interface CandidatesPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    source?: string;
    sourcedBy?: string;
    sortBy?: string;
    sortOrder?: string;
    stack?: string;
    location?: string;
    expMin?: string;
    expMax?: string;
  }>;
}

export default async function AgencyCandidatesPage({
  searchParams,
}: CandidatesPageProps) {
  const { getToken } = await auth();
  const token = await getToken();
  const params = await searchParams;

  const [result, teamMembers] = await Promise.all([
    fetchUnifiedCandidates(token, {
      page: params.page ? parseInt(params.page) : 1,
      limit: params.limit ? parseInt(params.limit) : 20,
      search: params.search,
      status: params.status,
      source: params.source,
      sourcedBy: params.sourcedBy,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
      stack: params.stack,
      location: params.location,
      expMin: params.expMin,
      expMax: params.expMax,
    }),
    fetchAgencyTeam(token),
  ]);

  const candidates = result?.candidates ?? [];
  const pagination = result?.pagination ?? {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  };

  const sourcers = (teamMembers ?? []).map((m) => ({
    userId: m.userId,
    name: m.name,
  }));

  return (
    <CandidatesClient
      candidates={candidates}
      pagination={pagination}
      sourcers={sourcers}
    />
  );
}
