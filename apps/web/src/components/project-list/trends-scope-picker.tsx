import { CheckIcon, ListFilterIcon } from "lucide-react";
import NextLink from "next/link";

import type { ProjectScope } from "@repo/core/projects";

import type { TrendsProjectSearchUrlBuilder } from "@/app/projects/trends-project-search-state";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { ChevronDownIcon } from "../core";

/**
 * The default scope comes first: a bare `/projects` URL is `active`, so reading
 * top-to-bottom goes from the curated list to the full catalog, which is also
 * the direction the result count moves.
 *
 * The descriptions are the badge legend. Each listing row carries at most one
 * of `deprecated` / `inactive` / `cold`, and "Active only" hides exactly those
 * rows — so the filter definition and the legend are the same sentence, and
 * this menu is the only place either one is spelled out for touch users.
 */
const OPTIONS: {
  scope: ProjectScope;
  label: string;
  description: string;
}[] = [
  {
    scope: "active",
    label: "Active only",
    description: "Hides deprecated, inactive and cold projects",
  },
  {
    scope: "all",
    label: "All projects",
    description: "The full catalog, with a badge on every flagged project",
  },
];

type Props = {
  value: ProjectScope;
  buildPageURL: TrendsProjectSearchUrlBuilder;
};

/**
 * Picks the listing's `scope`. A dropdown rather than a visible switch: it is
 * an advanced option that shouldn't outweigh the sort picker, and the page
 * heading already states the current scope in words ("1,607 active projects"),
 * so the control only has to offer the change.
 *
 * The items are links, not client-side state — the whole listing is
 * server-rendered, so navigation is what applies the filter.
 */
export function TrendsProjectScopePicker({ value, buildPageURL }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          // Icon-only: the trigger has no accessible name of its own.
          aria-label="Change which projects are shown"
        >
          <ListFilterIcon aria-hidden="true" />
          <ChevronDownIcon className="size-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[280px]">
        <DropdownMenuLabel>Which projects to show</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {OPTIONS.map(({ scope, label, description }) => {
          const isCurrent = scope === value;
          const url = buildPageURL((state) => ({
            ...state,
            scope,
            // Filtering shrinks the result set: the current page may not exist.
            page: 1,
          }));
          return (
            // `inset` reserves the left gutter on both items, so the labels
            // line up whether or not the check is rendered.
            <DropdownMenuItem key={scope} asChild inset>
              <NextLink
                href={url}
                aria-current={isCurrent ? "true" : undefined}
                className="items-start"
              >
                {/* The indicator slot of `DropdownMenuCheckboxItem`, hand-rolled:
                    these are links, so there is no Radix `ItemIndicator` to
                    drive it. `text-foreground` opts out of the muted `svg`
                    colour `DropdownMenuItem` applies to unclassed icons. */}
                {isCurrent && (
                  <CheckIcon className="absolute top-2 left-2 size-4 text-foreground" />
                )}
                <div className="flex flex-col gap-0.5">
                  <span className={cn(isCurrent && "font-medium")}>
                    {label}
                  </span>
                  <span className="whitespace-normal text-muted-foreground text-xs">
                    {description}
                  </span>
                </div>
              </NextLink>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
