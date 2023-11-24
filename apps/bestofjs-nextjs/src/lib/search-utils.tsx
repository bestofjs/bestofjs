const DEBUG_MODE = false; // to show time spent in search functions
/**
 * Filter all projects when the user enters text in the search box
 * assigning a "rank" to each project.
 * Imported by both client components and server API.
 */
export function filterProjectsByQuery<
  T extends Omit<BestOfJS.SearchIndexProject, "slug">
>(projects: T[], query: string): Array<T & { rank: number }> {
  if (DEBUG_MODE) console.time(`Search projects "${query}"`);
  const results = orderByRank(
    projects
      .map((project) => ({ ...project, rank: rank(project, query) }))
      .filter((project) => project.rank > 0)
  );
  if (DEBUG_MODE) console.timeEnd(`Search projects "${query}"`);
  return results;
}

// for a given project and a query,
// return how much "relevant" is the project in the search results
// `tags` is an array of tags that match the text
function rank<T extends Omit<BestOfJS.SearchIndexProject, "slug">>(
  project: T,
  query: string
) {
  const escapedQuery = escapeRegExp(query);
  const equals = new RegExp("^" + escapedQuery + "$", "i");
  const startsWith = new RegExp("^" + escapedQuery, "i");
  const contains = new RegExp(escapedQuery.replace(/ /g, ".+"), "i"); // the query is split if it contains spaces

  if (equals.test(project.name)) {
    // top level relevance: project whose name or package name is what the user entered
    return 1;
  }

  if (startsWith.test(project.name)) {
    return 0.7;
  }

  if (query.length > 1) {
    if (contains.test(project.name)) {
      return 0.5;
    }
  }

  if (query.length > 2) {
    if (contains.test(project.description)) {
      return 0.4;
    }
    if (contains.test(project.full_name)) {
      return 0.2;
    }
  }

  // by default: the project is not included in search results
  return 0;
}

export function filterTagsByQueryWithRank(tags: BestOfJS.Tag[], query: string) {
  if (DEBUG_MODE) console.time(`Search tags "${query}"`);
  const foundTags = orderByRank(
    tags
      .map((tag) => ({ ...tag, rank: rankTags(tag, query) }))
      .filter((tag) => tag.rank > 0)
  );
  if (DEBUG_MODE) console.timeEnd(`Search tags "${query}"`);
  return foundTags;
}

function rankTags(tag: BestOfJS.Tag, query: string) {
  const escapedQuery = escapeRegExp(query);
  const equals = new RegExp("^" + escapedQuery + "$", "i");
  const startsWith = new RegExp("^" + escapedQuery, "i");
  const contains = new RegExp(escapedQuery.replace(/ /g, ".+"), "i"); // the query is split if it contains spaces

  if (equals.test(tag.name) || equals.test(tag.code)) {
    return 1;
  }
  if (
    query.length > 1 &&
    (startsWith.test(tag.name) || startsWith.test(tag.code))
  ) {
    return 0.8;
  }
  if (contains.test(tag.name) || contains.test(tag.code)) {
    return 0.6;
  }

  return 0;
}

export function mergeSearchResults<T extends { rank: number }>(
  projectResults: T[],
  tagResults: Array<BestOfJS.Tag & { rank: number }>
) {
  const results = [...projectResults, ...tagResults];
  return orderByRank(results);
}

/**
 * Given a list of projects (E.g. a search result),
 * return the of tags ordered by number of occurrences
 * E.g. [[ 'nodejs-framework', 6 ], [...], ...]
 * @returns {Array<[tag: string, count: number]>}
 */
export function getResultRelevantTags<
  T extends Omit<BestOfJS.SearchIndexProject, "slug">
>(projects: T[], excludedTags: string[] = []) {
  if (DEBUG_MODE) console.time(`Get relevant tags ${projects.length}`);
  const projectCountByTag = getTagsNumberOfOccurrencesFromProjects(
    projects,
    excludedTags
  );

  const results = orderByFn(
    Array.from(projectCountByTag.entries()),
    ([, count]) => count as number
  ) as Array<[tag: string, count: number]>;
  if (DEBUG_MODE) console.timeEnd(`Get relevant tags ${projects.length}`);
  return results;
}

function getTagsNumberOfOccurrencesFromProjects<
  T extends Omit<BestOfJS.SearchIndexProject, "slug">
>(projects: T[], excludedTagIds: string[] = []) {
  const result = new Map<string, number>();
  projects.forEach((project) => {
    project.tags
      .filter((tag) => !excludedTagIds.includes(tag))
      .forEach((tagId) => {
        const count = result.get(tagId);
        if (count) {
          result.set(tagId, count + 1);
        } else {
          result.set(tagId, 1);
        }
      });
  });
  return result;
}

function orderByRank<T extends { rank: number }>(items: T[]) {
  return orderByFn<T>(items, (item) => item.rank);
}

function orderByFn<T>(items: T[], fn: (item: T) => number) {
  return items.sort((a, b) => fn(b) - fn(a));
}

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
function escapeRegExp(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}
