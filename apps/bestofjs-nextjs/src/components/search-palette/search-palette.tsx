"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { GoHome, GoMarkGithub } from "react-icons/go";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { ProjectAvatar, StarTotal, TagIcon } from "../core";
import { stateToQueryString } from "../project-list/navigation-state";
import { useSearchState } from "../project-list/search-state";
import { Skeleton } from "../ui/skeleton";
import { filterProjectsByTagsAndQuery } from "./find-projects";

export type SearchProps = {
  allProjects: BestOfJS.SearchIndexProject[];
  allTags: BestOfJS.Tag[];
};

export type SearchResults = {
  projects: BestOfJS.SearchIndexProject[];
  tags: BestOfJS.Tag[];
};
type SelectedItem =
  | {
      type: "project";
      value: BestOfJS.SearchIndexProject;
    }
  | {
      type: "tag";
      value: BestOfJS.Tag[];
    }
  | {
      type: "text";
    };
export function SearchPalette({ allProjects, allTags }: SearchProps) {
  const router = useRouter();
  const searchState = useSearchState();
  const [isPending, startTransition] = React.useTransition();

  const [currentTagCodes, setCurrentTagCodes] = React.useState<string[]>(
    searchState.tags
  );
  const [selectedItem, setSelectedItem] = React.useState<
    SelectedItem | undefined
  >();

  // The search palette is mounted only once, we need to sync the tags when the URL changes
  React.useEffect(() => {
    setCurrentTagCodes(searchState.tags);
  }, [JSON.stringify(searchState.tags)]); // eslint-disable-line react-hooks/exhaustive-deps

  const removeTag = (tagCode: string) =>
    setCurrentTagCodes((state) => state.filter((tag) => tag !== tagCode));
  const resetCurrentTags = () => setCurrentTagCodes(searchState.tags);

  const currentTags = currentTagCodes.map((tagCode) =>
    lookUpTag(tagCode, allTags)
  );
  const [open, setOpen] = React.useState(false);

  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const onOpenChange = (value: boolean) => {
    if (!value) {
      resetCurrentTags();
      setSearchQuery("");
    }
    setOpen(value);
  };

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const onValueChange = (value: string) => {
    setSearchQuery(value);
  };

  const filteredProjects = searchQuery
    ? filterProjectsByTagsAndQuery(allProjects, currentTagCodes, searchQuery)
    : [];

  React.useEffect(() => {
    if (searchQuery.length < 3) return;
    if (filteredProjects.length === 0) return;
    const firstProject = filteredProjects[0];
    router.prefetch(`/projects/${firstProject.slug}`);
  }, [searchQuery, filteredProjects.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const popularTags = allTags.slice(0, 20);

  const filteredTags = searchQuery
    ? filterTagsByQuery(allTags, searchQuery)
    : popularTags;

  const onSelectProject = (itemValue: string) => {
    const projectSlug = itemValue.slice("project/".length);
    const project = allProjects.find((project) => project.slug === projectSlug);
    setSelectedItem({ type: "project", value: project! });
    goToURL(`/projects/${projectSlug}`);
  };

  const onSelectTag = (itemValue: string) => {
    const selectedTagCode = itemValue.slice("tag/".length);
    const tagCodes = [...currentTagCodes, selectedTagCode];
    const tags = tagCodes
      .map((tagCode) => lookUpTag(tagCode, allTags))
      .filter(Boolean) as BestOfJS.Tag[];
    const nextState = { ...searchState, tags: tagCodes };
    const queryString = stateToQueryString(nextState);
    setSelectedItem({ type: "tag", value: tags });
    goToURL(`/projects/?${queryString}`);
  };

  const onSelectSearchForText = () => {
    setSelectedItem({ type: "text" });
    goToURL(`/projects?query=${searchQuery}`);
  };

  const goToURL = (url: string) => {
    // only close the popup when the page is ready to show
    // otherwise the popup closes showing the previous page, before going to the page!
    startTransition(() => {
      // oddly `onOpenChange` is not triggered when moving to another page, so we "reset" the state before closing
      resetCurrentTags();
      setSearchQuery("");
      setOpen(false);
      router.push(url);
    });
  };

  const isEmptyProjects = filteredProjects.length == 0;
  const isEmptyTags = filteredTags.length == 0;
  const isEmptySearchResults = isEmptyProjects && isEmptyTags;

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative ml-4 h-9 w-full justify-start rounded-[0.5rem] text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        )}
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Search in projects...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={onOpenChange}>
        {isPending ? (
          <div className="flex h-[300px] items-center justify-center">
            <Loading item={selectedItem!} />
          </div>
        ) : (
          <>
            <CommandInput
              placeholder="Search projects and tags"
              onValueChange={onValueChange}
            />
            {/* Two following lines are for debugging the loading state */}
            {false && <LoadingProject project={allProjects[1000]} />}
            {false && <LoadingTag tags={[allTags[10]]} />}
            {currentTags.length > 0 && (
              <div className="flex flex-wrap gap-2 border-b p-4">
                {currentTags.map((tag) => {
                  if (!tag) return null;
                  return (
                    <Badge key={tag.code} onClick={() => removeTag(tag.code)}>
                      {tag.name}
                      <XMarkIcon className="h-5 w-5" />
                    </Badge>
                  );
                })}
              </div>
            )}
            <CommandList>
              {isEmptySearchResults && (
                <CommandEmpty>No results found.</CommandEmpty>
              )}
              {searchQuery.length > 0 && !isEmptyProjects && (
                <CommandGroup heading="Projects">
                  {filteredProjects.slice(0, 10).map((project) => (
                    <div
                      key={project.slug}
                      className="grid gap-2 md:grid-cols-[1fr_40px_40px]"
                    >
                      <CommandItem
                        key={project.slug}
                        value={`project/` + project.slug}
                        onSelect={onSelectProject}
                      >
                        <div className="grid w-full grid-cols-[32px_1fr_100px] items-center gap-4">
                          <div className="items-center justify-center">
                            <ProjectAvatar project={project} size={32} />
                          </div>
                          <div>
                            {project.name}
                            <div className="truncate pt-2 text-xs text-muted-foreground">
                              {project.description}
                            </div>
                          </div>
                          <div className="text-right">
                            <StarTotal value={project.stars} />
                          </div>
                        </div>
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
                          <GoMarkGithub size={24} />
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
                            <GoHome size={24} />
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                  {searchQuery.length > 2 && (
                    <CommandItem
                      onSelect={onSelectSearchForText}
                      value={`search/${searchQuery}`}
                      className="grid w-full grid-cols-[32px_1fr] items-center gap-4"
                    >
                      <div className="flex justify-center">
                        <MagnifyingGlassIcon className="" />
                      </div>
                      <div>
                        Search for
                        <span className="ml-1 font-bold italic">
                          {searchQuery}
                        </span>
                      </div>
                    </CommandItem>
                  )}
                </CommandGroup>
              )}
              {!isEmptyTags && (
                <CommandGroup heading="Tags">
                  {filteredTags.slice(0, 20).map((tag) => (
                    <CommandItem
                      key={tag.code}
                      value={"tag/" + tag.code}
                      onSelect={onSelectTag}
                    >
                      <div className="flex">
                        <div className="flex w-8 items-center justify-center">
                          <TagIcon />
                        </div>
                        <span className="pl-4 pr-2">{tag.name}</span>
                        <div className="text-muted-foreground">
                          ({tag.counter})
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </>
        )}
      </CommandDialog>
    </>
  );
}

function filterTagsByQuery(tags: BestOfJS.Tag[], searchQuery: string) {
  const normalizedQuery = searchQuery.toLowerCase();

  return tags.filter(
    (tag) =>
      tag.code.includes(normalizedQuery) ||
      tag.name.toLowerCase().includes(normalizedQuery)
  );
}

function lookUpTag(tagCode: string, allTags: BestOfJS.Tag[]) {
  return allTags.find((tag) => tag.code === tagCode);
}

function Loading({ item }: { item: SelectedItem }) {
  if (item.type === "project") {
    return <LoadingProject project={item.value} />;
  }
  if (item.type === "tag") {
    return <LoadingTag tags={item.value} />;
  }
  return <>Loading</>;
}

function LoadingProject({ project }: { project: BestOfJS.SearchIndexProject }) {
  return (
    <div className="p-4">
      <div className="grid grid-cols-[75px_1fr_100px]">
        <div className="items-center justify-center">
          <ProjectAvatar project={project} size={50} />
        </div>
        <div className="space-y-2">
          <div className="text-lg">
            Loading <i>{project.name}</i>...
          </div>
          <div>{project.description}</div>
        </div>
        <div className="text-right">
          <StarTotal value={project.stars} />
        </div>
      </div>
      <div className="mt-8 space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}

function LoadingTag({ tags }: { tags: BestOfJS.Tag[] }) {
  return (
    <div className="w-full p-4">
      <div className="grid w-full grid-cols-[75px_1fr] items-center gap-4">
        <div className="flex w-full items-center justify-center">
          <TagIcon size={50} />
        </div>
        <div className="space-y-2">
          {tags.length === 1 ? (
            <>
              <span className="text-lg">
                Loading <i>{tags[0].name}</i> tag...
              </span>
              <div className="text-muted-foreground">
                {tags[0].counter} projects
              </div>
            </>
          ) : (
            <div>
              Loading projects with {tags.map((tag) => tag.name).join(" + ")}{" "}
              tags...
            </div>
          )}
        </div>
      </div>
      <div className="mt-8 space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}
