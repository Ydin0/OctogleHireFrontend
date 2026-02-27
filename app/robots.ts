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
      {
        userAgent: "GPTBot",
        allow: ["/", "/blog", "/hire", "/apply", "/marketplace"],
        disallow: ["/dashboard", "/admin", "/api", "/auth", "/login"],
      },
      {
        userAgent: "ClaudeBot",
        allow: ["/", "/blog", "/hire", "/apply", "/marketplace"],
        disallow: ["/dashboard", "/admin", "/api", "/auth", "/login"],
      },
      {
        userAgent: "PerplexityBot",
        allow: ["/", "/blog", "/hire", "/apply", "/marketplace"],
        disallow: ["/dashboard", "/admin", "/api", "/auth", "/login"],
      },
      {
        userAgent: "Google-Extended",
        allow: ["/", "/blog", "/hire", "/apply", "/marketplace"],
        disallow: ["/dashboard", "/admin", "/api", "/auth", "/login"],
      },
    ],
    sitemap: "https://octoglehire.com/sitemap.xml",
  };
}
