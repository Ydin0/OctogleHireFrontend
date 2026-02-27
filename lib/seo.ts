export const SITE_URL = "https://octoglehire.com";
export const SITE_NAME = "OctogleHire";
export const DEFAULT_DESCRIPTION =
  "Connect with pre-vetted, world-class engineers from 150+ countries. Build your dream team in days, not months with OctogleHire.";

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildJsonLd(data: Record<string, unknown>) {
  return {
    __html: JSON.stringify({
      "@context": "https://schema.org",
      ...data,
    }),
  };
}
