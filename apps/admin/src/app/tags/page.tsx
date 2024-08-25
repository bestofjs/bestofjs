import { findTags } from "@repo/db/tags";

import { AddTagButton } from "@/components/add-tag-button";
import { Badge } from "@/components/ui/badge";

import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function TagsPage() {
  const tags = await findTags();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="flex scroll-m-20 items-center gap-2 text-3xl font-extrabold tracking-tight lg:text-4xl">
          Tags
          <Badge className="text-sm">{tags.length}</Badge>
        </h1>
        <AddTagButton />
      </div>
      <DataTable columns={columns} data={tags} />
    </div>
  );
}
