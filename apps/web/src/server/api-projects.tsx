import * as mingo from "mingo";
import type { RawObject } from "mingo/types";

import {
  filterProjectsByQuery,
  getResultRelevantTags,
} from "@/lib/search-utils";

import type { APIContext } from "./api-utils";

type QueryParams = {
  criteria: RawObject & {
    tags?: { $all: string[] } | { $in: string[] } | { $nin: string[] };
  };
  sort: RawObject;
  limit: number;
  skip: number;
  projection: RawObject;
  query: string;
};

export function createProjectsAPI({ getData }: APIContext) {
  function findProjectsAndRelatedTags(
    projectCollection: BestOfJS.RawProject[],
    searchQuery: QueryParams,
    query: string,
  ) {
    const { criteria, projection, sort, skip, limit } = searchQuery;

    const filteredProjects = mingo
      .find(projectCollection, criteria, projection)
      .sort(sort)
      .all() as BestOfJS.RawProject[];

    const foundProjects = query
      ? filterProjectsByQuery<BestOfJS.RawProject>(filteredProjects, query)
      : filteredProjects;

    const paginatedProjects = foundProjects.slice(skip, skip + limit);

    const selectedTagIds: string[] =
      (criteria.tags && "$all" in criteria.tags && criteria?.tags?.$all) || [];

    const relevantTagIds = getResultRelevantTags(foundProjects, selectedTagIds)
      .slice(0, 20)
      .map(([id /*, count*/]) => id); // TODO include number of projects by tag?
    return {
      projects: paginatedProjects,
      total: foundProjects.length,
      relevantTagIds,
    };
  }

  return {
    async findProjects(rawSearchQuery: Partial<QueryParams>) {
      const searchQuery = normalizeProjectSearchQuery(rawSearchQuery);
      const { criteria, query } = searchQuery;
      const { projectCollection, populate, tagsByKey, lastUpdateDate } =
        await getData();

      const {
        projects: rawProjects,
        total,
        relevantTagIds,
      } = findProjectsAndRelatedTags(projectCollection, searchQuery, query);

      const projects = rawProjects.map(populate);

      const selectedTagIds: string[] =
        (criteria.tags && "$all" in criteria.tags && criteria?.tags?.$all) ||
        [];
      const selectedTags = selectedTagIds
        .map((tag) => tagsByKey[tag])
        .filter(Boolean);

      const relevantTags = relevantTagIds
        .map((tag) => tagsByKey[tag])
        .filter(Boolean);

      return {
        projects,
        total,
        selectedTags,
        relevantTags,
        lastUpdateDate,
      };
    },

    async findOne(criteria: RawObject): Promise<BestOfJS.Project | null> {
      const { projectCollection, populate } = await getData();
      const query = new mingo.Query(criteria);
      const cursor = query.find(projectCollection);
      const projects = cursor.limit(1).all() as BestOfJS.RawProject[];
      return projects.length ? populate(projects[0]) : null;
    },

    async getProjectBySlug(slug: string) {
      const { populate, projectsBySlug, lastUpdateDate } = await getData();
      const project = projectsBySlug[slug]
        ? populate(projectsBySlug[slug])
        : undefined;
      return { project, lastUpdateDate };
    },

    async findRandomFeaturedProjects({
      skip = 0,
      limit = 5,
    }: Pick<QueryParams, "skip" | "limit">) {
      const { featuredProjectIds, populate, projectsBySlug } = await getData();
      const slugs = featuredProjectIds.slice(skip, skip + limit);
      const projects = slugs.map((slug) => populate(projectsBySlug[slug]));
      return { projects, total: featuredProjectIds.length };
    },

    async getStats() {
      const { projectCollection, lastUpdateDate } = await getData();
      return { lastUpdateDate, total: projectCollection.length };
    },

    async getSearchIndex() {
      const { projectCollection } = await getData();
      const projection = {
        full_name: 1,
        name: 1,
        slug: 1,
        owner_id: 1,
        logo: 1,
        npm: 1,
        description: 1,
        stars: 1,
        tags: 1,
        url: 1,
      };
      const rawProjects = mingo
        .find(projectCollection, {}, projection)
        .sort({ stars: -1 })
        .all() as BestOfJS.RawProject[];

      return rawProjects;
    },
  };
}

export function normalizeProjectSearchQuery(
  rawSearchQuery: Partial<QueryParams>,
) {
  const defaultQueryParams: QueryParams = {
    criteria: {},
    sort: { stars: -1 },
    limit: 20,
    skip: 0,
    projection: {},
    query: "",
  };
  return { ...defaultQueryParams, ...rawSearchQuery } as QueryParams;
}
