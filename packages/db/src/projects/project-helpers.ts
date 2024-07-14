import { orderBy } from "lodash";
import isAbsoluteURL from "is-absolute-url";

import { computeTrends, getMonthlyTrends } from "../snapshots/index";
import { OneYearSnapshots, ProjectService } from ".";
import invariant from "tiny-invariant";

// interface ProjectWithSnapshots {
//   snapshots: OneYearSnapshots[];
// }

export function getProjectDescription(
  project: NonNullable<Awaited<ReturnType<ProjectService["getProjectBySlug"]>>>
) {
  invariant(project.repo);
  const repoDescription = project.repo.description;
  return project.overrideDescription
    ? project.description
    : repoDescription || project.description;
}

export function getProjectURL(
  project: NonNullable<Awaited<ReturnType<ProjectService["getProjectBySlug"]>>>
) {
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

function flattenSnapshots(records: OneYearSnapshots[]) {
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
