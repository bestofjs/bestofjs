import {
  and,
  countDistinct,
  desc,
  eq,
  gte,
  inArray,
  notInArray,
} from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import type { DB } from "../../index";
import * as schema from "../../schema";
import {
  getWhereClauseExcludeTags,
  getWhereClauseSearchByTag,
  getWhereClauseSearchByText,
} from "../projects/find";
import {
  getWhereClauseActiveScope,
  type ProjectScope,
  resolveScope,
} from "../projects/find-with-trends";

const {
  projects,
  projectTrends,
  projectsToTags,
  repoTrends,
  repos,
  tagClosure,
  tags,
} = schema;

export interface FindRelevantTagsOptions {
  db: DB;
  /**
   * Hide these tags, and every project carrying them, from the suggestions.
   * Must match what the listing excludes — a suggestion the listing filters out
   * is the same dead end the `scope` note below describes.
   */
  excludedTagCodes?: string[];
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
  excludedTagCodes,
  tagCodes,
  query,
  relevanceFloor = false,
  scope = "active",
  limit = 20,
}: FindRelevantTagsOptions): Promise<RelevantTag[]> {
  const hasExcludedTags = excludedTagCodes && excludedTagCodes.length > 0;
  const selectedAncestors = alias(tags, "selected_ancestors");
  const selectedDescendants = alias(tags, "selected_descendants");
  const relatedToSelection =
    tagCodes && tagCodes.length > 0
      ? and(
          notInArray(
            tags.id,
            db
              .select({ id: tagClosure.descendantId })
              .from(tagClosure)
              .innerJoin(
                selectedAncestors,
                eq(selectedAncestors.id, tagClosure.ancestorId),
              )
              .where(inArray(selectedAncestors.code, tagCodes)),
          ),
          notInArray(
            tags.id,
            db
              .select({ id: tagClosure.ancestorId })
              .from(tagClosure)
              .innerJoin(
                selectedDescendants,
                eq(selectedDescendants.id, tagClosure.descendantId),
              )
              .where(inArray(selectedDescendants.code, tagCodes)),
          ),
        )
      : undefined;
  const where = and(
    relevanceFloor ? gte(projectTrends.relevanceScore, 0) : undefined,
    hasExcludedTags ? notInArray(tags.code, excludedTagCodes) : undefined,
    hasExcludedTags
      ? getWhereClauseExcludeTags(db, excludedTagCodes)
      : undefined,
    // Same predicate and the same query-wins rule as the listing, imported
    // rather than restated so the two cannot drift.
    resolveScope(scope, query) === "active"
      ? getWhereClauseActiveScope()
      : undefined,
    query ? getWhereClauseSearchByText(query) : undefined,
    tagCodes && tagCodes.length > 0
      ? getWhereClauseSearchByTag(db, tagCodes)
      : undefined,
    tagCodes && tagCodes.length > 0 ? relatedToSelection : undefined,
  );

  return (
    db
      .select({
        code: tags.code,
        name: tags.name,
        description: tags.description,
        count: countDistinct(projectsToTags.projectId),
      })
      .from(tags)
      .innerJoin(tagClosure, eq(tagClosure.ancestorId, tags.id))
      .innerJoin(
        projectsToTags,
        eq(projectsToTags.tagId, tagClosure.descendantId),
      )
      .innerJoin(projects, eq(projects.id, projectsToTags.projectId))
      .leftJoin(projectTrends, eq(projectTrends.projectId, projects.id))
      .innerJoin(repos, eq(projects.repoId, repos.id))
      // LEFT, like the listing: deprecated repos have no row, and neither do
      // projects added since the last daily run.
      .leftJoin(repoTrends, eq(repoTrends.repoId, repos.id))
      .where(where)
      .groupBy(tags.id)
      .orderBy(desc(countDistinct(projectsToTags.projectId)))
      .limit(limit)
  );
}
