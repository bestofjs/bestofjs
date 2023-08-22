import React, { Suspense } from "react";
import formatUrl from "@/helpers/url";
import { GoHome, GoMarkGithub } from "react-icons/go";
import { ImNpm } from "react-icons/im";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ProjectAvatar } from "@/components/core";
import { ProjectTagGroup } from "@/components/tags/project-tag";

import { getProjectDetails } from "./get-project-details";

type Props = { project: BestOfJS.Project };
export function ProjectHeader({ project }: Props) {
  const { full_name, packageName, repository, url } = project;

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:divide-x sm:divide-dashed sm:divide-orange-500 sm:dark:divide-yellow-700">
      <div className="flex min-h-[120px] grow items-center divide-x divide-dashed divide-orange-500 dark:divide-yellow-700">
        <div className="pr-4">
          <ProjectAvatar project={project} size={75} />
        </div>
        <div className="flex flex-col space-y-4 pl-4">
          <h2 className="font-serif text-4xl">{project.name}</h2>
          <div>
            <Suspense fallback={project.description}>
              {/* @ts-expect-error Server Component */}
              <FullDescription project={project} />
            </Suspense>
          </div>
          <div>
            <ProjectTagGroup tags={project.tags} />
          </div>
        </div>
      </div>
      <aside className="flex flex-col justify-center space-y-2 font-sans sm:w-[280px] sm:pl-4">
        <ButtonLink href={repository} icon={<GoMarkGithub size={20} />}>
          {full_name}
        </ButtonLink>
        {url && (
          <ButtonLink href={url} icon={<GoHome size={20} />}>
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

async function FullDescription({ project }: { project: BestOfJS.Project }) {
  const projectWithDetails = await getProjectDetails(project);

  return <>{projectWithDetails.description}</>;
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
      "relative",
      "justify-start"
    )}
  >
    <span className="absolute left-4">{icon}</span>
    <span className="truncate pl-[36px] text-base">{children}</span>
  </a>
);
