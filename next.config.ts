import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ],
  },
};

// Trigger Velite build (Turbopack-compatible)
import("velite").then((mod) => mod.build({ watch: process.env.NODE_ENV === "development", clean: process.env.NODE_ENV !== "development" }));

export default nextConfig;
