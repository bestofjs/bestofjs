import path from "node:path";
import { shuffle } from "@/helpers/shuffle";
import debugModule from "debug";
import fs from "fs-extra";
import * as mingo from "mingo";
import { RawObject } from "mingo/types";
import slugify from "slugify";

import { filterProjectsByQuery } from "@/components/search-palette/find-projects";

// const FETCH_ALL_PROJECTS_URL = process.env.JSON_API;
const FETCH_ALL_PROJECTS_URL = "https://bestofjs-static-api.vercel.app";

const debug = debugModule("bestofjs");

type RawData = {
  projects: BestOfJS.RawProject[];
  tags: BestOfJS.RawTag[];
  date: Date;
};

type Data = {
  projectCollection: BestOfJS.RawProject[];
  featuredProjectIds: BestOfJS.Project["slug"][];
  tagCollection: BestOfJS.RawTag[];
  tagsByKey: { [key: string]: BestOfJS.Tag };
  populate: (project: BestOfJS.RawProject) => BestOfJS.Project;
  projectsBySlug: { [key: string]: BestOfJS.RawProject };
  lastUpdateDate: Date;
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

const defaultTagSearchQuery = {
  criteria: {},
  sort: {},
  limit: 20,
  skip: 0,
};

export function createSearchClient() {
  let data: Data;
  async function getData() {
    return data || (await fetchData());
  }

  async function fetchData() {
    const { projects, tags: rawTags, date } = await fetchProjectData();
    const tagsByKey = getTagsByKey(rawTags, projects);
    const projectsBySlug: Data["projectsBySlug"] = {};
    projects.forEach((project) => {
      projectsBySlug[getProjectId(project)] = project;
    });
    const featuredProjectIds = getFeaturedRandomList(projects);

    data = {
      projectCollection: projects,
      featuredProjectIds,
      tagCollection: Object.values(tagsByKey),
      populate: populateProject(tagsByKey),
      tagsByKey,
      projectsBySlug,
      lastUpdateDate: date,
    };
    return data;
  }

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

  function findProjectsAndRelatedTags(
    projectCollection: BestOfJS.RawProject[],
    searchQuery: QueryParams,
    query: string
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
      (criteria.tags && "$all" in criteria?.tags && criteria?.tags?.$all) || [];

    const relevantTagIds = getResultRelevantTags(
      foundProjects,
      selectedTagIds
    ).map(([id /*, count*/]) => id); // TODO include number of projects by tag?
    return {
      projects: paginatedProjects,
      total: foundProjects.length,
      relevantTagIds,
    };
  }

  return {
    async findProjects(rawSearchQuery: Partial<QueryParams>) {
      const searchQuery = normalizeSearchQuery(rawSearchQuery);
      debug("Find", searchQuery);
      const { criteria, query } = searchQuery;
      const { projectCollection, populate, tagsByKey, lastUpdateDate } =
        await getData();

      const {
        projects: rawProjects,
        total,
        relevantTagIds,
      } = findProjectsAndRelatedTags(projectCollection, searchQuery, query);

      const projects = rawProjects.map(populate);

      const selectedTagIds: string[] = (criteria?.tags as any)?.$all || [];
      const selectedTags = selectedTagIds.map((tag) => tagsByKey[tag]);

      const relevantTags = relevantTagIds.map((tag) => tagsByKey[tag]);

      return {
        projects,
        total,
        selectedTags,
        relevantTags,
        lastUpdateDate,
      };
    },

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

    async findOne(criteria: RawObject): Promise<BestOfJS.Project | null> {
      const { projectCollection, populate } = await getData();
      const query = new mingo.Query(criteria);
      const cursor = query.find(projectCollection);
      const projects = cursor.limit(1).all() as BestOfJS.RawProject[];
      return projects.length ? populate(projects[0]) : null;
    },

    async findRandomFeaturedProjects({
      skip = 0,
      limit = 5,
    }: Pick<QueryParams, "skip" | "limit">) {
      const { populate, projectsBySlug } = await getData();
      const { featuredProjectIds } = data;
      const slugs = featuredProjectIds.slice(skip, skip + limit);
      const projects = slugs.map((slug) => populate(projectsBySlug[slug]));
      return { projects, total: featuredProjectIds.length };
    },

    async getProjectBySlug(slug: string) {
      const { populate, projectsBySlug } = await getData();
      return populate(projectsBySlug[slug]);
    },

    async getSearchIndex() {
      const { projectCollection } = await getData();
      const projection = {
        full_name: 1,
        name: 1,
        owner_id: 1,
        icon: 1,
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

      return rawProjects.map((project) => ({
        ...project,
        slug: getProjectId(project),
      })) as BestOfJS.SearchIndexProject[];
    },

    async findHallOfFameMembers() {
      const { populate, projectsBySlug } = await getData();
      const { heroes } = await fetchHallOfFameData();

      const populateMemberProjects = (member: BestOfJS.RawHallOfFameMember) => {
        const projects: BestOfJS.Project[] = member.projects
          .map((projectSlug) => projectsBySlug[projectSlug])
          .filter(Boolean) // needed as some members are linked to deprecated projects. TODO fix Hall fo fame data?
          .map(populate);
        return {
          ...member,
          projects,
        } as BestOfJS.HallOfFameMember;
      };

      // Include only members who have active projects on Best of JS
      // or a custom "bio" (used to describe book authors and speakers for example)
      const filterMember = (member: BestOfJS.HallOfFameMember) => {
        return (
          member.followers > 100 && (member.projects.length > 0 || member.bio)
        );
      };

      const members = heroes.map(populateMemberProjects).filter(filterMember);
      return { members };
    },
  };
}

export const searchClient = createSearchClient();

function getTagsByKey(
  tags: BestOfJS.RawTag[],
  projects: BestOfJS.RawProject[]
) {
  const byKey = tags.reduce((acc, tag) => {
    return { ...acc, [tag.code]: tag };
  }, {}) as { [tag: string]: BestOfJS.Tag };

  projects.forEach(({ tags }) => {
    tags.forEach((tag) => {
      byKey[tag].counter = byKey[tag].counter ? byKey[tag].counter! + 1 : 1;
    });
  });

  return byKey;
}

const populateProject =
  (tagsByKey: { [key: string]: BestOfJS.Tag }) =>
  (project: BestOfJS.RawProject) => {
    const populated = { ...project } as unknown as BestOfJS.Project;
    const { full_name, tags } = project;

    if (full_name) {
      populated.repository = "https://github.com/" + full_name;
    }

    if (tags) {
      populated.tags = tags.map((id) => tagsByKey[id]).filter((tag) => !!tag);
    }

    populated.slug = getProjectId(project);

    if (project.npm) {
      populated.packageName = project.npm; // TODO fix data?
    }

    return populated;
  };

async function fetchProjectData(): Promise<{
  projects: BestOfJS.RawProject[];
  tags: BestOfJS.RawTag[];
  date: Date;
}> {
  try {
    const useFileSystem = true;
    const data = useFileSystem
      ? await fetchDataFromFileSystem()
      : await fetchDataFromRemoteJSON();

    return data as RawData;
  } catch (error) {
    console.error("Unable to fetch data!", (error as Error).message);
    throw error;
  }
}

function fetchDataFromRemoteJSON() {
  const url = FETCH_ALL_PROJECTS_URL + `/projects.json`;
  console.log(`Fetching JSON data from ${url}`);
  const options = { next: { revalidate: 60 * 60 } }; // Revalidate in one hour
  return fetch(url, options).then((res) => res.json());
}

function fetchDataFromFileSystem() {
  console.log("Fetch from the file system");
  const filepath = path.join(process.cwd(), "public", "data/projects.json");
  return fs.readJSON(filepath);
}

function fetchHallOfFameData() {
  const url = FETCH_ALL_PROJECTS_URL + `/hof.json`;
  console.log(`Fetching Hall of Fame data from ${url}`);
  return fetch(url).then((res) => res.json()) as Promise<{
    heroes: BestOfJS.RawHallOfFameMember[];
  }>;
}

function getFeaturedRandomList(projects: BestOfJS.RawProject[]) {
  const slugs = projects
    .filter((project) => project.isFeatured)
    .map((project) => getProjectId(project));

  return shuffle(slugs);
}

// TODO add types: => [[ 'nodejs-framework', 6 ], [...], ...]
function getResultRelevantTags(
  projects: BestOfJS.RawProject[],
  excludedTags: string[] = []
) {
  const projectCountByTag = getTagsNumberOfOccurrencesFromProjects(
    projects,
    excludedTags
  );

  return orderBy(
    Array.from(projectCountByTag.entries()),
    ([_, count]) => count as number
  ).slice(0, 10) as Array<[tag: string, count: number]>;
}

function orderBy<T>(items: T[], fn: (item: T) => number) {
  return items.sort((a, b) => fn(b) - fn(a));
}

function getTagsNumberOfOccurrencesFromProjects(
  projects: BestOfJS.RawProject[],
  excludedTagIds: string[] = []
) {
  const result = new Map<string, number>();
  projects.forEach((project) => {
    project.tags
      .filter((tag) => !excludedTagIds.includes(tag))
      .forEach((tagId) => {
        if (result.has(tagId)) {
          result.set(tagId, result.get(tagId)! + 1);
        } else {
          result.set(tagId, 1);
        }
      });
  });
  return result;
}

// TODO read the project's slug from the API instead of computing it here
function getProjectId(project: BestOfJS.RawProject) {
  return slugify(project.name, { lower: true, remove: /[.'/]/g });
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
