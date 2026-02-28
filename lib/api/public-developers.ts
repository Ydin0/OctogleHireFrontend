import type { Developer } from "@/lib/data/developers";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

interface FetchPublicDevelopersParams {
  page?: number;
  limit?: number;
  featured?: boolean;
}

interface PublicDevelopersPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export async function fetchPublicDevelopers(
  params: FetchPublicDevelopersParams = {},
): Promise<{ developers: Developer[]; pagination: PublicDevelopersPagination } | null> {
  try {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.featured) searchParams.set("featured", "true");

    const qs = searchParams.toString();
    const url = `${apiBaseUrl}/api/public/developers${qs ? `?${qs}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) return null;
    return (await response.json()) as {
      developers: Developer[];
      pagination: PublicDevelopersPagination;
    };
  } catch {
    return null;
  }
}

export async function fetchPublicDeveloper(
  slug: string,
): Promise<Developer | null> {
  try {
    const response = await fetch(
      `${apiBaseUrl}/api/public/developers/${encodeURIComponent(slug)}`,
      {
        method: "GET",
        next: { revalidate: 60 },
        signal: AbortSignal.timeout(10_000),
      },
    );

    if (!response.ok) return null;
    const data = (await response.json()) as { developer: Developer };
    return data.developer;
  } catch {
    return null;
  }
}
