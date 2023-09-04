import * as mingo from "mingo";
import { RawObject } from "mingo/types";

import { APIContext } from "./api-utils";

const defaultTagSearchQuery = {
  criteria: {},
  sort: {},
  limit: 20,
  skip: 0,
};

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

export function createTagsAPI({ getData }: APIContext) {
  function findRawProjects(
    projectCollection: BestOfJS.RawProject[],
    searchQuery: QueryParams
  ) {
    const { criteria, projection, sort, skip, limit } = searchQuery;
    let cursor = mingo.find(projectCollection, criteria, projection);
    const total = cursor.count();

    const projects = mingo
      .find(projectCollection, criteria, projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .all() as BestOfJS.RawProject[];

    return { projects, total };
  }

  return {
    async findTags(rawSearchQuery: Partial<QueryParams>) {
      const searchQuery = { ...defaultTagSearchQuery, ...rawSearchQuery };
      const { criteria, sort, skip, limit } = searchQuery;
      const { tagCollection } = await getData();
      const query = new mingo.Query(criteria);
      let cursor = query.find(tagCollection);
      const total = cursor.count();

      const tags = query
        .find(tagCollection)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .all() as BestOfJS.Tag[];

      return {
        tags,
        total,
      };
    },
    // return tags with the most popular projects, for each tag (used for `/tags` page)
    async findTagsWithProjects(rawSearchQuery: Partial<QueryParams>) {
      const searchQuery = { ...defaultTagSearchQuery, ...rawSearchQuery };
      const { criteria, sort, skip, limit } = searchQuery;
      const { populate, projectCollection, tagCollection } = await getData();
      const query = new mingo.Query(criteria || {});
      let cursor = query.find(tagCollection);
      const total = cursor.count();

      const tags = query
        .find(tagCollection)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .all() as BestOfJS.TagWithProjects[];

      for await (const tag of tags) {
        const searchQuery = normalizeSearchQuery({
          criteria: { tags: { $in: [tag.code] } },
          sort: { stars: -1 },
          limit: 5,
          projection: { name: 1, owner_id: 1, icon: 1 },
        });
        const { projects } = await findRawProjects(
          projectCollection,
          searchQuery
        );

        tag.projects = projects.map(populate);
      }

      return {
        tags,
        total,
      };
    },
  };
}

function normalizeSearchQuery(rawSearchQuery: Partial<QueryParams>) {
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
