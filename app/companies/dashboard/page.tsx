import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { CompanyOverviewClient } from "./_components/company-overview-client";
import {
  fetchCompanyRequirements,
  fetchCompanyTeam,
  fetchCompanyEngagements,
  fetchCompanyProfile,
  fetchCompanyAgreements,
} from "@/lib/api/companies";

export default async function CompanyOverviewPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/login");

  const token = await getToken();

  const [requirements, team, engagements, profile, agreements] = await Promise.all([
    fetchCompanyRequirements(token),
    fetchCompanyTeam(token),
    fetchCompanyEngagements(token),
    fetchCompanyProfile(token),
    fetchCompanyAgreements(token),
  ]);

  return (
    <CompanyOverviewClient
      requirements={requirements ?? []}
      team={team ?? []}
      engagements={engagements ?? []}
      profile={profile}
      pendingAgreements={agreements.filter((a) => a.status === "pending").length}
    />
  );
}
