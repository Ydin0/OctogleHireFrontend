import { fetchWithRetry } from "./fetch-with-retry";
import {
  DEFAULT_MARKETPLACE_SETTINGS,
  type MarketplaceSettings,
} from "@/lib/data/developers";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

/** Public read of the marketplace-wide settings. Falls back to defaults. */
export async function fetchPublicMarketplaceSettings(): Promise<MarketplaceSettings> {
  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/public/marketplace/settings`,
      {
        method: "GET",
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      }
    );
    if (!response.ok) return DEFAULT_MARKETPLACE_SETTINGS;
    const data = (await response.json()) as { settings: MarketplaceSettings };
    return data.settings ?? DEFAULT_MARKETPLACE_SETTINGS;
  } catch {
    return DEFAULT_MARKETPLACE_SETTINGS;
  }
}
