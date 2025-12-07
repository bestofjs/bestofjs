"use client";

import {
  GitHubIcon,
  HomeIcon,
  ProjectLogo,
  SearchIcon,
  StarTotal,
  TagIcon,
  TagsIcons,
} from "@/components/core";
import { buttonVariants } from "@/components/ui/button";
import { CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";

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
      className={cn("border-t border-dashed", "group")}
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
              "size-10 rounded-full p-0 text-muted-foreground",
              "hover:group-aria-[selected]:text-(--project-color)",
              "hover:group-aria-[selected]:bg-(--project-bg)",
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
                "size-10 rounded-full p-0 text-muted-foreground",
                "hover:group-aria-[selected]:text-(--project-color)",
                "hover:group-aria-[selected]:bg-(--project-bg)",
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
      <div className="flex size-12 items-center justify-center">
        <ProjectLogo project={project} size={32} />
      </div>
      <div className="group-aria-[selected]:text-accent-foreground] flex-1 truncate">
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
  currentTags,
}: {
  tag: BestOfJS.Tag;
  onSelectTag: (itemValue: string) => void;
  currentTags: BestOfJS.Tag[];
}) {
  const displayedTags = [tag, ...currentTags];
  return (
    <CommandItem
      value={"tag/" + tag.code}
      onSelect={onSelectTag}
      className={cn("group", "border-t border-dashed")}
    >
      <div className="flex min-h-[50px] items-center">
        <div
          className={cn(
            "flex size-12 items-center justify-center",
            "text-muted-foreground",
            "group-aria-[selected]:text-accent-foreground",
          )}
        >
          {currentTags.length === 0 ? (
            <TagIcon size={32} />
          ) : (
            <TagsIcons size={32} />
          )}
        </div>
        <div className="pl-4 text-md">
          <span className={cn("group-aria-[selected]:text-accent-foreground")}>
            {displayedTags.map((tag) => tag.name).join(" + ")}
          </span>
          {currentTags.length === 0 && (
            <span className="ml-2 text-muted-foreground">
              {tag.counter} projects
            </span>
          )}
        </div>
      </div>
    </CommandItem>
  );
}

export function ViewAllTagsCommand({ onSelect }: { onSelect: () => void }) {
  return (
    <CommandItem value="all-tags" onSelect={() => onSelect()}>
      <div className="flex min-h-[50px] items-center">
        <div className="flex size-12 items-center justify-center">
          <TagsIcons size={32} />
        </div>
        <div className="pl-4">View all tags</div>
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
      <div className="flex size-12 items-center justify-center">
        <SearchIcon size={24} />
      </div>
      <div>
        Search for
        <span className="ml-1 font-bold italic">{searchQuery}</span>
      </div>
    </CommandItem>
  );
}
