import { auth } from "@clerk/nextjs/server";

import {
  fetchAdminOverview,
  type AdminOverviewFilters,
} from "@/lib/api/admin";
import { DashboardClient } from "./_components/overview/dashboard-client";

interface DashboardPageProps {
  searchParams: Promise<{
    range?: string;
    from?: string;
    to?: string;
    categories?: string;
  }>;
}

const RANGE_KEYS = new Set(["7d", "30d", "90d", "12m", "custom"]);
type RangeKey = "7d" | "30d" | "90d" | "12m" | "custom";

/** Resolve a chip key like "30d" into a concrete from/to pair. Custom and
 *  unknown values defer to whatever's in the URL. */
function resolveRange(
  range: RangeKey,
  from: string | undefined,
  to: string | undefined,
): { from: string; to: string; range: RangeKey } {
  const today = new Date();
  const iso = (d: Date) => d.toISOString().slice(0, 10);

  if (range === "custom" && from && to) {
    return { from, to, range: "custom" };
  }

  const daysBack: Record<RangeKey, number> = {
    "7d": 7,
    "30d": 30,
    "90d": 90,
    "12m": 365,
    custom: 30,
  };
  const back = new Date(today);
  back.setUTCDate(back.getUTCDate() - (daysBack[range] ?? 30) + 1);
  return { from: iso(back), to: iso(today), range };
}

export default async function AdminOverviewPage({
  searchParams,
}: DashboardPageProps) {
  const { getToken } = await auth();
  const token = await getToken();

  const sp = await searchParams;
  const rangeKey: RangeKey = (
    sp.range && RANGE_KEYS.has(sp.range) ? sp.range : "30d"
  ) as RangeKey;
  const { from, to, range } = resolveRange(rangeKey, sp.from, sp.to);
  const categories = sp.categories
    ? sp.categories
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const filters: AdminOverviewFilters = { from, to, categories, range };

  const overview = await fetchAdminOverview(token, filters);

  return (
    <DashboardClient
      overview={overview}
      filters={filters}
      token={token ?? ""}
    />
  );
}
