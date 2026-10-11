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

/**
 * Rank a tag against the search box. `fuzzySort` breaks ties between equal
 * ranks by accessor order, so name beats code beats aliases; a description hit
 * is capped at "contains" so it never outranks a name, code or alias hit.
 */
const tagSearchFilter: FilterFn<ClientDataTableFeatures, Tag> = (
  row,
  _columnId,
  value,
  addMeta,
) => {
  const itemRank = rankItem(row.original, value, {
    accessors: [
      (tag) => tag.name,
      (tag) => tag.code,
      (tag) => tag.aliases,
      {
        accessor: (tag) => tag.description ?? "",
        maxRanking: rankings.CONTAINS,
      },
    ],
    // skip fuzzy "letters in order" matches, too noisy for a search box
    threshold: rankings.CONTAINS,
  });

  addMeta?.({ itemRank });

  return itemRank.passed;
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
