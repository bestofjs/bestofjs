"use client";

import { ClientDataTable } from "@/components/ui/client-data-table";

import { columns } from "./columns";
import type { AdminTag as Tag } from "./get-tags";

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
