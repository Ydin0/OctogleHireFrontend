import { auth } from "@clerk/nextjs/server";

import { fetchCompanies } from "@/lib/api/companies";
import { CompaniesClient } from "./_components/companies-client";

interface CompaniesPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
    reqStatus?: string;
    engagementType?: string;
    techStack?: string;
  }>;
}

export default async function CompaniesPage({
  searchParams,
}: CompaniesPageProps) {
  const { getToken } = await auth();
  const token = await getToken();

  // Await searchParams to satisfy Next.js 16 async API
  await searchParams;

  const companies = (await fetchCompanies(token)) ?? [];

  return <CompaniesClient companies={companies} token={token!} />;
}
