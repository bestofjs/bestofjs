"use client";

import { useState } from "react";
import { orderBy } from "es-toolkit";

import type { TagWithProjectsItem } from "@repo/db/tags";

import { ClientDataTable } from "@/components/ui/datatable";

import { columns } from "./columns";

const COUNT_DESC_SORT = [{ id: "count", desc: true }];

export function TagsDataTable({ tags }: { tags: TagWithProjectsItem[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const displayTags = rankAndFilterTags(tags, searchQuery);
  const hasSearch = searchQuery.trim() !== "";

  return (
    <ClientDataTable
      columns={columns}
      data={displayTags}
      getRowId={(tag) => tag.code}
      globalFilterValue={searchQuery}
      onGlobalFilterChange={setSearchQuery}
      searchPlaceholder="Filter tags by name, code, or description..."
      initialSorting={COUNT_DESC_SORT}
      {...(hasSearch && {
        sorting: [],
        onSortingChange: () => {},
      })}
      pageSize={50}
      pageSizeOptions={[10, 25, 50, 100]}
    />
  );
}

/**
 * Rank 0–1 matches search palette; TanStack Table has no filter-rank API, so we pre-filter and pre-sort here.
 * Higher = better. 1 = exact, 0.8 = starts with, 0.6 = contains name/code, 0.4 = description, 0 = no match.
 */
function getTagMatchRank(tag: TagWithProjectsItem, query: string): number {
  const q = query.toLowerCase().trim();
  if (!q) return 0;
  const name = tag.name.toLowerCase();
  const code = tag.code.toLowerCase();
  const desc = tag.description?.toLowerCase() ?? "";
  if (name === q || code === q) return 1;
  if (name.startsWith(q) || code.startsWith(q)) return 0.8;
  if (name.includes(q) || code.includes(q)) return 0.6;
  // Only consider description when query is long enough (align with search-utils projects)
  if (q.length > 2 && desc.includes(q)) return 0.4;
  return 0;
}

function rankAndFilterTags(
  tags: TagWithProjectsItem[],
  query: string,
): TagWithProjectsItem[] {
  const q = query.trim();
  if (!q) {
    return orderBy(tags, [(tag) => tag.count], ["desc"]);
  }
  const withRank = tags
    .map((tag) => ({ tag, rank: getTagMatchRank(tag, q) }))
    .filter(({ rank }) => rank > 0);
  return orderBy(
    withRank,
    [(x) => x.rank, (x) => x.tag.count],
    ["desc", "desc"],
  ).map(({ tag }) => tag);
}
