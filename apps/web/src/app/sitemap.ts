import type { MetadataRoute } from "next";

import { findTags } from "@/app/db";
import { APP_CANONICAL_URL } from "@/config/site";

const NUMBER_OF_POPULAR_TAGS = 10;

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

/**
 * Sorted and sliced in JS rather than in SQL, mirroring the home page's popular
 * tags (`(home)/layout.tsx`): there are ~50 tags, so ordering and limiting them
 * is not worth extra options on the shared `findTags()` query.
 */
async function getPopularTags() {
  const tags = await findTags();
  return tags
    .toSorted((a, b) => b.count - a.count)
    .slice(0, NUMBER_OF_POPULAR_TAGS);
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
