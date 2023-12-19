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
  tag: BestOfJS.Tag;
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
  tag: BestOfJS.Tag;
}) => {
  if (!isOpen) return;

  return (
    <div className="flex-col">
      <div className="py-2 text-left" style={{ color: "white" }}>
        <h1>Top 5 Projects</h1>
      </div>
      <div>
        <FetchTagProjects tag={tag} />
      </div>
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
        <div className="grow text-sm text-muted-foreground">{children}</div>
      </div>
    </div>
  </div>
);

function getTagProjecListStyles({ isFirst }: { isFirst: boolean }) {
  return {
    color: "white",
    gap: 10,
    alignItems: "center",
    borderStyle: "solid",
    borderColor: `rgba(255, 255, 255, 0.2)`,
    borderBottomWidth: "1px",
    borderTopWidth: isFirst ? 1 : 0,
    padding: "8px 0",
  };
}

const TagProjectList = ({ projects }: { projects: BestOfJS.Project[] }) => (
  <div className="flex-col">
    {projects &&
      projects.map((project, index) => (
        <div
          key={project.slug}
          className="flex gap-3"
          style={getTagProjecListStyles({ isFirst: index === 0 })}
        >
          <div className="flex">
            <ProjectAvatar project={project} size={20} />
          </div>
          <div>
            <div>{project.name}</div>
          </div>
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

const FetchTagProjects = ({ tag }: { tag: BestOfJS.Tag }) => {
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
  const {
    tag: { projects },
  }: { tag: BestOfJS.TagWithProjects } = data;

  return <TagProjectList projects={projects} />;
};
