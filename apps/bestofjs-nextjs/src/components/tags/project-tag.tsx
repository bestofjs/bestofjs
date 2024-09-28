import React from "react";
import NextLink from "next/link";

import { ProjectSearchUrlBuilder } from "@/app/projects/project-search-types";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ProjectTagHoverCard } from "./project-tag-hover-card";

type Props = {
  tags: BestOfJS.RawTag[];
  appendTag?: boolean;
  buildPageURL?: ProjectSearchUrlBuilder;
};

export const ProjectTagGroup = ({ tags, ...otherProps }: Props) => {
  return (
    <div className="-m-1 flex flex-wrap">
      {tags.map((tag) => (
        <div key={tag.code} className="m-1">
          <ProjectTag tag={tag} {...otherProps} />
        </div>
      ))}
    </div>
  );
};

export const ProjectTag = ({
  tag,
  buildPageURL,
  appendTag,
  className,
}: {
  tag: BestOfJS.RawTag;
  buildPageURL?: Props["buildPageURL"];
  appendTag?: boolean;
  className?: string;
}) => {
  const url = buildPageURL
    ? buildPageURL((state) => ({
        ...state,
        tags: appendTag ? [...state.tags, tag.code] : [tag.code],
        page: 1,
      }))
    : `/projects?tags=${tag.code}`;

  return (
    <ProjectTagHoverCard tag={tag}>
      <NextLink
        href={url}
        className={cn(
          badgeVariants({ variant: "outline" }),
          "rounded-sm bg-card px-3 py-1 font-sans text-sm font-normal hover:bg-accent",
          className
        )}
      >
        {tag.name}
      </NextLink>
    </ProjectTagHoverCard>
  );
};
