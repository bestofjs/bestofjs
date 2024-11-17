"use client";

import { findTags } from "@repo/db/tags";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

type Tag = Awaited<ReturnType<typeof findTags>>[0];

type Props = {
  tags: Tag[];
};

export function TagsDataTable({ tags }: Props) {
  return (
    <DataTable columns={columns} data={tags} getRowId={(tag) => tag.code} />
  );
}
