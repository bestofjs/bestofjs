import orderBy from "lodash/orderBy";

/**
 * Filter all projects when the user enters text in the search box
 * assigning a "rank" to each project.
 * Imported by both client components and server API.
 */
export function filterProjectsByQuery<
  T extends Omit<BestOfJS.SearchIndexProject, "slug">
>(projects: T[], query: string) {
  return orderBy(
    projects
      .map((project) => ({ ...project, rank: rank(project, query) }))
      .filter((project) => project.rank > 0),
    "rank",
    "desc"
  );
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
      return 0.6;
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

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
function escapeRegExp(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

export function filterTagsByQueryWithRank(tags: BestOfJS.Tag[], query: string) {
  return orderBy(
    tags
      .map((tag) => ({ ...tag, rank: rankTags(tag, query) }))
      .filter((tag) => tag.rank > 0),
    ["rank", "counter"],
    ["desc", "desc"]
  );
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
    return 0.5;
  }

  return 0;
}

export function mergeSearchResults<T extends { rank: number }>(
  projectResults: T[],
  tagResults: Array<BestOfJS.Tag & { rank: number }>
) {
  const results = [...projectResults, ...tagResults];
  return orderBy(results, "rank", "desc");
}
