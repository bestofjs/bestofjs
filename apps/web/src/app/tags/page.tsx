"use cache";
import type { Metadata } from "next";

import { findTagsWithProjects } from "@repo/db/tags";

import { TagsDataTable } from "./tags-data-table";
import { TagsPageShell } from "./tags-page-shell";

export const metadata: Metadata = {
  title: "All Tags",
};

export default async function TagsPage() {
  const tags = await findTagsWithProjects();

  return (
    <TagsPageShell>
      <TagsDataTable tags={tags} />
    </TagsPageShell>
  );
}
