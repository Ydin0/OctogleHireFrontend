import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { fetchPublicDevelopers } from "@/lib/api/public-developers";
import { fetchPublicMarketplaceSettings } from "@/lib/api/public-marketplace";
import { fetchCompanyProfile } from "@/lib/api/companies";
import { DiscoverConsole } from "./_components/discover-console";

export default async function CompanyDiscoverPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/login");

  // Companies whose marketplace view is disabled are account-manager-led only.
  const profile = await fetchCompanyProfile(await getToken());
  if (profile && profile.marketplaceEnabled === false) {
    redirect("/companies/dashboard/requirements");
  }

  const [devResult, settings] = await Promise.all([
    fetchPublicDevelopers({ limit: 60 }),
    fetchPublicMarketplaceSettings(),
  ]);

  return (
    <DiscoverConsole
      developers={devResult?.developers ?? []}
      settings={settings}
    />
  );
}
