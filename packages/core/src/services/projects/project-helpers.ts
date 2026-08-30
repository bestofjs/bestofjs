import isAbsoluteURL from "is-absolute-url";
import slugify from "slugify";
import invariant from "tiny-invariant";

import { TAGS_EXCLUDED_FROM_RANKINGS } from "../../constants";
import { computeTrends } from "../snapshots/compute-trends";
import { getMonthlyTrends } from "../snapshots/monthly-trends";
import type { OneYearSnapshots, ProjectDetails } from ".";

export function getProjectDescription(project: ProjectDetails) {
  invariant(project.repo);
  return resolveProjectDescription({
    description: project.description,
    overrideDescription: project.overrideDescription,
    repoDescription: project.repo.description,
  });
}

export function getProjectRepositoryURL(project: ProjectDetails) {
  return "https://github.com/" + project.repo.owner + "/" + project.repo.name;
}

export function getProjectURL(project: ProjectDetails) {
  invariant(project.repo);
  return resolveProjectURL({
    overrideURL: project.overrideURL,
    repoHomepage: project.repo.homepage,
    url: project.url,
  });
}

/**
 * Shared by `getProjectDescription()` and any query (e.g.
 * `findProjectsWithTrends()`) that needs the same override rule without
 * loading the full `ProjectDetails` shape.
 */
export function resolveProjectDescription({
  description,
  overrideDescription,
  repoDescription,
}: {
  description: string;
  overrideDescription: boolean | null;
  repoDescription: string | null;
}) {
  return overrideDescription ? description : repoDescription || description;
}

/** Shared by `getProjectURL()` and `findProjectsWithTrends()` — see `resolveProjectDescription()`. */
export function resolveProjectURL({
  overrideURL,
  repoHomepage,
  url,
}: {
  overrideURL: boolean | null;
  repoHomepage: string | null;
  url: string | null;
}) {
  if (overrideURL) return url;
  return repoHomepage && isValidProjectURL(repoHomepage) ? repoHomepage : url;
}

export function getProjectTrends(snapshots: OneYearSnapshots[], date?: Date) {
  const flattenedSnapshots = flattenSnapshots(snapshots);
  return computeTrends(flattenedSnapshots, date);
}

export function getProjectMonthlyTrends(
  snapshots: OneYearSnapshots[],
  date?: Date,
) {
  const flattenedSnapshots = flattenSnapshots(snapshots);
  return getMonthlyTrends(flattenedSnapshots, date || new Date());
}

export function flattenSnapshots(records: OneYearSnapshots[]) {
  // return orderBy(records, (record) => record.year, "desc") // most recent first
  return records.flatMap(({ year, months }) =>
    months.flatMap(({ month, snapshots }) =>
      snapshots.flatMap(({ day, stars }) => ({ year, month, day, stars })),
    ),
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
  project: Pick<ProjectDetails, "tags">,
) {
  const hasExcludedTag = TAGS_EXCLUDED_FROM_RANKINGS.some((tagCode) =>
    project.tags.map((tag) => tag.code).includes(tagCode),
  );
  return !hasExcludedTag;
}

export function generateProjectDefaultSlug(name: string) {
  return slugify(name).toLowerCase().replaceAll(".", "").replaceAll("'", "");
}

export function isGPLProject(project: ProjectDetails) {
  return project.repo.license?.includes("General Public License");
}

export function getLicenseShortName(license: string | null) {
  if (!license) {
    return null;
  }
  if (license.includes("Affero General Public License")) {
    return "AGPL";
  }
  if (license.includes("General Public License")) {
    return "GPL";
  }
  return null;
}

/** Customize the license name provided by GitHub */
export function getLicenseLongName(license: string | null) {
  if (!license) {
    return null;
  }
  if (license === "Other") {
    return "Custom license";
  }
  return license;
}
