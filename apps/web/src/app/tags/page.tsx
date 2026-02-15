"use cache";
import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";

import { findTagsWithProjects } from "@repo/db/tags";

import { TagsDataTable } from "./tags-data-table";
import { TagsPageShell } from "./tags-page-shell";

export const metadata: Metadata = {
  title: "All Tags",
};

export default async function TagsPage() {
  cacheLife("hours"); // Time-based: after 1h, next request serves cached then revalidates in background; later users get fresh data.
  cacheTag("tags"); // On-demand: revalidateTag("tags") or ?tag=tags when tags are updated.

  const tags = await findTagsWithProjects();

  return (
    <TagsPageShell>
      <TagsDataTable tags={tags} />
    </TagsPageShell>
  );
}
