"use client";

import Link from "next/link";
import useSWR, { type SWRConfiguration } from "swr";

import type { TagProject, TagWithProjectsItem } from "@repo/db/tags";

import { ProjectLogo, TagIcon } from "@/components/core";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Skeleton } from "@/components/ui/skeleton";

const NUMBER_OF_PROJECTS = 5;

export const ProjectTagHoverCard = ({
  children,
  tag,
}: React.PropsWithChildren<{ tag: BestOfJS.RawTag }>) => {
  const { name, description } = tag;
  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="justify-start divide-y text-left text-sm">
          <div className="pb-2">
            <div className="flex items-center gap-2">
              <div className="text-(--icon-color)">
                <TagIcon className="size-6" />
              </div>
              <div>{name}</div>
            </div>
            {description && (
              <p className="pt-1 text-muted-foreground text-sm">
                {description}
              </p>
            )}
          </div>
          <div className="py-3">
            <p className="mb-3 text-muted-foreground text-xs uppercase">
              Popular Projects
            </p>
            <FetchTagProjects tag={tag} />
          </div>
          <div className="pt-2">
            <Link
              href={`/tags/${tag.code}`}
              className="w-full text-secondary-foreground text-sm hover:text-primary-foreground"
            >
              View all »
            </Link>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

const FetchTagProjects = ({ tag }: { tag: BestOfJS.RawTag }) => {
  const options: SWRConfiguration = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  };

  const fetchTagData = async () => {
    const url = `/api/tags/${tag.code}`;
    const res = await fetch(url);
    // Without this check a JSON error body (404 on an unknown code) would be
    // truthy, and `data.projects` `undefined` — crashing `TagProjectList`'s
    // `.map` instead of showing the error state.
    if (!res.ok) throw new Error(`Unable to fetch tag data ${tag.code}`);
    const data: TagWithProjectsItem = await res.json();
    if (!data) throw new Error(`Unable to fetch tag data ${tag.code}`);
    return data;
  };

  const { data, error, isLoading } = useSWR(tag.code, fetchTagData, options);
  if (isLoading) return <TagProjectListSkeleton />;
  if (error) return <div>Unable to fetch tag data</div>;
  if (!data) return null;

  return <TagProjectList projects={data.projects} />;
};

const TagProjectList = ({ projects }: { projects: TagProject[] }) => (
  <div className="flex flex-col gap-3">
    {projects.map((project) => (
      <Link
        key={project.slug}
        href={`/projects/${project.slug}`}
        className="flex h-5 items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
      >
        <ProjectLogo project={project} size={20} />
        <span>{project.name}</span>
      </Link>
    ))}
  </div>
);

const TagProjectListSkeleton = () => (
  <div className="flex flex-col gap-3">
    {Array.from(Array(NUMBER_OF_PROJECTS).keys()).map((key) => (
      <Skeleton key={key} className="h-5 w-full" />
    ))}
  </div>
);
