"use client";

import { useState, useTransition } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";

import type { findTags } from "@repo/core/services/tags";
import { TAG_FACETS } from "@repo/core/services/tags/taxonomy";

import { updateTagFacet } from "@/actions/tags-actions";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Tag = Awaited<ReturnType<typeof findTags>>[0];

export const columns: ColumnDef<Tag>[] = [
  {
    accessorKey: "name",
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
