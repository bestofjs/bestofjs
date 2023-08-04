import orderBy from "lodash/orderBy";

export function filterProjectsByTagsAndQuery<
  T extends Omit<BestOfJS.SearchIndexProject, "slug">
>(projects: T[], tags: string[], query: string) {
  return filterProjectsByQuery(filterProjectsByTags(projects, tags), query);
}

export function filterProjectsByTags<
  T extends Omit<BestOfJS.SearchIndexProject, "slug">
>(projects: T[], tags: string[]) {
  return projects.filter((project) =>
    tags.every((tag) => project.tags.includes(tag))
  );
}
// Used to filter projects when the user enters text in the search box
// Search results are sorted by "relevance"
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
    return 7;
  }

  if (startsWith.test(project.name)) {
    return 6;
  }

  // if (project.packageName && startsWith.test(project.packageName)) {
  //   return 5;
  // }

  if (query.length > 1) {
    if (contains.test(project.name)) {
      return 4;
    }
  }

  if (query.length > 2) {
    if (contains.test(project.description)) {
      return 3;
    }
    if (contains.test(project.full_name)) {
      return 2;
    }
    // if (contains.test(project.url)) {
    //   return 1;
    // }
  }

  // by default: the project is not included in search results
  return 0;
}

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
function escapeRegExp(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}
