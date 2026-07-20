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
import { ProjectTagGroup } from "@/components/tags/project-tag";
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

type Props<T extends TagFilterState = TagFilterState> = {
  projects: BestOfJS.Project[];
  buildPageURL?: PageSearchUrlBuilder<T>;
  footer?: React.ReactNode;
  metricsCell?: (project: BestOfJS.Project) => React.ReactNode;
  showDetails?: boolean;
};

export function ProjectTable<T extends TagFilterState = TagFilterState>({
  projects,
  footer,
  ...otherProps
}: Props<T>) {
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

type RowProps<T extends TagFilterState = TagFilterState> = Pick<
  Props<T>,
  "buildPageURL" | "metricsCell" | "showDetails"
> & {
  project: BestOfJS.Project;
};
function ProjectTableRow<T extends TagFilterState = TagFilterState>({
  project,
  buildPageURL,
  showDetails = true,
  metricsCell,
}: RowProps<T>) {
  const path = `/projects/${project.slug}`;

  return (
    <tr data-testid="project-card" className="border-b">
      <Cell className="w-[50px] pl-4 sm:p-4">
        <NextLink href={path}>
          <ProjectLogo project={project} size={48} />
        </NextLink>
      </Cell>

      <Cell className="max-w-0 py-4 pl-4 md:pl-2">
        <div className="relative flex items-center space-x-2">
          <NextLink
            href={path}
            className={linkVariants({ variant: "project" })}
          >
            {project.name}
          </NextLink>
          <div className="hidden w-full space-x-1 md:flex">
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
            <div className="flex w-full justify-end pr-4 text-right md:hidden">
              {metricsCell(project)}
            </div>
          )}
        </div>

        <div className="mt-2 mb-4 truncate pr-4 font-serif text-sm sm:pr-0">
          {project.description}
        </div>
        <ProjectTagGroup tags={project.tags} buildPageURL={buildPageURL} />
      </Cell>

      {showDetails && (
        <Cell className="hidden w-[180px] space-y-2 p-4 text-sm md:table-cell">
          <div>
            Pushed{" "}
            <Suspense fallback="...">
              <FromNow date={project.pushed_at} />
            </Suspense>
          </div>
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
        <Cell className="hidden w-[128px] p-4 text-right md:table-cell">
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
