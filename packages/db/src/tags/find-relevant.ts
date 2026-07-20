import { and, count, desc, eq, gte, notInArray } from "drizzle-orm";

import type { DB } from "../index";
import {
  getWhereClauseSearchByTag,
  getWhereClauseSearchByText,
} from "../projects/find";
import * as schema from "../schema";

const { projects, projectTrends, projectsToTags, repos, tags } = schema;

export interface FindRelevantTagsOptions {
  db: DB;
  /** Already-selected tag codes: scope to projects having ALL of them, exclude them from the output */
  tagCodes?: string[];
  /** Text search on project name/description and repo owner/name, same scoping as findProjectsWithTrends() */
  query?: string;
  /** Quality floor matching findProjectsWithTrends()'s default; disable for the future /search route */
  relevanceFloor?: boolean;
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
  relevanceFloor = true,
  limit = 20,
}: FindRelevantTagsOptions): Promise<RelevantTag[]> {
  const where = and(
    relevanceFloor ? gte(projectTrends.relevanceScore, 0) : undefined,
    query ? getWhereClauseSearchByText(query) : undefined,
    tagCodes && tagCodes.length > 0
      ? getWhereClauseSearchByTag(db, tagCodes)
      : undefined,
    tagCodes && tagCodes.length > 0
      ? notInArray(tags.code, tagCodes)
      : undefined,
  );

  return db
    .select({
      code: tags.code,
      name: tags.name,
      description: tags.description,
      count: count(projectsToTags.projectId),
    })
    .from(tags)
    .innerJoin(projectsToTags, eq(projectsToTags.tagId, tags.id))
    .innerJoin(projects, eq(projects.id, projectsToTags.projectId))
    .innerJoin(projectTrends, eq(projectTrends.projectId, projects.id))
    .innerJoin(repos, eq(projects.repoId, repos.id))
    .where(where)
    .groupBy(tags.id)
    .orderBy(desc(count(projectsToTags.projectId)))
    .limit(limit);
}
