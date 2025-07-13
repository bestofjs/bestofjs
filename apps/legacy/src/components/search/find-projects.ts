import { paginateItemList } from "components/core/pagination";
import { getFullProject, sortProjectsByFunction } from "selectors";

export function findProjects(
  projects,
  tagsById,
  auth,
  { tags, query, page = 1, selector, direction, limit },
) {
  const filterByTag = (project) =>
    tags.every((tagId) => project.tags.includes(tagId));

  const filteredProjects = projects.filter((project) => {
    if (tags.length > 0) {
      if (!filterByTag(project)) return false;
    }
    return true;
  });

  const foundProjects = query
    ? filterProjectsByQuery(filteredProjects, query)
    : filteredProjects;

  const sortedProjects = sortProjectsByFunction(
    foundProjects,
    selector,
    direction,
  );

  const relevantTags =
    (tags.length > 0 || query) &&
    getResultRelevantTags(sortedProjects as BestOfJS.StateProject[], tags);

  const paginatedProjects = paginateItemList(sortedProjects, page, { limit });

  const results = paginatedProjects.map(getFullProject(tagsById, auth));

  return {
    results,
    relevantTags,
    total: foundProjects.length,
  };
}

// Used to filter projects when the user enters text in the search box
// Search results are sorted by "relevance"
export function filterProjectsByQuery(projects, query) {
  return projects
    .map((project) => ({ ...project, rank: rank(project, query) }))
    .filter((project) => project.rank > 0);
}

// for a given project and a query,
// return how much "relevant" is the project in the search results
// `tags` is an array of tags that match the text
function rank(project, query) {
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

  if (project.packageName && startsWith.test(project.packageName)) {
    return 5;
  }

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
    if (contains.test(project.url)) {
      return 1;
    }
  }

  // by default: the project is not included in search results
  return 0;
}

function getResultRelevantTags(
  projects: BestOfJS.StateProject[],
  excludedTags = [],
) {
  const projectCountByTag = getTagsFromProjects(projects, excludedTags);
  return orderBy(Array.from(projectCountByTag.entries()), ([, count]) => count);
}

function orderBy<T>(items: T[], fn: (element: T) => number) {
  return items.sort((a, b) => fn(b) - fn(a));
}

function getTagsFromProjects(
  projects: BestOfJS.StateProject[],
  excludedTagIds: string[] = [],
) {
  const result = new Map<string, number>();
  projects.forEach((project) => {
    project.tags
      .filter((tagId) => !excludedTagIds.includes(tagId))
      .forEach((tagId) => {
        if (result.has(tagId)) {
          result.set(tagId, result.get(tagId)! + 1); // eslint-disable-line @typescript-eslint/no-non-null-assertion
        } else {
          result.set(tagId, 1);
        }
      });
  });
  return result;
}

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}
