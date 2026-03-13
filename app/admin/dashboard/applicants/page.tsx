import { auth } from "@clerk/nextjs/server";

import { fetchApplications, fetchFilterOptions } from "@/lib/api/admin";
import { ApplicantsClient } from "./_components/applicants-client";

// All non-draft statuses for the "In Progress" tab
const IN_PROGRESS_STATUSES = [
  "hr_communication_round",
  "ai_technical_examination",
  "tech_lead_human_interview",
  "background_previous_company_checks",
  "offer_extended",
  "offer_declined",
  "approved",
  "rejected",
].join(",");

interface ApplicantsPageProps {
  searchParams: Promise<{
    tab?: string;
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

  // Resolve effective status filter from tab + manual status selection
  const tab = params.tab ?? "in_progress";
  let effectiveStatus = params.status;
  if (!effectiveStatus) {
    if (tab === "in_progress") effectiveStatus = IN_PROGRESS_STATUSES;
    else if (tab === "draft") effectiveStatus = "draft";
    // tab === "all" → no status filter
  }

  const [result, filterOptions] = await Promise.all([
    fetchApplications(token, {
      page: params.page ? parseInt(params.page) : 1,
      limit: params.limit ? parseInt(params.limit) : 20,
      search: params.search,
      status: effectiveStatus,
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
