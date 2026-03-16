/**
 * Wrapper around fetch that retries on transient failures.
 *
 * Retries on:
 * - 404 with "Route does not exist" (Railway routing during deploys/cold starts)
 * - 502, 503, 504 (gateway/proxy errors)
 * - Network errors (fetch throws)
 *
 * Does NOT retry on:
 * - 404 with other messages (genuine "not found" from our app)
 * - 400, 401, 403, 500 (application-level errors)
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 4,
): Promise<Response> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, options);

      // Gateway/proxy errors — always retry
      if ((res.status === 502 || res.status === 503 || res.status === 504) && attempt < maxRetries) {
        await backoff(attempt);
        continue;
      }

      // 404 — only retry if it's the Railway "route does not exist" catch-all
      if (res.status === 404 && attempt < maxRetries) {
        const cloned = res.clone();
        try {
          const body = await cloned.json();
          if (body?.message === "Route does not exist." || body?.error === "not_found" && !body?.message?.includes("not found")) {
            await backoff(attempt);
            continue;
          }
        } catch {
          // Body wasn't JSON — retry anyway
          await backoff(attempt);
          continue;
        }
      }

      return res;
    } catch (err) {
      // Network error (DNS, connection refused, timeout, etc.)
      if (attempt === maxRetries) throw err;
      await backoff(attempt);
    }
  }

  throw new Error("Request failed after retries");
}

/** Exponential backoff: 500ms, 1s, 2s, 4s */
function backoff(attempt: number): Promise<void> {
  const delay = Math.min(500 * Math.pow(2, attempt), 4000);
  return new Promise((r) => setTimeout(r, delay));
}
