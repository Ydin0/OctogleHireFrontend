import type { MetadataRoute } from "next";

import { getPublishedPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/seo";
import {
  getAllTechSlugs,
  getAllRoleSlugs,
  getAllCountrySlugs,
  getAllTechCountryCombinations,
} from "@/lib/seo-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPublishedPosts();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/marketplace`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/apply`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/companies/signup`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Blog posts
  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // /hire/[slug] — technology pages
  const techPages: MetadataRoute.Sitemap = getAllTechSlugs().map((slug) => ({
    url: `${SITE_URL}/hire/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // /hire/[slug] — role pages
  const rolePages: MetadataRoute.Sitemap = getAllRoleSlugs().map((slug) => ({
    url: `${SITE_URL}/hire/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // /hire/developers-in/[country]
  const countryPages: MetadataRoute.Sitemap = getAllCountrySlugs().map(
    (slug) => ({
      url: `${SITE_URL}/hire/developers-in/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    }),
  );

  // /hire/[tech]/in/[country]
  const techCountryPages: MetadataRoute.Sitemap =
    getAllTechCountryCombinations().map(({ tech, country }) => ({
      url: `${SITE_URL}/hire/${tech}/in/${country}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  return [
    ...staticPages,
    ...blogEntries,
    ...techPages,
    ...rolePages,
    ...countryPages,
    ...techCountryPages,
  ];
}
