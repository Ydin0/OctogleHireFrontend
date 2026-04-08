"use client";

import { useEffect } from "react";
import { trackMetaEvent } from "./meta-events";

/**
 * Listens for Calendly's postMessage event when a booking is completed
 * and fires a Meta Pixel Lead event.
 *
 * @param active - Only attach the listener when true (e.g. when Calendly widget is visible)
 */
export function useCalendlyLead(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const handler = (e: MessageEvent) => {
      if (
        e.data?.event === "calendly.event_scheduled"
      ) {
        trackMetaEvent("Lead", {
          content_name: "Calendly Booking",
          content_category: "booking",
        });
        trackMetaEvent("Schedule", {
          content_name: "Calendly Booking",
          content_category: "booking",
        });
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [active]);
}
