import { fetchWithRetry } from "./fetch-with-retry";
import {
  DEFAULT_MARKETPLACE_SETTINGS,
  type MarketplaceSettings,
} from "@/lib/data/developers";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

/** Read the marketplace-wide settings (admin-scoped). Falls back to defaults. */
export async function fetchMarketplaceSettings(
  token: string | null
): Promise<MarketplaceSettings> {
  if (!token) return DEFAULT_MARKETPLACE_SETTINGS;
  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/marketplace/settings`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );
    if (!response.ok) return DEFAULT_MARKETPLACE_SETTINGS;
    const data = (await response.json()) as { settings: MarketplaceSettings };
    return data.settings ?? DEFAULT_MARKETPLACE_SETTINGS;
  } catch {
    return DEFAULT_MARKETPLACE_SETTINGS;
  }
}

/** Persist marketplace-wide settings. */
export async function updateMarketplaceSettings(
  token: string | null,
  settings: MarketplaceSettings
): Promise<{ settings: MarketplaceSettings } | null> {
  if (!token) return null;
  try {
    const response = await fetchWithRetry(
      `${apiBaseUrl}/api/admin/marketplace/settings`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ settings }),
        cache: "no-store",
      }
    );
    if (!response.ok) return null;
    return (await response.json()) as { settings: MarketplaceSettings };
  } catch {
    return null;
  }
}
