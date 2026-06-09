import { auth } from "@clerk/nextjs/server";

import { fetchMarketplaceSettings } from "@/lib/api/admin-marketplace";
import { fetchPublicDevelopers } from "@/lib/api/public-developers";
import {
  AdminPreviewBar,
  MarketplaceBrowse,
} from "@/components/marketplace/marketplace-browse";

export default async function MarketplacePreviewPage() {
  const { getToken } = await auth();
  const token = await getToken();

  const [devResult, settings] = await Promise.all([
    fetchPublicDevelopers({ limit: 60 }),
    fetchMarketplaceSettings(token),
  ]);

  return (
    <MarketplaceBrowse
      developers={devResult?.developers ?? []}
      settings={settings}
      topBar={<AdminPreviewBar />}
    />
  );
}
