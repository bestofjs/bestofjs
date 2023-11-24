"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import invariant from "tiny-invariant";
import useDebouncedCallback from "use-debounce/lib/useDebouncedCallback";

import {
  filterTagsByQueryWithRank,
  getResultRelevantTags,
  mergeSearchResults,
} from "@/lib/search-utils";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ProjectAvatar,
  StarTotal,
  TagIcon,
  TagsIcons,
  XMarkIcon,
} from "@/components/core";

import { stateToQueryString } from "../project-list/navigation-state";
import { useSearchState } from "../project-list/search-state";
import {
  filterProjectsByTags,
  filterProjectsByTagsAndQuery,
} from "./find-projects";
import {
  ProjectSearchResult,
  SearchForTextCommand,
  TagSearchResult,
  ViewAllTagsCommand,
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
  | (BestOfJS.Tag & { rank: number });

const DEBOUNCE_DELAY = 300;
const MAX_NUMBER_OF_PROJECT = 20;
const MAX_NUMBER_OF_TAG = 20;
const TEXT_QUERY_MIN_LENGTH = 2;

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

  const currentTags = currentTagCodes
    .map((tagCode) => lookUpTag(tagCode, allTags))
    .filter(Boolean) as BestOfJS.Tag[];
  const [open, setOpen] = React.useState(false);

  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const canTriggerSearch = searchQuery.length >= TEXT_QUERY_MIN_LENGTH; // we need at least 2 characters to trigger a search

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
  const [debouncedOnChange] = useDebouncedCallback(
    onValueChange,
    DEBOUNCE_DELAY
  );

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

  const onViewAllTags = () => {
    goToURL(`/tags`);
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
              placeholder={
                currentTags.length === 0
                  ? "Search projects and tags"
                  : `Search inside ${describeTags(currentTags)} tag${
                      currentTags.length > 1 ? "s" : ""
                    }`
              }
              onValueChange={debouncedOnChange}
            />
            {currentTags.length > 0 && (
              <div className="flex cursor-pointer flex-wrap gap-2 border-b p-4">
                {currentTags.map((tag) => {
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
              {!canTriggerSearch ? (
                <DefaultTags
                  allProjects={allProjects}
                  allTags={allTags}
                  currentTagCodes={currentTagCodes}
                  onSelectTag={onSelectTag}
                  onViewAllTags={onViewAllTags}
                  currentTags={currentTags}
                />
              ) : (
                <CombinedSearchResults
                  allProjects={allProjects}
                  allTags={allTags}
                  currentTagCodes={currentTagCodes}
                  searchQuery={searchQuery}
                  onSelectProject={onSelectProject}
                  onSelectTag={onSelectTag}
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

/**
 * Show a combination of projects and tags, ordered by rank, when the user enters a text.
 */
function CombinedSearchResults({
  allProjects,
  allTags,
  currentTagCodes,
  searchQuery,
  onSelectProject,
  onSelectTag,
  onSelectSearchForText,
}: Pick<SearchProps, "allProjects" | "allTags"> & {
  currentTagCodes: string[];
  searchQuery: string;
  onSelectProject: (projectSlug: string) => void;
  onSelectTag: (tagCode: string) => void;
  onSelectSearchForText: () => void;
}) {
  const currentTags = currentTagCodes
    .map((tagCode) => lookUpTag(tagCode, allTags))
    .filter(Boolean) as BestOfJS.Tag[];

  const projects = filterProjectsByTagsAndQuery(
    allProjects,
    currentTagCodes,
    searchQuery
  );
  const filteredProjects = projects.slice(0, MAX_NUMBER_OF_PROJECT);

  const foundTagsWithRank = filterTagsByQueryWithRank(allTags, searchQuery);
  const projectCount = filteredProjects.length;
  const tagCount = foundTagsWithRank.length;

  const [showProjects, setShowProjects] = React.useState(true);
  const [showTags, setShowTags] = React.useState(true);

  const toggleProjects = () => {
    setShowProjects((value) => !value);
    setShowTags(true);
  };
  const toggleTags = () => {
    setShowTags((value) => !value);
    setShowProjects(true);
  };

  const combinedResults: CombinedSearchResult[] = mergeSearchResults(
    showProjects ? filteredProjects : [],
    showTags ? foundTagsWithRank : []
  );

  const isEmptySearchResults = combinedResults.length === 0;

  usePrefetchFirstProject(filteredProjects);

  if (isEmptySearchResults) {
    return <CommandEmpty>No results found.</CommandEmpty>;
  }
  return (
    <CommandGroup
      heading={
        <SearchResultsHeading
          projectCount={projectCount}
          tagCount={tagCount}
          showProjects={showProjects}
          toggleProjects={toggleProjects}
          showTags={showTags}
          toggleTags={toggleTags}
        />
      }
    >
      {combinedResults.map((result) => {
        const key = isProject(result) ? result.slug : "tags/" + result.code;
        return (
          <React.Fragment key={key}>
            {isProject(result) ? (
              <ProjectSearchResult
                key={key}
                project={result}
                onSelectProject={onSelectProject}
              />
            ) : (
              <TagSearchResult
                key={key}
                tag={result}
                onSelectTag={onSelectTag}
                currentTags={currentTags}
              />
            )}
          </React.Fragment>
        );
      })}
      {!isEmptySearchResults && (
        <SearchForTextCommand
          searchQuery={searchQuery}
          onSelectSearchForText={onSelectSearchForText}
        />
      )}
    </CommandGroup>
  );
}

function usePrefetchFirstProject(projects: BestOfJS.SearchIndexProject[]) {
  const router = useRouter();
  React.useEffect(() => {
    if (projects.length === 0) return;
    const firstProject = projects[0];
    router.prefetch(`/projects/${firstProject.slug}`);
  }, [projects.length]); // eslint-disable-line react-hooks/exhaustive-deps
}

/**
 * Before any text is entered, show either the popular tags if there is no tag selected
 * or the tags related to the selected tag.
 */
function DefaultTags({
  allProjects,
  allTags,
  currentTagCodes,
  onSelectTag,
  currentTags,
  onViewAllTags,
}: Pick<SearchProps, "allProjects" | "allTags"> & {
  currentTagCodes: string[];
  onSelectTag: (tagCode: string) => void;
  onViewAllTags: () => void;
  currentTags: BestOfJS.Tag[];
}) {
  const projects = filterProjectsByTags(allProjects, currentTagCodes);
  const tags =
    currentTagCodes.length > 0
      ? (getResultRelevantTags(projects, currentTagCodes)
          .map(([tag]) => tag)
          .map((tagCode) => lookUpTag(tagCode, allTags))
          .filter(Boolean) as BestOfJS.Tag[])
      : allTags.slice(0, MAX_NUMBER_OF_TAG);
  return currentTags.length === 0 ? (
    <CommandGroup heading="Popular Tags">
      {tags.map((tag) => (
        <TagSearchResult
          key={tag.code}
          tag={tag}
          onSelectTag={onSelectTag}
          currentTags={[]}
        />
      ))}
      <ViewAllTagsCommand onSelect={onViewAllTags} />
    </CommandGroup>
  ) : (
    <CommandGroup heading="Related Tags">
      {tags.map((tag) => (
        <TagSearchResult
          key={tag.code}
          tag={tag}
          onSelectTag={onSelectTag}
          currentTags={currentTags}
        />
      ))}
    </CommandGroup>
  );
}

function SearchResultsHeading({
  projectCount,
  tagCount,
  showProjects,
  toggleProjects,
  showTags,
  toggleTags,
}: {
  projectCount: number;
  tagCount: number;
  showProjects: boolean;
  toggleProjects: () => void;
  showTags: boolean;
  toggleTags: () => void;
}) {
  return (
    <div className="hidden justify-between md:flex">
      <span>Search Results</span>
      <div className="flex items-center gap-4 text-sm">
        <label className="flex items-center gap-2">
          <Checkbox
            checked={showProjects}
            onCheckedChange={() => toggleProjects()}
          />
          <span>Projects</span>
          <Badge variant="outline">{projectCount}</Badge>
        </label>
        <Separator orientation="vertical" />
        <label className="flex items-center gap-2">
          <Checkbox checked={showTags} onCheckedChange={() => toggleTags()} />
          <span>Tags</span>
          <Badge variant="outline">{tagCount}</Badge>
        </label>
      </div>
    </div>
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
          {tags.length === 1 ? <TagIcon size={50} /> : <TagsIcons size={50} />}
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
            <div>Loading projects with {describeTags(tags)} tags...</div>
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

function describeTags(tags: BestOfJS.Tag[]) {
  return tags.map((tag) => "`" + tag.name + "`").join(" + ");
}
