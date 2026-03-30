interface Window {
  gtag: (
    command: "config" | "event" | "set" | "js",
    targetOrAction: string | Date,
    params?: Record<string, unknown>,
  ) => void;
  dataLayer: Record<string, unknown>[];
  fbq: (
    command: "track" | "trackCustom" | "init",
    eventOrPixelId: string,
    params?: Record<string, unknown>,
    options?: { eventID?: string },
  ) => void;
}
