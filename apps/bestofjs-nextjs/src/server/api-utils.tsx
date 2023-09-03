import slugify from "slugify";

import { shuffle } from "@/helpers/shuffle";

export const FETCH_ALL_PROJECTS_URL = "https://bestofjs-static-api.vercel.app";

export type Data = {
  projectCollection: BestOfJS.RawProject[];
  featuredProjectIds: BestOfJS.Project["slug"][];
  tagCollection: BestOfJS.RawTag[];
  tagsByKey: { [key: string]: BestOfJS.Tag };
  populate: (project: BestOfJS.RawProject) => BestOfJS.Project;
  projectsBySlug: { [key: string]: BestOfJS.RawProject };
  lastUpdateDate: Date;
};

export const populateProject =
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

export function getFeaturedRandomList(projects: BestOfJS.RawProject[]) {
  const slugs = projects
    .filter((project) => project.isFeatured)
    .map((project) => getProjectId(project));

  return shuffle(slugs);
}

// TODO add types: => [[ 'nodejs-framework', 6 ], [...], ...]
export function getResultRelevantTags(
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
export function getProjectId(project: BestOfJS.RawProject) {
  return slugify(project.name, { lower: true, remove: /[.'/]/g });
}

export function getTagsByKey(
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
