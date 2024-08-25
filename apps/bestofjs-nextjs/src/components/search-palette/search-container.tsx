"use client";

import invariant from "tiny-invariant";
import { createContainer } from "unstated-next";

import { filterProjectsByQuery, filterTagsByQuery } from "@/lib/search-utils";

function useClientSearch(initialState?: {
  projects: BestOfJS.SearchIndexProject[];
  tags: BestOfJS.Tag[];
}) {
  invariant(initialState, "Initial state is required");
  const { projects: allProjects, tags: allTags } = initialState || {};

  const findProjectsByQueryAndTags = (query: string, tags: string[]) => {
    const filteredProjects = filterProjectsByTags(allProjects, tags);
    const foundProjects = filterProjectsByQuery(filteredProjects, query);
    return foundProjects;
  };

  const findProjectsByTags = (tagCodes: string[]) => {
    return filterProjectsByTags(allProjects, tagCodes);
  };

  const findTagsByQuery = (
    searchQuery: string,
    excludedTags: string[] = []
  ) => {
    const tags = allTags.filter((tag) => !excludedTags.includes(tag.code));
    return filterTagsByQuery(tags, searchQuery);
  };

  const getAllTags = (limit = 50) => {
    return allTags.slice(0, limit);
  };

  const lookupProject = (slug: string) => {
    return allProjects.find((project) => project.slug === slug);
  };
  const lookupTag = (tagCode: string) => {
    return allTags.find((tag) => tag.code === tagCode);
  };

  return {
    findProjectsByQueryAndTags,
    findProjectsByTags,
    findTagsByQuery,
    getAllTags,
    lookupProject,
    lookupTag,
  };
}

export const ClientSearch = createContainer(useClientSearch);

function filterProjectsByTags<
  T extends Omit<BestOfJS.SearchIndexProject, "slug">,
>(projects: T[], tags: string[]) {
  return projects.filter((project) =>
    tags.every((tag) => project.tags.includes(tag))
  );
}
