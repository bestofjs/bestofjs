"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { z } from "zod";

import { PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

import { searchSchema } from "./search-schema";

export function ProjectTablePagination({
  offset,
  limit,
  total,
}: z.infer<typeof searchSchema> & { total: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlSearchParams = new URLSearchParams(searchParams.toString());
  const hasPreviousPage = offset > 0;
  const hasNextPage = offset + limit < total;

  function getPreviousPageURL() {
    urlSearchParams.set("offset", String(offset - limit));
    return pathname + "?" + urlSearchParams.toString();
  }
  function getNextPageURL() {
    urlSearchParams.set("offset", String(offset + limit));
    return pathname + "?" + urlSearchParams.toString();
  }
  return (
    <div className="flex">
      {hasPreviousPage && <PaginationPrevious href={getPreviousPageURL()} />}
      {hasNextPage && <PaginationNext href={getNextPageURL()} />}
    </div>
  );
}
