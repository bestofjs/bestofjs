import { count, eq, max } from "drizzle-orm";

import type { DB } from "../../index";
import * as schema from "../../schema";
import { getWhereClauseActiveScope } from "./find-with-trends";

const { projects, projectTrends, repos, repoTrends } = schema;

export type ProjectsStats = {
  /** Every curated project, deprecated and unmaintained ones included. */
  total: number;
  /** Subset with no warning badge — same rule as `scope: "active"`. */
  activeTotal: number;
  /**
   * Last write of the daily trends pipeline, or `null` before it has ever run.
   * See `getProjectsStats()` for why this is the freshness signal.
   */
  lastUpdateDate: Date | null;
};

/**
 * Catalog-level numbers for the home page's "Do you want more projects?"
 * section.
 *
 * `lastUpdateDate` is the newest `updated_at` across the two trend cache
 * tables. Without a job-completion table that is the closest available proxy
 * for "when was the data computed": it is the last write of the daily pipeline
 * and it comes from the very tables the page renders from, so a failed run
 * makes the displayed date visibly stop advancing instead of a rebuilt page
 * claiming false freshness. The newer of the two maxima rather than just
 * `project_trends` so it survives a reordering of the two passes.
 */
export async function getProjectsStats({
  db,
}: {
  db: DB;
}): Promise<ProjectsStats> {
  const [totalRows, activeRows, repoTrendsRows, projectTrendsRows] =
    await Promise.all([
      db.select({ count: count() }).from(projects),
      db
        .select({ count: count() })
        .from(projects)
        .innerJoin(repos, eq(projects.repoId, repos.id))
        // LEFT JOIN, matching `findProjectsWithTrends()`: a project added since
        // the last daily run has no cache row yet, and `getWhereClauseActiveScope()`
        // treats its null scores as "not computed", not as a reason to hide it.
        .leftJoin(repoTrends, eq(repoTrends.repoId, repos.id))
        .where(getWhereClauseActiveScope()),
      // `max()` keeps the column itself as the decoder, so these come back as
      // `Date`s built the same way as everywhere else: the columns are
      // `timestamp without time zone` holding UTC, and Drizzle's timestamp
      // decoder appends `+0000` before parsing. No local-timezone shift.
      db
        .select({ updatedAt: max(repoTrends.updatedAt) })
        .from(repoTrends),
      db
        .select({ updatedAt: max(projectTrends.updatedAt) })
        .from(projectTrends),
    ]);

  const updateDates = [
    repoTrendsRows[0]?.updatedAt,
    projectTrendsRows[0]?.updatedAt,
  ].filter((date): date is Date => date != null);

  return {
    total: totalRows[0].count,
    activeTotal: activeRows[0].count,
    lastUpdateDate: updateDates.length
      ? new Date(Math.max(...updateDates.map((date) => date.getTime())))
      : null,
  };
}
