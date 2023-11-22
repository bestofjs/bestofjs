import {
  filterProjectsByQuery,
  getResultRelevantTags,
} from "@/lib/search-utils";

export function filterProjectsByTagsAndQuery<
  T extends Omit<BestOfJS.SearchIndexProject, "slug">
>(projects: T[], tags: string[], query: string) {
  const foundProjects = filterProjectsByQuery(
    filterProjectsByTags(projects, tags),
    query
  );
  const relevantTags = getResultRelevantTags(foundProjects, tags).map(
    ([tag]) => tag
  );
  return { projects: foundProjects, relevantTags };
}

export function filterProjectsByTags<
  T extends Omit<BestOfJS.SearchIndexProject, "slug">
>(projects: T[], tags: string[]) {
  return projects.filter((project) =>
    tags.every((tag) => project.tags.includes(tag))
  );
}
