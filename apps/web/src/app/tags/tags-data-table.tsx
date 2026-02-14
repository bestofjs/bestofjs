"use client";

import type { TagWithProjectsItem } from "@repo/db/tags";

import { ClientDataTable } from "@/components/ui/datatable";

import { columns } from "./columns";

type Props = {
  tags: TagWithProjectsItem[];
};

function tagGlobalFilter(tag: TagWithProjectsItem, query: string): boolean {
  const q = query.toLowerCase();
  return (
    tag.name.toLowerCase().includes(q) ||
    tag.code.toLowerCase().includes(q) ||
    (tag.description?.toLowerCase().includes(q) ?? false)
  );
}

export function TagsDataTable({ tags }: Props) {
  return (
    <ClientDataTable
      columns={columns}
      data={tags}
      getRowId={(tag) => tag.code}
      globalFilterFn={tagGlobalFilter}
      searchPlaceholder="Filter tags by name, code, or description..."
      initialSorting={[{ id: "count", desc: true }]}
      pageSize={50}
    />
  );
}
