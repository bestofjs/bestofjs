import React from "react";
import NextLink from "next/link";

import { cn } from "@/lib/utils";
import { badgeVariants } from "@/components/ui/badge";
import { ProjectSearchQuery, SearchUrlBuilder } from "@/app/projects/types";

import { TagIcon } from "../core";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";

type Props = {
  tags: BestOfJS.Tag[];
  appendTag?: boolean;
  buildPageURL?: SearchUrlBuilder<ProjectSearchQuery>;
};

const ProjectTagHoverCard = ({
  children,
  tag,
}: {
  children: React.ReactNode;
  tag: BestOfJS.Tag;
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <div style={{ color: "#F59E0B" }}>
                <TagIcon />
              </div>
              <h4 className="text-sm font-semibold">{tag.name}</h4>
            </div>
            <p className="text-sm">{tag.description}</p>
            <div className="flex items-center pt-2">
              <span className="text-xs text-muted-foreground">
                Joined December 2021
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
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
  tag: BestOfJS.Tag;
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
