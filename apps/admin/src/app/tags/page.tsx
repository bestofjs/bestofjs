import Link from "next/link";

import { findTags } from "@/database/tags/find";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddTagButton } from "@/components/add-tag-button";

type Tag = Awaited<ReturnType<typeof findTags>>[0];

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
      <TagList tags={tags} />
    </div>
  );
}

function TagList({ tags }: { tags: Tag[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Projects</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tags.map((tag) => (
          <TableRow key={tag.code}>
            <TableCell>
              <Link href={`/tags/${tag.code}`}>{tag.name}</Link>
            </TableCell>
            <TableCell>{tag.code}</TableCell>
            <TableCell>{tag.count}</TableCell>
            <TableCell>{tag.description || "-"}</TableCell>
            <TableCell>{tag.createdAt.toISOString().slice(0, 10)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
