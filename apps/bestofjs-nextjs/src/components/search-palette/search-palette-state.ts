"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import invariant from "tiny-invariant";
import useDebouncedCallback from "use-debounce/lib/useDebouncedCallback";

import { ClientSearch } from "./search-container";
import { useProjectSearchState } from "./search-state.client";

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

export function useSearchPaletteTags() {
  const { searchState, buildPageURL } = useProjectSearchState();
  const { lookupTag } = ClientSearch.useContainer();
  const [currentTagCodes, setCurrentTagCodes] = React.useState<string[]>(
    searchState.tags
  );

  // The search palette is mounted only once, we need to sync the tags when the URL changes
  React.useEffect(() => {
    setCurrentTagCodes(searchState.tags);
  }, [JSON.stringify(searchState.tags)]); // eslint-disable-line react-hooks/exhaustive-deps

  const removeTag = (tagCode: string) =>
    setCurrentTagCodes((state) => state.filter((tag) => tag !== tagCode));
  const resetCurrentTags = () => setCurrentTagCodes(searchState.tags);

  const currentTags = currentTagCodes
    .map(lookupTag)
    .filter(Boolean) as BestOfJS.Tag[];

  return {
    buildPageURL,
    currentTags,
    currentTagCodes,
    removeTag,
    resetCurrentTags,
    searchState,
  };
}

export function useSearchPaletteState() {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const { lookupProject, lookupTag } = ClientSearch.useContainer();

  const [selectedItem, setSelectedItem] = React.useState<
    SelectedItem | undefined
  >();

  const [open, setOpen] = React.useState(false);

  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const {
    currentTags,
    currentTagCodes,
    removeTag,
    resetCurrentTags,
    buildPageURL,
  } = useSearchPaletteTags();

  const onOpenChange = (value: boolean) => {
    if (!value) {
      resetCurrentTags();
      setSearchQuery("");
    }
    setOpen(value);
  };

  const onValueChange = (value: string) => {
    setSearchQuery(value);
  };
  const [debouncedOnChange] = useDebouncedCallback(
    onValueChange,
    DEBOUNCE_DELAY
  );

  const onSelectProject = (itemValue: string) => {
    const projectSlug = itemValue.slice("project/".length);
    const project = lookupProject(projectSlug);
    invariant(project, `Project not found: ${projectSlug}`);
    setSelectedItem({ type: "project", value: project });
    goToURL(`/projects/${projectSlug}`);
  };

  const onSelectTag = (itemValue: string) => {
    const selectedTagCode = itemValue.slice("tag/".length);
    const tagCodes = [...currentTagCodes, selectedTagCode];
    const tags = tagCodes.map(lookupTag).filter(Boolean) as BestOfJS.Tag[];
    setSelectedItem({ type: "tag", value: tags });
    const url = buildPageURL((state) => ({
      ...state,
      page: 1,
      tags: tagCodes,
    }));
    goToURL(url);
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

  useKeyboardShortcut(() => setOpen((open) => !open));

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
  };
}

function useKeyboardShortcut(callback: () => void) {
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        callback();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
