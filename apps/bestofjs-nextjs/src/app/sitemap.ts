import { MetadataRoute } from "next";

import { APP_CANONICAL_URL } from "@/config/site";
import { api } from "@/server/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tagSearchPages = await getTagSearchPages();

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
      url: `${APP_CANONICAL_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.1,
    },
    ...tagSearchPages,
  ];
}

async function getPopularTags() {
  const { tags } = await api.tags.findTags({ sort: { count: -1 }, limit: 10 });
  return tags;
}

async function getTagSearchPages(): Promise<MetadataRoute.Sitemap> {
  const tags = await getPopularTags();
  return tags
    .map((tag) => tag.code)
    .map((tag) => ({
      url: escapeURL(`${APP_CANONICAL_URL}/projects?tags=${tag}&sort=weekly`),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
    }));
}

function escapeURL(url: string) {
  return url.replace(/&/g, "&amp;");
}
