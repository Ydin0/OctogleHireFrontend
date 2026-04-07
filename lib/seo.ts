export const SITE_URL = "https://octoglehire.com";
export const SITE_NAME = "OctogleHire";
export const DEFAULT_DESCRIPTION =
  "Connect with pre-vetted, world-class engineers from 30+ countries. Build your dream team in days, not months with OctogleHire.";

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

/** Sitewide Organization schema — referenced by @id from all pages */
export const ORGANIZATION_SCHEMA = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/octogle-logo.png`,
  description: DEFAULT_DESCRIPTION,
  foundingDate: "2024",
  sameAs: [
    "https://www.linkedin.com/company/octogle",
    "https://clutch.co/profile/octogle-technologies",
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Office 2020, Parklane Tower, Business Bay",
    addressLocality: "Dubai",
    addressCountry: "AE",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: "12",
    bestRating: "5",
    worstRating: "1",
  },
};

/** Sitewide WebSite schema — referenced by @id from all pages */
export const WEBSITE_SCHEMA = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en",
};

/** Helper to create a BreadcrumbList schema */
export function breadcrumbSchema(
  pageId: string,
  items: Array<{ name: string; url?: string }>,
) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}${pageId}/#breadcrumb`,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}

/** Helper to create a basic WebPage schema */
export function webPageSchema(opts: {
  path: string;
  name: string;
  description: string;
  dateModified?: string;
  type?: string;
}) {
  return {
    "@type": opts.type ?? "WebPage",
    "@id": `${SITE_URL}${opts.path}/#webpage`,
    url: `${SITE_URL}${opts.path}`,
    name: opts.name,
    description: opts.description,
    inLanguage: "en",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    dateModified: opts.dateModified ?? "2026-04-07",
  };
}
