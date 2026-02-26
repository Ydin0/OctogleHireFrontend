import { auth } from "@clerk/nextjs/server";

import { fetchApplications, fetchFilterOptions } from "@/lib/api/admin";
import { ApplicantsClient } from "./_components/applicants-client";

interface ApplicantsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    isLive?: string;
    sortBy?: string;
    sortOrder?: string;
    professionalTitle?: string;
    stack?: string;
    location?: string;
    expMin?: string;
    expMax?: string;
    engagementType?: string;
    availability?: string;
  }>;
}

export default async function ApplicantsPage({
  searchParams,
}: ApplicantsPageProps) {
  const { getToken } = await auth();
  const token = await getToken();
  const params = await searchParams;

  const [result, filterOptions] = await Promise.all([
    fetchApplications(token, {
      page: params.page ? parseInt(params.page) : 1,
      limit: params.limit ? parseInt(params.limit) : 20,
      search: params.search,
      status: params.status,
      isLive: params.isLive,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
      professionalTitle: params.professionalTitle,
      stack: params.stack,
      location: params.location,
      expMin: params.expMin,
      expMax: params.expMax,
      engagementType: params.engagementType,
      availability: params.availability,
    }),
    fetchFilterOptions(token),
  ]);

  const applications = result?.applications ?? [];
  const pagination = result?.pagination ?? {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  };

  return (
    <ApplicantsClient
      applications={applications}
      pagination={pagination}
      currentSearch={params.search ?? ""}
      currentStatus={params.status ?? "all"}
      filterOptions={filterOptions}
      token={token!}
    />
  );
}
