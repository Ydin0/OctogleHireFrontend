import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  crossOrigin: "anonymous",
  productionBrowserSourceMaps: false,
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "date-fns",
      "recharts",
      "@radix-ui/react-icons",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org",
      },
      {
        protocol: "https",
        hostname: "deifkwefumgah.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "/s2/favicons**",
      },
      {
        // Cloudflare R2 public buckets serve from pub-<id>.r2.dev — review
        // avatars and logos uploaded via /reviews live here.
        protocol: "https",
        hostname: "*.r2.dev",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

// Trigger Velite build (Turbopack-compatible)
import("velite").then((mod) => mod.build({ watch: process.env.NODE_ENV === "development", clean: process.env.NODE_ENV !== "development" }));

export default nextConfig;
