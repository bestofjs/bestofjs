"use client";

import NextLink from "next/link";

import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { ProjectTagHoverCard } from "./project-tag-hover-card";

export function ProjectTag({
  tag,
  url,
  className,
}: {
  tag: BestOfJS.RawTag;
  url: string;
  className?: string;
}) {
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
