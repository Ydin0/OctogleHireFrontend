import { auth } from "@clerk/nextjs/server";

import { fetchCompanyEngagements, fetchCompanyProfile } from "@/lib/api/companies";
import { EngagementsClient } from "./_components/engagements-client";

export default async function EngagementsPage() {
  const { getToken } = await auth();
  const token = await getToken();

  const [engagements, companyProfile] = await Promise.all([
    fetchCompanyEngagements(token),
    fetchCompanyProfile(token),
  ]);

  return (
    <EngagementsClient
      engagements={engagements ?? []}
      token={token!}
      companyId={companyProfile?.id}
      companyName={companyProfile?.companyName}
      companyLogoUrl={companyProfile?.logoUrl}
    />
  );
}
