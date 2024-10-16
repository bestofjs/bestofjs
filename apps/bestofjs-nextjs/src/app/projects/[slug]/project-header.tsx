import React from "react";
import { ImNpm } from "react-icons/im";

import {
  getProjectDescription,
  getProjectURL,
  ProjectDetails,
} from "@repo/db/projects";
import { GitHubIcon, HomeIcon, ProjectLogo } from "@/components/core";
import { ProjectTagGroup } from "@/components/tags/project-tag";
import { buttonVariants } from "@/components/ui/button";
import { formatUrl } from "@/helpers/url";

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
      <div className="flex min-h-[120px] grow items-center divide-x">
        <div className="pr-4">
          <ProjectLogo
            project={{
              logo: project.logo || "",
              name: project.name,
              owner_id: project.repo.owner_id,
            }}
            size={75}
          />
        </div>
        <div className="flex flex-col space-y-4 pl-4">
          <h2 className="font-serif text-4xl">{project.name}</h2>
          <div>{getProjectDescription(project)}</div>
          <div>
            <ProjectTagGroup tags={project.tags} />
          </div>
        </div>
      </div>
      <aside className="flex flex-col justify-center space-y-2 font-sans sm:w-[280px] sm:pl-4">
        <ButtonLink href={repository} icon={<GitHubIcon size={20} />}>
          {full_name}
        </ButtonLink>
        {url && (
          <ButtonLink href={url} icon={<HomeIcon size={20} />}>
            {formatUrl(url)}
          </ButtonLink>
        )}
        {packageName && (
          <ButtonLink
            href={`https://www.npmjs.com/package/${packageName}`}
            icon={<ImNpm className="text-[16px]" />}
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
    className={buttonVariants({ variant: "outline" }, "relative justify-start")}
  >
    <span className="absolute left-4">{icon}</span>
    <span className="truncate pl-[36px] text-base">{children}</span>
  </a>
);
