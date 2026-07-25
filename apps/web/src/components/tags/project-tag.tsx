"use client";
import NextLink from "next/link";

import type { TagFilterState } from "@/components/project-list/project-table";
import { badgeVariants } from "@/components/ui/badge";
import type { PageSearchUrlBuilder } from "@/lib/page-search-state";
import { cn } from "@/lib/utils";

import { ProjectTagHoverCard } from "./project-tag-hover-card";

type Props<T extends TagFilterState = TagFilterState> = {
  tags: BestOfJS.RawTag[];
  appendTag?: boolean;
  buildPageURL?: PageSearchUrlBuilder<T>;
};

export function ProjectTagGroup<T extends TagFilterState = TagFilterState>({
  tags,
  ...otherProps
}: Props<T>) {
  return (
    <div className="-m-1 flex flex-wrap">
      {tags.map((tag) => (
        <div key={tag.code} className="m-1">
          <ProjectTag tag={tag} {...otherProps} />
        </div>
      ))}
    </div>
  );
}

export function ProjectTag<T extends TagFilterState = TagFilterState>({
  tag,
  buildPageURL,
  appendTag,
  className,
}: {
  tag: BestOfJS.RawTag;
  buildPageURL?: Props<T>["buildPageURL"];
  appendTag?: boolean;
  className?: string;
}) {
  const url = buildPageURL
    ? buildPageURL(
        (state) => ({
          ...state,
          tags: appendTag ? [...state.tags, tag.code] : [tag.code],
          page: 1,
        }),
        "/projects",
      )
    : `/projects?tags=${tag.code}`;

  return (
    <ProjectTagHoverCard tag={tag}>
      <NextLink
        href={url}
        className={cn(
          badgeVariants({ variant: "outline" }),
          "rounded-sm bg-card px-3 py-1 font-normal font-sans text-sm hover:bg-accent",
          className,
        )}
      >
        {tag.name}
      </NextLink>
    </ProjectTagHoverCard>
  );
}
