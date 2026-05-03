import { auth } from "@clerk/nextjs/server";

import {
  fetchSalesRepApplications,
  fetchSalesRepFilterOptions,
} from "@/lib/api/admin-sales-rep";
import { SalesRepsClient } from "./_components/sales-reps-client";

const IN_PROGRESS_STATUSES = [
  "hr_screening",
  "discovery_interview",
  "role_play_assessment",
  "background_checks",
  "offer_extended",
  "offer_declined",
].join(",");

interface SalesRepsPageProps {
  searchParams: Promise<{
    tab?: string;
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    isLive?: string;
    sortBy?: string;
    sortOrder?: string;
    salesRoleTitle?: string;
    salesTools?: string;
    salesMethodologies?: string;
    industriesSold?: string;
    location?: string;
    expMin?: string;
    expMax?: string;
    engagementType?: string;
    availability?: string;
    agency?: string;
  }>;
}

export default async function SalesRepsPage({
  searchParams,
}: SalesRepsPageProps) {
  const { getToken } = await auth();
  const token = await getToken();
  const params = await searchParams;

  const tab = params.tab ?? "in_progress";
  let effectiveStatus = params.status;
  if (!effectiveStatus && !params.search) {
    if (tab === "in_progress") effectiveStatus = IN_PROGRESS_STATUSES;
    else if (tab === "draft") effectiveStatus = "draft";
    else if (tab === "approved") effectiveStatus = "approved";
    else if (tab === "rejected") effectiveStatus = "rejected";
  }

  const [result, filterOptions] = await Promise.all([
    fetchSalesRepApplications(token, {
      page: params.page ? parseInt(params.page) : 1,
      limit: params.limit ? parseInt(params.limit) : 20,
      search: params.search,
      status: effectiveStatus,
      isLive: params.isLive,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
      salesRoleTitle: params.salesRoleTitle,
      salesTools: params.salesTools,
      salesMethodologies: params.salesMethodologies,
      industriesSold: params.industriesSold,
      location: params.location,
      expMin: params.expMin,
      expMax: params.expMax,
      engagementType: params.engagementType,
      availability: params.availability,
      agency: params.agency,
    }),
    fetchSalesRepFilterOptions(token),
  ]);

  const applications = result?.applications ?? [];
  const pagination = result?.pagination ?? {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  };

  return (
    <SalesRepsClient
      applications={applications}
      pagination={pagination}
      filterOptions={filterOptions}
      token={token!}
    />
  );
}
