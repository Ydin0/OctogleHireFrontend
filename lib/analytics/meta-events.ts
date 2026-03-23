/**
 * Fire a Meta Pixel standard event (client-side).
 * Safe to call server-side — it no-ops when `window` is undefined.
 */
export function trackMetaEvent(
  event: string,
  params?: Record<string, unknown>,
) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", event, params);
}
