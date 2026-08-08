"use client";

import NextLink from "next/link";

import { LinkPendingOverlay } from "@/components/core/link-pending";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { ProjectTagHoverCard } from "./project-tag-hover-card";

export function ProjectTag({
  tag,
  url,
  className,
  showPendingIndicator,
}: {
  tag: BestOfJS.RawTag;
  url: string;
  className?: string;
  /**
   * Only for chips whose link keeps the visitor on the listing page they are
   * already on. Those navigations re-use the mounted list instead of mounting
   * the route's loading shell, so without this nothing acknowledges the click.
   */
  showPendingIndicator?: boolean;
}) {
  return (
    <ProjectTagHoverCard tag={tag}>
      <NextLink
        href={url}
        className={cn(
          badgeVariants({ variant: "outline" }),
          "relative rounded-sm bg-card px-3 py-1 font-normal font-sans text-sm hover:bg-accent",
          className,
        )}
      >
        {tag.name}
        {showPendingIndicator && <LinkPendingOverlay />}
      </NextLink>
    </ProjectTagHoverCard>
  );
}
