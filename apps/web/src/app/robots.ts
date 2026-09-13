import type { MetadataRoute } from "next";

import { isMainApp } from "@/config/apps";
import { APP_CANONICAL_URL } from "@/config/site";

/**
 * Only the main deployment is crawlable.
 *
 * The deployments serve ~99% identical pages and share a single hardcoded
 * `APP_CANONICAL_URL`, so an indexable variant would put near-duplicate content
 * in competition with Best of JS *and* serve a sitemap listing another domain's
 * URLs. Best of JS is the canonical app; the variant is reached through the
 * link on the main site, not through search.
 *
 * The upgrade path, if the variant proves itself: derive `APP_CANONICAL_URL`
 * from `hostByApp[currentApp]` — robots, sitemap and every `og:url` follow
 * automatically — and then decide separately whether variant pages consolidate
 * into bestofjs.org (`alternates.canonical`) or rank on their own.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isMainApp) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${APP_CANONICAL_URL}/sitemap.xml`,
  };
}
