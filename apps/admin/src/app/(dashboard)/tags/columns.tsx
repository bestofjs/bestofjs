"use client";

import { useState, useTransition } from "react";
import { rankItem, rankings } from "@tanstack/match-sorter-utils";
import type { ColumnDef, FilterFn } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";

import { TAG_FACETS } from "@repo/core/services/tags/taxonomy";

import { updateTagFacet } from "@/actions/tags-actions";
import { Button } from "@/components/ui/button";
import type { ClientDataTableFeatures } from "@/components/ui/client-data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { AdminTag as Tag } from "./get-tags";

/** Searched fields, by priority: a match on an earlier field always wins. */
const tagSearchAccessors: ((tag: Tag) => string | string[])[] = [
  (tag) => tag.name,
  (tag) => tag.code,
  (tag) => tag.aliases,
  (tag) => tag.description ?? "",
];

/**
 * Rank a tag against the search box. Each field is ranked on its own and the
 * first matching one is kept, its index stored as `accessorIndex`, so
 * `fuzzySort` orders by field priority (name → code → aliases → description)
 * before match quality. A single multi-accessor `rankItem` would keep the best
 * rank across fields instead, letting an exact alias beat a partial name.
 */
const tagSearchFilter: FilterFn<ClientDataTableFeatures, Tag> = (
  row,
  _columnId,
  value,
  addMeta,
) => {
  for (const [index, accessor] of tagSearchAccessors.entries()) {
    const fieldRank = rankItem(row.original, value, {
      accessors: [accessor],
      // skip fuzzy "letters in order" matches, too noisy for a search box
      threshold: rankings.CONTAINS,
    });
    if (fieldRank.passed) {
      addMeta?.({ itemRank: { ...fieldRank, accessorIndex: index } });
      return true;
    }
  }

  return false;
};

export const columns: ColumnDef<ClientDataTableFeatures, Tag>[] = [
  {
    accessorKey: "name",
    filterFn: tagSearchFilter,
    sortFn: "fuzzy",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Link href={`/tags/${row.original.code}`} className="hover:underline">
          {row.original.name}
        </Link>
      );
    },
  },
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "facet",
    header: "Facet",
    cell: ({ row }) => <FacetSelect tag={row.original} />,
  },
  {
    accessorKey: "count",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Projects
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created at
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.createdAt.toISOString().slice(0, 10),
  },
];

function FacetSelect({ tag }: { tag: Tag }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="min-w-36 space-y-1">
      <Select
        disabled={isPending}
        value={tag.facet ?? "none"}
        onValueChange={(value) => {
          setError(null);
          startTransition(async () => {
            const result = await updateTagFacet(
              tag.id,
              value === "none" ? null : (value as (typeof TAG_FACETS)[number]),
            );
            setError(result.error);
          });
        }}
      >
        <SelectTrigger className="h-8" aria-label={`Facet for ${tag.name}`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No facet</SelectItem>
          {TAG_FACETS.map((facet) => (
            <SelectItem key={facet} value={facet}>
              {facet}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error ? (
        <p className="max-w-56 text-destructive text-xs" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
