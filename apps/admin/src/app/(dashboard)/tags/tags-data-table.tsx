"use client";

import type { findTags } from "@repo/db/tags";

import { ClientDataTable } from "@/components/ui/client-data-table";

import { columns } from "./columns";

type Tag = Awaited<ReturnType<typeof findTags>>[0];

type Props = {
  tags: Tag[];
};

export function TagsDataTable({ tags }: Props) {
  return (
    <ClientDataTable
      columns={columns}
      data={tags}
      getRowId={(tag) => tag.code}
    />
  );
}
