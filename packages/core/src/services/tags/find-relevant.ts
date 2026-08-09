import { and, count, desc, eq, gte, notInArray } from "drizzle-orm";

import type { DB } from "../../index";
import * as schema from "../../schema";
import {
  getWhereClauseSearchByTag,
  getWhereClauseSearchByText,
} from "../projects/find";
import {
  getWhereClauseActiveScope,
  type ProjectScope,
  resolveScope,
} from "../projects/find-with-trends";

const { projects, projectTrends, projectsToTags, repoTrends, repos, tags } =
  schema;

export interface FindRelevantTagsOptions {
  db: DB;
  /** Already-selected tag codes: scope to projects having ALL of them, exclude them from the output */
  tagCodes?: string[];
  /** Text search on project name/description and repo owner/name, same scoping as findProjectsWithTrends() */
  query?: string;
  /** Quality floor matching findProjectsWithTrends()'s default (off — full catalog); enable to hide low-signal projects */
  relevanceFloor?: boolean;
  /**
   * Must match the listing's scope. A suggestion derived from projects the
   * listing filters out is a dead end: the chip leads to "No projects found".
   */
  scope?: ProjectScope;
  limit?: number;
}

export interface RelevantTag {
  code: string;
  name: string;
  description: string | null;
  count: number;
}

/**
 * Tags that commonly co-occur with the current `findProjectsWithTrends()` result set,
 * excluding already-selected tags. Powers the "related tags" row on `/projects`.
 */
export async function findRelevantTags({
  db,
  tagCodes,
  query,
  relevanceFloor = false,
  scope = "active",
  limit = 20,
}: FindRelevantTagsOptions): Promise<RelevantTag[]> {
  const where = and(
    relevanceFloor ? gte(projectTrends.relevanceScore, 0) : undefined,
    // Same predicate and the same query-wins rule as the listing, imported
    // rather than restated so the two cannot drift.
    resolveScope(scope, query) === "active"
      ? getWhereClauseActiveScope()
      : undefined,
    query ? getWhereClauseSearchByText(query) : undefined,
    tagCodes && tagCodes.length > 0
      ? getWhereClauseSearchByTag(db, tagCodes)
      : undefined,
    tagCodes && tagCodes.length > 0
      ? notInArray(tags.code, tagCodes)
      : undefined,
  );

  return (
    db
      .select({
        code: tags.code,
        name: tags.name,
        description: tags.description,
        count: count(projectsToTags.projectId),
      })
      .from(tags)
      .innerJoin(projectsToTags, eq(projectsToTags.tagId, tags.id))
      .innerJoin(projects, eq(projects.id, projectsToTags.projectId))
      .leftJoin(projectTrends, eq(projectTrends.projectId, projects.id))
      .innerJoin(repos, eq(projects.repoId, repos.id))
      // LEFT, like the listing: deprecated repos have no row, and neither do
      // projects added since the last daily run.
      .leftJoin(repoTrends, eq(repoTrends.repoId, repos.id))
      .where(where)
      .groupBy(tags.id)
      .orderBy(desc(count(projectsToTags.projectId)))
      .limit(limit)
  );
}
