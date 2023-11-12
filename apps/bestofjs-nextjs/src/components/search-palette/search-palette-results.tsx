"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { CommandItem } from "@/components/ui/command";

import {
  GitHubIcon,
  HomeIcon,
  ProjectAvatar,
  SearchIcon,
  StarTotal,
  TagIcon,
} from "../core";

export function ProjectSearchResult({
  project,
  onSelectProject,
}: {
  project: BestOfJS.SearchIndexProject;
  onSelectProject: (itemValue: string) => void;
}) {
  return (
    <CommandItem
      value={`project/` + project.slug}
      onSelect={onSelectProject}
      className="border-l-1 border-[transparent] data-[selected]:border-[var(--project-border)] data-[selected]:bg-[var(--project-bg)] group"
    >
      <div className="w-full gap-2 md:grid md:grid-cols-[1fr_40px_40px]">
        <ProjectSummary project={project} />

        <div className="hidden items-center md:flex">
          <a
            href={`https://github.com/` + project.full_name}
            onClick={(event) => event.stopPropagation()}
            aria-label="GitHub repository"
            rel="noopener noreferrer"
            target="_blank"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "rounded-full",
              "w-10",
              "h-10",
              "p-0",
              "text-muted-foreground",
              "group-aria-[selected]:hover:text-[var(--project-color)]",
              "group-aria-[selected]:hover:bg-[var(--project-bg)]"
              // "group-aria-[selected]:bg-[var(--orange-6)]"
            )}
          >
            <GitHubIcon size={24} />
          </a>
        </div>
        {project.url && (
          <div className="hidden items-center md:flex">
            <a
              href={project.url}
              onClick={(event) => event.stopPropagation()}
              aria-label="Project's homepage"
              rel="noopener noreferrer"
              target="_blank"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "rounded-full",
                "w-10",
                "h-10",
                "p-0",
                // "group-aria-[selected]:text-[var(--project-color)]",
                "text-muted-foreground",
                "group-aria-[selected]:hover:text-[var(--project-color)]",
                "group-aria-[selected]:hover:bg-[var(--project-bg)]"
              )}
            >
              <HomeIcon size={24} />
            </a>
          </div>
        )}
      </div>
    </CommandItem>
  );
}

function ProjectSummary({ project }: { project: BestOfJS.SearchIndexProject }) {
  return (
    <div className="flex w-full min-w-0 items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center">
        <ProjectAvatar project={project} size={32} />
      </div>
      <div className="flex-1 truncate group-aria-[selected]:text-[var(--project-color)]">
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
    <CommandItem
      value={"tag/" + tag.code}
      onSelect={onSelectTag}
      className="group border-l-1 border-[transparent] data-[selected]:border-[var(--tag-border)] data-[selected]:bg-[var(--tag-bg)]"
    >
      <div className="flex min-h-[50px] items-center">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center",
            "text-muted-foreground group-aria-[selected]:text-[var(--tag-color)]"
          )}
        >
          <TagIcon size={32} />
        </div>
        <div className="text-md pl-4">
          <span className="group-aria-[selected]:text-[var(--tag-color)]">
            {tag.name}
          </span>
          <div className="pt-2 text-muted-foreground">
            {tag.counter} projects
          </div>
        </div>
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
      className="group grid w-full grid-cols-[32px_1fr] items-center gap-4"
    >
      <div className="flex h-12 w-12 items-center justify-center">
        <SearchIcon size={24} />
      </div>
      <div>
        Search for
        <span className="ml-1 font-bold italic">{searchQuery}</span>
      </div>
    </CommandItem>
  );
}
