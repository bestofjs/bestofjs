import { asc, count, eq, lte, notInArray, sql } from "drizzle-orm";

import { db } from "../index";
import * as schema from "../schema";

export async function findTags() {
  const tags = await db
    .select({
      name: schema.tags.name,
      code: schema.tags.code,
      createdAt: schema.tags.createdAt,
      description: schema.tags.description,
      count: count(schema.projectsToTags.projectId),
    })
    .from(schema.tags)
    .leftJoin(
      schema.projectsToTags,
      eq(schema.projectsToTags.tagId, schema.tags.id),
    )
    .groupBy(() => [
      schema.tags.name,
      schema.tags.code,
      schema.tags.createdAt,
      schema.tags.description,
    ])
    .orderBy(asc(schema.tags.name));
  return tags;
}

export type TagWithProjectsItem = Awaited<
  ReturnType<typeof findTags>
>[number] & {
  projects: TagProject[];
};

export type TagProject = {
  slug: string;
  name: string;
  logo: string | null;
  owner_id: number;
};

/**
 * Fetch all tags with counts and their top projects per tag (by stars). N is configurable via options (default 5).
 * Single query using subqueries: tags with count, ranked projects (ROW_NUMBER), top N per tag, then group in JS.
 */
export async function findTagsWithProjects(options?: {
  /** Max number of top (by stars) projects to return per tag. Default 5. */
  topProjectsPerTag?: number;
}): Promise<TagWithProjectsItem[]> {
  const { topProjectsPerTag = 5 } = options ?? {};

  // Sub-query 1: Tags with project count (same logic as findTags()). Used in main query FROM.
  const tagsWithCount = db
    .select({
      name: schema.tags.name,
      code: schema.tags.code,
      createdAt: schema.tags.createdAt,
      description: schema.tags.description,
      count: count(schema.projectsToTags.projectId).as("count"),
    })
    .from(schema.tags)
    .leftJoin(
      schema.projectsToTags,
      eq(schema.projectsToTags.tagId, schema.tags.id),
    )
    .groupBy(() => [
      schema.tags.name,
      schema.tags.code,
      schema.tags.createdAt,
      schema.tags.description,
    ])
    .as("tags_with_count");

  // Sub-query 2: All tag–project rows with ROW_NUMBER() per tag by stars; excludes deprecated/hidden. Used only inside sub-query 3.
  const ranked = db
    .select({
      tagCode: schema.tags.code,
      slug: schema.projects.slug,
      name: schema.projects.name,
      logo: schema.projects.logo,
      owner_id: schema.repos.owner_id,
      // assigns a per-tag rank so you can keep the top N (here 5) per tag.
      rn: sql<number>`ROW_NUMBER() OVER (PARTITION BY ${schema.tags.id} ORDER BY ${schema.repos.stars} DESC NULLS LAST)`.as(
        "rn",
      ),
    })
    .from(schema.tags)
    .innerJoin(
      schema.projectsToTags,
      eq(schema.projectsToTags.tagId, schema.tags.id),
    )
    .innerJoin(
      schema.projects,
      eq(schema.projects.id, schema.projectsToTags.projectId),
    )
    .innerJoin(schema.repos, eq(schema.repos.id, schema.projects.repoId))
    .where(notInArray(schema.projects.status, ["deprecated", "hidden"]))
    .as("ranked");

  // Sub-query 3: From sub-query 2, keep only rows with rn <= topProjectsPerTag (top N projects per tag). Used in main query LEFT JOIN.
  const topProjects = db
    .select({
      tagCode: ranked.tagCode,
      slug: ranked.slug,
      name: ranked.name,
      logo: ranked.logo,
      owner_id: ranked.owner_id,
      rn: ranked.rn,
    })
    .from(ranked)
    .where(lte(ranked.rn, topProjectsPerTag))
    .as("top_projects");

  // Main query (single round-trip): Select from sub-query 1 left-joined to sub-query 3; this is the only await, so one DB round-trip.
  const flatRows = await db
    .select({
      name: tagsWithCount.name,
      code: tagsWithCount.code,
      createdAt: tagsWithCount.createdAt,
      description: tagsWithCount.description,
      count: tagsWithCount.count,
      slug: topProjects.slug,
      projectName: topProjects.name,
      logo: topProjects.logo,
      owner_id: topProjects.owner_id,
      rn: topProjects.rn,
    })
    .from(tagsWithCount)
    .leftJoin(topProjects, eq(tagsWithCount.code, topProjects.tagCode))
    .orderBy(asc(tagsWithCount.name), asc(topProjects.rn));

  // Group flat rows by tag code into TagWithProjectsItem[]
  const byCode = Map.groupBy(flatRows, (row) => row.code);
  return Array.from(byCode.values(), (rows) => {
    const first = rows[0];
    const projects: TagProject[] = rows
      .filter(
        (
          row,
        ): row is typeof row & {
          slug: string;
          projectName: string;
          owner_id: number;
        } =>
          row.slug != null && row.projectName != null && row.owner_id != null,
      )
      .map((row) => ({
        slug: row.slug,
        name: row.projectName,
        logo: row.logo,
        owner_id: row.owner_id,
      }));
    return {
      name: first.name,
      code: first.code,
      createdAt: first.createdAt,
      description: first.description,
      count: first.count,
      projects,
    };
  });
}
