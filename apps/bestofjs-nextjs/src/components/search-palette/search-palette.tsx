"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import invariant from "tiny-invariant";

import {
  filterTagsByQueryWithRank,
  mergeSearchResults,
} from "@/lib/search-utils";
import { Badge } from "@/components/ui/badge";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";

import { ProjectAvatar, StarTotal, TagIcon, XMarkIcon } from "../core";
import { stateToQueryString } from "../project-list/navigation-state";
import { useSearchState } from "../project-list/search-state";
import { filterProjectsByTagsAndQuery } from "./find-projects";
import {
  ProjectSearchResult,
  SearchForTextCommand,
  TagSearchResult,
} from "./search-palette-results";
import { SearchTrigger } from "./search-trigger";

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

type CombinedSearchResult =
  | (BestOfJS.SearchIndexProject & { rank: number })
  | (BestOfJS.Tag & { rank?: number });

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

  const MAX_NUMBER_OF_PROJECT = 8;
  const filteredProjects = searchQuery
    ? filterProjectsByTagsAndQuery(
        allProjects,
        currentTagCodes,
        searchQuery
      ).slice(0, MAX_NUMBER_OF_PROJECT)
    : [];

  React.useEffect(() => {
    if (searchQuery.length < 3) return;
    if (filteredProjects.length === 0) return;
    const firstProject = filteredProjects[0];
    router.prefetch(`/projects/${firstProject.slug}`);
  }, [searchQuery, filteredProjects.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const popularTags = allTags.slice(0, 20);

  const foundTagsWithRank = filterTagsByQueryWithRank(allTags, searchQuery);
  const combinedResults: CombinedSearchResult[] = searchQuery
    ? mergeSearchResults(filteredProjects, foundTagsWithRank)
    : popularTags;

  const onSelectProject = (itemValue: string) => {
    const projectSlug = itemValue.slice("project/".length);
    const project = allProjects.find((project) => project.slug === projectSlug);
    invariant(project, `Project not found: ${projectSlug}`);
    setSelectedItem({ type: "project", value: project });
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

  const isEmptySearchResults = combinedResults.length === 0;

  return (
    <>
      <SearchTrigger onClick={() => setOpen(true)} />
      <CommandDialog open={open} onOpenChange={onOpenChange}>
        {isPending && selectedItem ? (
          <div className="flex h-[300px] items-center justify-center">
            <Loading item={selectedItem} />
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
              <div className="flex cursor-pointer flex-wrap gap-2 border-b p-4">
                {currentTags.map((tag) => {
                  if (!tag) return null;
                  return (
                    <Badge key={tag.code} onClick={() => removeTag(tag.code)}>
                      {tag.name}
                      <XMarkIcon size={20} />
                    </Badge>
                  );
                })}
              </div>
            )}
            <CommandList>
              {isEmptySearchResults && (
                <CommandEmpty>No results found.</CommandEmpty>
              )}
              {combinedResults.map((result) => {
                const key = isProject(result)
                  ? result.slug
                  : "tags/" + result.code;
                return (
                  <div key={key} className="border-b border-dashed">
                    {isProject(result) ? (
                      <ProjectSearchResult
                        project={result}
                        onSelectProject={onSelectProject}
                      />
                    ) : (
                      <TagSearchResult tag={result} onSelectTag={onSelectTag} />
                    )}
                  </div>
                );
              })}
              {!isEmptySearchResults && searchQuery.length > 1 && (
                <SearchForTextCommand
                  searchQuery={searchQuery}
                  onSelectSearchForText={onSelectSearchForText}
                />
              )}
            </CommandList>
          </>
        )}
      </CommandDialog>
    </>
  );
}

function isProject(
  result: CombinedSearchResult
): result is BestOfJS.SearchIndexProject & { rank: number } {
  return "stars" in result;
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
