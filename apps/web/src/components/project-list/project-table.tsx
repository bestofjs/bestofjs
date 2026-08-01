import { Suspense } from "react";
import NextLink from "next/link";

import {
  DownloadCount,
  GitHubIcon,
  getDeltaByDay,
  HomeIcon,
  ProjectLogo,
  StarDelta,
  StarTotal,
} from "@/components/core";
import { FromNow } from "@/components/helpers.client";
import { ProjectTagGroup } from "@/components/tags/project-tag-group";
import { buttonVariants } from "@/components/ui/button";
import { linkVariants } from "@/components/ui/link";
import { formatNumber } from "@/helpers/numbers";
import type {
  PageSearchUrlBuilder,
  PaginationProps,
} from "@/lib/page-search-state";
import { cn } from "@/lib/utils";

/** Shared shape both the old (static-JSON) and new (DB-trends) search states satisfy. */
export type TagFilterState = PaginationProps & { tags: string[] };

type Props<
  P extends BestOfJS.Project = BestOfJS.Project,
  T extends TagFilterState = TagFilterState,
> = {
  projects: P[];
  buildPageURL?: PageSearchUrlBuilder<T>;
  footer?: React.ReactNode;
  metricsCell?: (project: P) => React.ReactNode;
  /**
   * Status/score badges rendered next to the project name. A render prop
   * because the labels need the trends scores, which only the DB-backed
   * surfaces have — the static-JSON callers just omit it.
   */
  labels?: (project: P) => React.ReactNode;
  showDetails?: boolean;
};

export function ProjectTable<
  P extends BestOfJS.Project = BestOfJS.Project,
  T extends TagFilterState = TagFilterState,
>({ projects, footer, ...otherProps }: Props<P, T>) {
  return (
    <table className="w-full">
      <tbody className="[&_tr:last-child]:border-0">
        {projects.map((project) => {
          if (!project) return null;
          return (
            <ProjectTableRow
              key={project.slug}
              project={project}
              {...otherProps}
            />
          );
        })}
      </tbody>
      {footer && (
        <tfoot className="border-t">
          <tr>
            <Cell colSpan={5} className="border-0 p-4 text-center">
              {footer}
            </Cell>
          </tr>
        </tfoot>
      )}
    </table>
  );
}

type RowProps<
  P extends BestOfJS.Project = BestOfJS.Project,
  T extends TagFilterState = TagFilterState,
> = Pick<
  Props<P, T>,
  "buildPageURL" | "metricsCell" | "labels" | "showDetails"
> & {
  project: P;
};
function ProjectTableRow<
  P extends BestOfJS.Project = BestOfJS.Project,
  T extends TagFilterState = TagFilterState,
>({
  project,
  buildPageURL,
  showDetails = true,
  metricsCell,
  labels,
}: RowProps<P, T>) {
  const path = `/projects/${project.slug}`;
  // De-emphasize the whole row, but never the badges: the `deprecated` badge
  // has to stay vivid, so the muting is applied per element instead of as a
  // single `opacity` on the `<tr>`.
  const isDeprecated = project.status === "deprecated";

  return (
    <tr data-testid="project-card" className="border-b">
      <Cell className="w-[50px] pl-4 sm:p-4">
        <NextLink href={path} className={cn(isDeprecated && "grayscale")}>
          <ProjectLogo project={project} size={48} />
        </NextLink>
      </Cell>

      <Cell className="max-w-0 py-4 pl-4 md:pl-2">
        <div className="relative flex flex-wrap items-center gap-2">
          <NextLink
            href={path}
            className={cn(
              linkVariants({ variant: "project" }),
              isDeprecated && "text-muted-foreground",
            )}
          >
            {project.name}
          </NextLink>
          {labels?.(project)}
          {/* `grow`, not `w-full`: the row wraps now (badges can be long), and
              a 100%-width child would always claim a line of its own. */}
          <div className="hidden grow space-x-1 md:flex">
            <a
              href={"https://github.com/" + project.full_name}
              aria-label="GitHub repository"
              rel="noopener noreferrer"
              target="_blank"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "size-10 rounded-full p-0",
              )}
            >
              <GitHubIcon className="size-5" />
            </a>
            {project.url && (
              <a
                href={project.url}
                aria-label="Project's homepage"
                rel="noopener noreferrer"
                target="_blank"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "size-10 rounded-full p-0",
                )}
              >
                <HomeIcon className="size-5" />
              </a>
            )}
          </div>
          {metricsCell && (
            <div className="flex grow justify-end pr-4 text-right md:hidden">
              {metricsCell(project)}
            </div>
          )}
        </div>

        <div
          className={cn(
            "mt-2 mb-4 truncate pr-4 font-serif text-sm sm:pr-0",
            isDeprecated && "text-muted-foreground",
          )}
        >
          {project.description}
        </div>
        <ProjectTagGroup tags={project.tags} buildPageURL={buildPageURL} />
      </Cell>

      {showDetails && (
        <Cell
          className={cn(
            "hidden w-[180px] space-y-2 p-4 text-sm md:table-cell",
            isDeprecated && "text-muted-foreground",
          )}
        >
          {project.pushed_at ? (
            <div>
              Pushed{" "}
              <Suspense fallback="...">
                <FromNow date={project.pushed_at} />
              </Suspense>
            </div>
          ) : null}
          {project.contributor_count > 0 && (
            <div>
              {formatNumber(project.contributor_count, "compact")} contributors
            </div>
          )}
          <div>
            Created{" "}
            <Suspense fallback="...">
              <FromNow date={project.created_at} />
            </Suspense>
          </div>
        </Cell>
      )}

      {metricsCell && (
        <Cell
          className={cn(
            "hidden w-[128px] p-4 text-right md:table-cell",
            isDeprecated && "opacity-70",
          )}
        >
          {metricsCell(project)}
        </Cell>
      )}
    </tr>
  );
}

export const ProjectScore = ({
  project,
  sort,
}: {
  project: BestOfJS.Project;
  sort: string;
}) => {
  if (sort === "trending") {
    // No single raw signal maps 1:1 to the blended popularity score; show the
    // freshest star-delta window available (same fallback chain the score
    // itself uses for young repos without a yearly delta yet).
    const value =
      project.trends.yearly ?? project.trends.monthly ?? project.trends.daily;
    if (value === undefined) return null;
    return <StarDelta average={false} value={value} />;
  }

  if (sort === "most-active") {
    // No `last_commit` (nullable, e.g. GraphQL commit-history lookup
    // skipped/failed) → same "fully inactive" state `computeActivityScore`
    // treats as 0, so nothing to show rather than "Invalid Date".
    if (!project.pushed_at) return null;
    return (
      <Suspense fallback="...">
        <FromNow date={project.pushed_at} />
      </Suspense>
    );
  }

  const showDelta = ["daily", "weekly", "monthly", "yearly"].includes(sort);
  const showDownloads = sort === "monthly-downloads";

  if (showDelta) {
    const value = getDeltaByDay(sort)(project);
    if (value === undefined) return null;
    return <StarDelta average={sort !== "daily"} value={value} />;
  }

  if (showDownloads) {
    return <DownloadCount value={project.downloads} />;
  }

  return <StarTotal value={project.stars} />;
};

const Cell = ({
  className,
  ...props
}: { className: string } & React.HTMLProps<HTMLTableCellElement>) => (
  <td className={cn(className)} {...props} />
);
