/**
 * Fire a Meta Pixel standard event (client-side).
 * Safe to call server-side — it no-ops when `window` is undefined.
 *
 * Pass `eventId` to enable browser ↔ CAPI deduplication.
 * Meta will collapse two events with the same event_name + event_id into one.
 */
export function trackMetaEvent(
  event: string,
  params?: Record<string, unknown>,
  eventId?: string,
) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  if (eventId) {
    window.fbq("track", event, params, { eventID: eventId });
  } else {
    window.fbq("track", event, params);
  }
}
