import NextLink from "next/link";

import { cn } from "@/lib/utils";
import { formatNumber } from "@/helpers/numbers";
import { ProjectSearchQuery, SearchUrlBuilder } from "@/app/projects/types";

import { fromNow } from "../../helpers/from-now";
import {
  DownloadCount,
  GitHubIcon,
  HomeIcon,
  ProjectAvatar,
  StarDelta,
  StarTotal,
  getDeltaByDay,
} from "../core";
import { ProjectTagGroup } from "../tags/project-tag";
import { buttonVariants } from "../ui/button";

type Props = {
  projects: BestOfJS.Project[];
  buildPageURL?: SearchUrlBuilder<ProjectSearchQuery>;
  footer?: React.ReactNode;
  metricsCell?: (project: BestOfJS.Project) => React.ReactNode;
  showDetails?: boolean;
};

export const ProjectTable = ({ projects, footer, ...otherProps }: Props) => {
  return (
    <table className="w-full">
      <tbody className="[&_tr:last-child]:border-0">
        {projects.map((project) => {
          if (!project) return null;
          return (
            <ProjectTableRow
              key={project.full_name}
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
};

type RowProps = Pick<Props, "buildPageURL" | "metricsCell" | "showDetails"> & {
  project: BestOfJS.Project;
};
const ProjectTableRow = ({
  project,
  buildPageURL,
  showDetails = true,
  metricsCell,
}: RowProps) => {
  const path = `/projects/${project.slug}`;

  return (
    <tr data-testid="project-card" className="border-b">
      <Cell className="w-[50px] pl-4 sm:p-4">
        <NextLink href={path}>
          <ProjectAvatar project={project} size={48} />
        </NextLink>
      </Cell>

      <Cell className="w-auto py-4 pl-4 md:pl-2">
        <div className="relative flex items-center space-x-2">
          <NextLink
            href={path}
            className="whitespace-nowrap text-primary hover:underline"
          >
            {project.name}
          </NextLink>
          <div className="hidden w-full space-x-1 md:flex">
            <a
              href={project.repository}
              aria-label="GitHub repository"
              rel="noopener noreferrer"
              target="_blank"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "rounded-full",
                "w-10",
                "h-10",
                "p-0"
              )}
            >
              <GitHubIcon size={24} />
            </a>
            {project.url && (
              <a
                href={project.url}
                aria-label="Project's homepage"
                rel="noopener noreferrer"
                target="_blank"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "rounded-full",
                  "w-10",
                  "h-10",
                  "p-0"
                )}
              >
                <HomeIcon size={24} />
              </a>
            )}
          </div>
          {metricsCell && (
            <div className="flex w-full justify-end pr-4 text-right md:hidden">
              {metricsCell(project)}
            </div>
          )}
        </div>

        <div className="mb-4 mt-2 truncate pr-4 font-serif text-sm sm:pr-0">
          {project.description}
        </div>
        <ProjectTagGroup tags={project.tags} buildPageURL={buildPageURL} />
      </Cell>

      {showDetails && (
        <Cell className="hidden w-[180px] space-y-2 p-4 text-sm md:table-cell">
          <div>Pushed {fromNow(project.pushed_at)}</div>
          {project.contributor_count && (
            <div>
              {formatNumber(project.contributor_count, "compact")} contributors
            </div>
          )}
          <div>Created {fromNow(project.created_at)}</div>
        </Cell>
      )}

      {metricsCell && (
        <Cell className="hidden w-[100px] p-4 text-right md:table-cell">
          {metricsCell(project)}
        </Cell>
      )}
    </tr>
  );
};

export const ProjectScore = ({
  project,
  sortOptionId,
}: {
  project: BestOfJS.Project;
  sortOptionId: string;
}) => {
  const showDelta = ["daily", "weekly", "monthly", "yearly"].includes(
    sortOptionId
  );
  const showDownloads = sortOptionId === "monthly-downloads";

  if (showDelta) {
    const value = getDeltaByDay(sortOptionId)(project);
    if (value === undefined) return null;
    return <StarDelta average={sortOptionId !== "daily"} value={value} />;
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
