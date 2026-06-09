import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { fetchPublicDevelopers } from "@/lib/api/public-developers";
import { fetchPublicMarketplaceSettings } from "@/lib/api/public-marketplace";
import { DiscoverConsole } from "./_components/discover-console";

export default async function CompanyDiscoverPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

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
