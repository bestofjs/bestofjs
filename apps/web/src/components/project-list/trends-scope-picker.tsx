import NextLink from "next/link";

import type { ProjectScope } from "@repo/db/projects";

import type { TrendsProjectSearchUrlBuilder } from "@/app/projects/trends-project-search-state";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const OPTIONS: { scope: ProjectScope; label: string; title: string }[] = [
  {
    scope: "all",
    label: "All projects",
    title:
      "Show the full catalog, including deprecated and low-signal projects",
  },
  {
    scope: "active",
    label: "Active only",
    title:
      "Hide deprecated projects, projects with no commit for over a year, and projects gaining under 50 stars a year",
  },
];

type Props = {
  value: ProjectScope;
  buildPageURL: TrendsProjectSearchUrlBuilder;
};

/**
 * Two-state switch over the listing's `scope`. A pair of links rather than a
 * client component, like `TrendsProjectSortOrderPicker` — the whole listing is
 * server-rendered, so navigation is what applies the filter.
 */
export function TrendsProjectScopePicker({ value, buildPageURL }: Props) {
  return (
    // `nav`, not a `role="group"` div: these are links that navigate, and a
    // labelled landmark is the semantic fit (also what biome's a11y rule wants).
    // `h-9` matches the sort picker's `Button` (also h-9, border-box), so the
    // two controls line up; the links stretch to fill it.
    <nav
      className="inline-flex h-9 overflow-hidden rounded-md border"
      aria-label="Which projects to show"
    >
      {OPTIONS.map(({ scope, label, title }) => {
        const isCurrent = scope === value;
        const url = buildPageURL((state) => ({
          ...state,
          scope,
          // Filtering shrinks the result set: the current page may not exist.
          page: 1,
        }));
        return (
          <NextLink
            key={scope}
            href={url}
            title={title}
            aria-current={isCurrent ? "true" : undefined}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              // `h-full` overrides the `sm` size's `h-8` (tailwind-merge keeps
              // the last height), so each link fills the 36px container.
              "h-full rounded-none border-0 font-sans",
              isCurrent && "bg-secondary text-secondary-foreground",
            )}
          >
            {label}
          </NextLink>
        );
      })}
    </nav>
  );
}
