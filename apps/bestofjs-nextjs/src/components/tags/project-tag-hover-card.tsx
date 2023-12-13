"use client";

import { ReactNode, useState } from "react";
import useSWR, { SWRConfiguration } from "swr";

import { ProjectAvatar } from "@/components/core";

import { TagIcon } from "../core";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Skeleton } from "../ui/skeleton";

export const ProjectTagHoverCard = ({
  children,
  tag,
}: {
  children: ReactNode;
  tag: BestOfJS.TagWithProjects;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onOpenChange = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  return (
    <HoverCard onOpenChange={onOpenChange}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80">
        <TagCardContent description={tag.description} name={tag.name}>
          <CardTagProjects isOpen={isOpen} tag={tag} />
        </TagCardContent>
      </HoverCardContent>
    </HoverCard>
  );
};

const CardTagProjects = ({
  isOpen,
  tag,
}: {
  isOpen: boolean;
  tag: BestOfJS.TagWithProjects;
}) => {
  if (!isOpen) return;

  return (
    <div className="flex-col">
      <h1 className="pb-1 text-left">Top 5 Projects</h1>
      <FetchTagProjects tag={tag} />
    </div>
  );
};

const TagCardContent = ({
  children,
  description,
  name,
}: {
  children: ReactNode;
  description: string | undefined;
  name: string;
}) => (
  <div className="flex justify-between space-x-4">
    <div className="w-[100%] space-y-1">
      <div className="flex items-center space-x-1">
        <div style={{ color: "#F59E0B" }}>
          <TagIcon />
        </div>
        <h4 className="text-sm font-semibold">{name}</h4>
      </div>
      <p className="text-left text-sm">{description}</p>
      <div>
        <span className="grow text-sm text-muted-foreground">{children}</span>
      </div>
    </div>
  </div>
);
//TODO finish project list and cleanup
const TagProjectList = ({ projects }: { projects: BestOfJS.Project[] }) => (
  <div className="flex-col space-y-1">
    {projects &&
      projects.map((project) => (
        <div className="flex">
          <ProjectAvatar project={project} size={20} />
          <div>{project.name}</div>
        </div>
      ))}
  </div>
);

const TagProjectListSkeleton = () => (
  <div className="flex-col space-y-1">
    <Skeleton className="h-6 w-[100%]" />
    <Skeleton className="h-6 w-[100%]" />
    <Skeleton className="h-6 w-[100%]" />
    <Skeleton className="h-6 w-[100%]" />
    <Skeleton className="h-6 w-[100%]" />
  </div>
);

const FetchTagProjects = ({ tag }: { tag: BestOfJS.TagWithProjects }) => {
  const options: SWRConfiguration = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  };

  function fetchTagData() {
    const url = `/api/tags/${tag.code}`;
    return fetch(url).then((res) => res.json());
  }
  const { data, error, isLoading } = useSWR(tag.code, fetchTagData, options);
  if (error) return <div>Unable to fetch...</div>;
  if (isLoading) return <TagProjectListSkeleton />;

  const { tags } = data;

  return <TagProjectList projects={tags[0].projects} />;
};
