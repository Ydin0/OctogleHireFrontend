import { auth } from "@clerk/nextjs/server";

import {
  fetchMarketplaceRequirements,
  type MarketplaceParams,
} from "@/lib/api/agencies";
import { MarketplaceClient } from "./_components/marketplace-client";

export default async function AgencyMarketplacePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { getToken } = await auth();
  const token = await getToken();

  const raw = await searchParams;
  const params: MarketplaceParams = {};
  for (const key of [
    "search",
    "experienceLevel",
    "engagementType",
    "techStack",
    "priority",
    "budgetMin",
    "budgetMax",
    "sortBy",
    "sortOrder",
    "page",
    "limit",
  ] as const) {
    const val = raw[key];
    if (typeof val === "string" && val) {
      (params as Record<string, string>)[key] = val;
    }
  }

  if (!params.limit) params.limit = "20";

  const data = await fetchMarketplaceRequirements(token, params);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Requirements</h1>
          <p className="text-sm text-muted-foreground">
            Browse open positions and pitch your candidates.
          </p>
        </div>
      </div>

      <MarketplaceClient
        requirements={data?.requirements ?? []}
        pagination={
          data?.pagination ?? { page: 1, limit: 20, total: 0, totalPages: 0 }
        }
        filterOptions={
          data?.filterOptions ?? {
            experienceLevels: [],
            engagementTypes: [],
            techStacks: [],
            priorities: [],
          }
        }
        activeParams={params}
      />
    </>
  );
}
