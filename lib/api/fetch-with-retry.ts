/**
 * Wrapper around fetch that retries on transient failures (404 during deploys, network errors).
 * Only retries on 404 (route not found during rolling deploy) and network errors.
 * Non-retryable errors (400, 401, 403, 500) are returned immediately.
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 2
): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);

      if (res.status === 404 && attempt < retries) {
        await new Promise((r) => setTimeout(r, 800));
        continue;
      }

      return res;
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, 800));
    }
  }

  throw new Error("Request failed after retries");
}
