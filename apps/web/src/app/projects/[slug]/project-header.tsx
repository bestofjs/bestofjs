import type React from "react";

import {
  getLicenseShortName,
  getProjectDescription,
  getProjectURL,
  isGPLProject,
  type ProjectDetails,
} from "@repo/db/projects";

import { GitHubIcon, HomeIcon, NpmIcon, ProjectLogo } from "@/components/core";
import { ProjectTagGroup } from "@/components/tags/project-tag";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { formatUrl } from "@/helpers/url";
import { cn } from "@/lib/utils";

type Props = { project: ProjectDetails };
export function ProjectHeader({ project }: Props) {
  const {
    repo: { full_name },
  } = project;
  const repository = `https://github.com/${full_name}`;
  const url = getProjectURL(project);
  const packageName = project.packages?.[0]?.name;

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:divide-x">
      <div className="grid grow auto-cols-[auto_1fr] grid-flow-col items-stretch divide-x">
        <div className="flex items-center pr-4">
          <ProjectLogo
            project={{
              name: project.name,
              owner_id: project.repo.owner_id,
              logo: project.logo,
            }}
            size={75}
          />
        </div>
        <div className="flex flex-col justify-center space-y-4 px-4">
          <div className="flex flex-col justify-between sm:flex-row sm:items-center">
            <h2 className="font-serif text-4xl">{project.name}</h2>
            {isGPLProject(project) && (
              <div>
                <Badge variant="destructive" className="text-base">
                  {getLicenseShortName(project.repo.license)}
                </Badge>
              </div>
            )}
          </div>
          <div>{getProjectDescription(project)}</div>
          <div>
            <ProjectTagGroup tags={project.tags} />
          </div>
        </div>
      </div>
      <aside className="flex flex-col justify-center space-y-2 font-sans sm:w-[280px] sm:pl-4">
        <ButtonLink href={repository} icon={<GitHubIcon className="size-5" />}>
          {full_name}
        </ButtonLink>
        {url && (
          <ButtonLink href={url} icon={<HomeIcon className="size-5" />}>
            {formatUrl(url)}
          </ButtonLink>
        )}
        {packageName && (
          <ButtonLink
            href={`https://www.npmjs.com/package/${packageName}`}
            icon={<NpmIcon className="size-5" />}
          >
            {packageName}
          </ButtonLink>
        )}
      </aside>
    </div>
  );
}

const ButtonLink = ({
  href,
  icon,
  children,
}: {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}) => (
  <a
    href={href}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "relative justify-start",
    )}
  >
    <span className="absolute left-4">{icon}</span>
    <span className="truncate pl-[36px] text-base">{children}</span>
  </a>
);
