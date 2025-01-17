import isAbsoluteURL from "is-absolute-url";
import slugify from "slugify";
import invariant from "tiny-invariant";

import { OneYearSnapshots, ProjectDetails } from ".";
import { TAGS_EXCLUDED_FROM_RANKINGS } from "../constants";
import { computeTrends, getMonthlyTrends } from "../snapshots/index";

export function getProjectDescription(project: ProjectDetails) {
  invariant(project.repo);
  const repoDescription = project.repo.description;
  return project.overrideDescription
    ? project.description
    : repoDescription || project.description;
}

export function getProjectRepositoryURL(project: ProjectDetails) {
  return "https://github.com/" + project.repo.owner + "/" + project.repo.name;
}

export function getProjectURL(project: ProjectDetails) {
  invariant(project.repo);
  if (project.overrideURL) return project.url;
  const homepage = project.repo.homepage;

  return homepage && isValidProjectURL(homepage) ? homepage : project.url;
}

export function getProjectTrends(snapshots: OneYearSnapshots[], date?: Date) {
  const flattenedSnapshots = flattenSnapshots(snapshots);
  return computeTrends(flattenedSnapshots, date);
}

export function getProjectMonthlyTrends(
  snapshots: OneYearSnapshots[],
  date?: Date
) {
  const flattenedSnapshots = flattenSnapshots(snapshots);
  return getMonthlyTrends(flattenedSnapshots, date || new Date());
}

export function flattenSnapshots(records: OneYearSnapshots[]) {
  // return orderBy(records, (record) => record.year, "desc") // most recent first
  return records.flatMap(({ year, months }) =>
    months.flatMap(({ month, snapshots }) =>
      snapshots.flatMap(({ day, stars }) => ({ year, month, day, stars }))
    )
  );
}

function isValidProjectURL(url: string) {
  if (!isAbsoluteURL(url)) {
    return false;
  }

  const invalidPatterns = [
    "npmjs.com/", // the package page on NPM site is not a valid homepage!
    "npm.im/",
    "npmjs.org/",
    "/github.com/", // GitHub repo page is not valid but GitHub sub-domains are valid
    "twitter.com/",
  ];

  if (invalidPatterns.some((re) => new RegExp(re).test(url))) {
    return false;
  }

  return true;
}

export function getPackageData(project: ProjectDetails) {
  const firstPackage = project.packages[0];
  return firstPackage
    ? {
        npm: firstPackage.name,
        downloads: firstPackage?.monthlyDownloads as number,
      }
    : null;
}

/**
 * Exclude from the rankings projects with specific tags
 * TODO: move this behavior to the `tag` record, adding an attribute `exclude_from_rankings`?
 **/
export function isProjectIncludedInRankings(
  project: Pick<ProjectDetails, "tags">
) {
  const hasExcludedTag = TAGS_EXCLUDED_FROM_RANKINGS.some((tagCode) =>
    project.tags.map((tag) => tag.code).includes(tagCode)
  );
  return !hasExcludedTag;
}

export function generateProjectDefaultSlug(name: string) {
  return slugify(name).toLowerCase().replaceAll(".", "").replaceAll("'", "");
}
