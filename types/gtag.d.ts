interface Window {
  gtag: (
    command: "config" | "event" | "set" | "js",
    targetOrAction: string | Date,
    params?: Record<string, unknown>,
  ) => void;
  dataLayer: Record<string, unknown>[];
}
