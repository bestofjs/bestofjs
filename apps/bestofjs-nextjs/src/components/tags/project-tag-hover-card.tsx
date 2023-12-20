"use client";

import Link from "next/link";
import useSWR, { SWRConfiguration } from "swr";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectAvatar, TagIcon } from "@/components/core";

const NUMBER_OF_PROJECTS = 5;

export const ProjectTagHoverCard = ({
  children,
  tag,
}: React.PropsWithChildren<{ tag: BestOfJS.Tag }>) => {
  const { name, description } = tag;
  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="justify-start divide-y text-left text-sm">
          <div className="pb-2">
            <div className="flex items-center gap-2">
              <div className="text-[var(--icon-color)]">
                <TagIcon size={24} />
              </div>
              <div>{name}</div>
            </div>
            {description && (
              <p className="pt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          <div className="py-3">
            <p className="mb-3 text-xs uppercase text-muted-foreground">
              Popular Projects
            </p>
            <FetchTagProjects tag={tag} />
          </div>
          <div className="pt-2">
            <Link
              href={`/tags/${tag.code}`}
              className="w-full text-sm text-secondary-foreground hover:text-primary-foreground"
            >
              View all »
            </Link>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

const FetchTagProjects = ({ tag }: { tag: BestOfJS.Tag }) => {
  const options: SWRConfiguration = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  };

  const fetchTagData = async () => {
    const url = `/api/tags/${tag.code}`;
    const data = await fetch(url).then((res) => res.json());
    if (!data) throw new Error(`Unable to fetch tag data ${tag.code}`);
    return data as BestOfJS.TagWithProjects;
  };

  const { data, error, isLoading } = useSWR(tag.code, fetchTagData, options);
  if (isLoading) return <TagProjectListSkeleton />;
  if (error) return <div>Unable to fetch tag data</div>;
  if (!data) return null;

  return <TagProjectList projects={data.projects} />;
};

const TagProjectList = ({ projects }: { projects: BestOfJS.Project[] }) => (
  <div className="flex flex-col gap-3">
    {projects.map((project) => (
      <Link
        key={project.slug}
        href={`/projects/${project.slug}`}
        className="flex h-5 items-center gap-2 text-sm text-muted-foreground hover:text-primary-foreground"
      >
        <ProjectAvatar project={project} size={20} />
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
