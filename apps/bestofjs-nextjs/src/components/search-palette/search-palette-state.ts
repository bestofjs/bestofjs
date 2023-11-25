"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import invariant from "tiny-invariant";
import useDebouncedCallback from "use-debounce/lib/useDebouncedCallback";

import { stateToQueryString } from "../project-list/navigation-state";
import { useSearchState } from "../project-list/search-state";

export type SearchProps = {
  allProjects: BestOfJS.SearchIndexProject[];
  allTags: BestOfJS.Tag[];
};

export type SelectedItem =
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

const DEBOUNCE_DELAY = 300;

export function useSearchPaletteState({ allProjects, allTags }: SearchProps) {
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

  return {
    currentTagCodes,
    currentTags,
    debouncedOnChange,
    isPending,
    removeTag,
    onOpenChange,
    onSelectTag,
    onSelectProject,
    onSelectSearchForText,
    onViewAllTags,
    open,
    searchQuery,
    selectedItem,
    setOpen,
    setSearchQuery,
  };
}

function lookUpTag(tagCode: string, allTags: BestOfJS.Tag[]) {
  return allTags.find((tag) => tag.code === tagCode);
}
