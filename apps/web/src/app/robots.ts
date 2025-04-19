import { MetadataRoute } from "next";

import { APP_CANONICAL_URL } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${APP_CANONICAL_URL}/sitemap.xml`,
  };
}
