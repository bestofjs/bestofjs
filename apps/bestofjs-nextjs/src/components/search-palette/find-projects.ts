import { filterProjectsByQuery } from "@/lib/search-utils";

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
