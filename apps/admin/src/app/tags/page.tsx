import Link from "next/link";

import { findTags } from "@/database/tags/find";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Tag = Awaited<ReturnType<typeof findTags>>[0];

export default async function TagsPage() {
  const tags = await findTags();
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
        Tags
      </h1>
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
          <TableHead>Description</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tags.map((tag) => (
          <TableRow key={tag.id}>
            <TableCell>
              <Link href={`/tags/${tag.code}`}>{tag.name}</Link>
            </TableCell>
            <TableCell>{tag.code}</TableCell>
            <TableCell>{tag.description || "-"}</TableCell>
            <TableCell>{tag.createdAt.toISOString().slice(0, 10)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
