import { findTags } from "@repo/db/tags";

import { AddTagButton } from "@/components/add-tag-button";
import { Badge } from "@/components/ui/badge";

import { TagsDataTable } from "./tags-data-table";

export default async function TagsPage() {
  const tags = await findTags();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="flex scroll-m-20 items-center gap-2 font-extrabold text-3xl tracking-tight lg:text-4xl">
          Tags
          <Badge className="text-sm">{tags.length}</Badge>
        </h1>
        <AddTagButton />
      </div>
      <TagsDataTable tags={tags} />
    </div>
  );
}
