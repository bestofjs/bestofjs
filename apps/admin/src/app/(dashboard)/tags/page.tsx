import Link from "next/link";

import { TAG_FACETS } from "@repo/core/services/tags";

import { AddTagButton } from "@/components/add-tag-button";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { getCachedTags } from "./get-tags";
import { TagsDataTable } from "./tags-data-table";

type PageProps = { searchParams: Promise<{ facet?: string }> };

export default async function TagsPage({ searchParams }: PageProps) {
  const requestedFacet = (await searchParams).facet ?? "all";
  const selectedFacet = ["all", "none", ...TAG_FACETS].includes(requestedFacet)
    ? requestedFacet
    : "all";
  const tags = await getCachedTags();
  const visibleTags = tags.filter((tag) => {
    if (selectedFacet === "all") return true;
    if (selectedFacet === "none") return tag.facet === null;
    return tag.facet === selectedFacet;
  });
  const filters = ["all", "none", ...TAG_FACETS] as const;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="flex scroll-m-20 items-center gap-2 font-extrabold text-3xl tracking-tight lg:text-4xl">
          Tags
          <Badge className="text-sm">{tags.length}</Badge>
        </h1>
        <div className="flex gap-2">
          <Link
            href="/tags/tree"
            className={buttonVariants({ variant: "outline" })}
          >
            View tree
          </Link>
          <AddTagButton />
        </div>
      </div>
      <nav className="flex flex-wrap gap-2" aria-label="Filter tags by facet">
        {filters.map((facet) => {
          const count = tags.filter((tag) =>
            facet === "all"
              ? true
              : facet === "none"
                ? tag.facet === null
                : tag.facet === facet,
          ).length;
          return (
            <Link
              key={facet}
              href={facet === "all" ? "/tags" : `/tags?facet=${facet}`}
              aria-current={selectedFacet === facet ? "page" : undefined}
              className={cn(
                buttonVariants({
                  variant: selectedFacet === facet ? "default" : "outline",
                  size: "sm",
                }),
                "gap-2 capitalize",
              )}
            >
              {facet === "none" ? "No facet" : facet}
              <span className="tabular-nums opacity-70">{count}</span>
            </Link>
          );
        })}
      </nav>
      <TagsDataTable tags={visibleTags} />
    </div>
  );
}
