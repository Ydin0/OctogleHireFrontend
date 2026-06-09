import { auth } from "@clerk/nextjs/server";

import { fetchCompanyEngagements, fetchCompanyProfile } from "@/lib/api/companies";
import { HiresConsole } from "./_components/hires-console";

export default async function EngagementsPage() {
  const { getToken } = await auth();
  const token = await getToken();

  const [engagements, companyProfile] = await Promise.all([
    fetchCompanyEngagements(token),
    fetchCompanyProfile(token),
  ]);

  return (
    <HiresConsole
      engagements={engagements ?? []}
      token={token!}
      companyId={companyProfile?.id}
      companyName={companyProfile?.companyName}
      companyLogoUrl={companyProfile?.logoUrl}
    />
  );
}
