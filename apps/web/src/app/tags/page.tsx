import type { Metadata } from "next";
import { cacheLife } from "next/cache";

import { currentApp, type WebApp } from "@/config/apps";
import { cacheTagForApp } from "@/server/cache";
import { markdownMetadata } from "@/server/markdown/metadata";

import { getTagsData } from "./page-data";
import { TagsDataTable } from "./tags-data-table";
import { TagsPageShell } from "./tags-page-shell";

export const metadata: Metadata = {
  title: "All Tags",
  ...markdownMetadata("/tags"),
};

export default async function TagsPage() {
  return renderTagsPage(currentApp);
}

// A page component can't take extra arguments, so the cached rendering is
// split into this inner function: `app` needs to be a real parameter (not a
// module-scope import) since Next's "use cache" excludes module-scope values
// from the cache key (github.com/vercel/next.js#74498).
async function renderTagsPage(app: WebApp) {
  "use cache";
  cacheLife("hours"); // Time-based: after 1h, next request serves cached then revalidates in background; later users get fresh data.
  cacheTagForApp(app, "tags"); // On-demand: ?api/revalidate?tag=<tag>

  const tags = await getTagsData(app);

  return (
    <TagsPageShell>
      <TagsDataTable tags={tags} />
    </TagsPageShell>
  );
}
