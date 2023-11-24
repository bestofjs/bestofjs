import { filterProjectsByQuery } from "@/lib/search-utils";

export function filterProjectsByTagsAndQuery<
  T extends Omit<BestOfJS.SearchIndexProject, "slug">
>(projects: T[], tags: string[], query: string) {
  // STEP 1: filter projects by tags
  const filteredProjects = filterProjectsByTags(projects, tags);

  //STEP 2: filter projects by text query
  const foundProjects = filterProjectsByQuery(filteredProjects, query);

  return foundProjects;
}

export function filterProjectsByTags<
  T extends Omit<BestOfJS.SearchIndexProject, "slug">
>(projects: T[], tags: string[]) {
  return projects.filter((project) =>
    tags.every((tag) => project.tags.includes(tag))
  );
}
