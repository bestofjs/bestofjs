"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { CommandItem } from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";

import {
  GitHubIcon,
  HomeIcon,
  ProjectAvatar,
  SearchIcon,
  StarTotal,
  TagIcon,
  XMarkIcon,
} from "../core";

export function ProjectSearchResult({
  project,
  onSelectProject,
}: {
  project: BestOfJS.SearchIndexProject;
  onSelectProject: (itemValue: string) => void;
}) {
  return (
    <div className="gap-2 md:grid md:grid-cols-[1fr_40px_40px]">
      <CommandItem value={`project/` + project.slug} onSelect={onSelectProject}>
        <ProjectSummary project={project} />
      </CommandItem>
      <div className="hidden items-center md:flex">
        <a
          href={`https://github.com/` + project.full_name}
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
      </div>
      {project.url && (
        <div className="hidden items-center md:flex">
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
        </div>
      )}
    </div>
  );
}

function ProjectSummary({ project }: { project: BestOfJS.SearchIndexProject }) {
  return (
    <div className="flex w-full min-w-0 items-center gap-4">
      <div className="items-center justify-center">
        <ProjectAvatar project={project} size={32} />
      </div>
      <div className="flex-1 truncate">
        {project.name}
        <div className="truncate pt-2 text-muted-foreground">
          {project.description}
        </div>
      </div>
      <div className="hidden text-right md:block">
        <StarTotal value={project.stars} />
      </div>
    </div>
  );
}

export function TagSearchResult({
  tag,
  onSelectTag,
}: {
  tag: BestOfJS.Tag;
  onSelectTag: (itemValue: string) => void;
}) {
  return (
    <CommandItem value={"tag/" + tag.code} onSelect={onSelectTag}>
      <div className="flex min-h-[50px] items-center">
        <div className="flex w-8 items-center justify-center">
          <TagIcon size={32} />
        </div>
        <span className="pl-4 pr-2">{tag.name}</span>
        <div className="text-muted-foreground">({tag.counter})</div>
      </div>
    </CommandItem>
  );
}

export function SearchForTextCommand({
  searchQuery,
  onSelectSearchForText,
}: {
  searchQuery: string;
  onSelectSearchForText: (itemValue: string) => void;
}) {
  return (
    <CommandItem
      onSelect={onSelectSearchForText}
      value={`search/${searchQuery}`}
      className="grid w-full grid-cols-[32px_1fr] items-center gap-4"
    >
      <div className="flex justify-center">
        <SearchIcon />
      </div>
      <div>
        Search for
        <span className="ml-1 font-bold italic">{searchQuery}</span>
      </div>
    </CommandItem>
  );
}
