import { MetadataRoute } from "next";

import { APP_CANONICAL_URL } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: APP_CANONICAL_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${APP_CANONICAL_URL}/hall-of-fame`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${APP_CANONICAL_URL}/rankings/monthly`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${APP_CANONICAL_URL}/tags`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
    },
    {
      url: `${APP_CANONICAL_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
    },
    {
      url: `${APP_CANONICAL_URL}/projects?tags=react&sort=weekly`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
    },
    {
      url: `${APP_CANONICAL_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.1,
    },
  ];
}
