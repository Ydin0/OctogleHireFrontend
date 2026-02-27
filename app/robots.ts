import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/admin",
          "/api",
          "/auth",
          "/apply/verify",
          "/apply/status",
          "/developers/dashboard",
          "/companies/dashboard",
          "/login",
        ],
      },
    ],
    sitemap: "https://octoglehire.com/sitemap.xml",
  };
}
