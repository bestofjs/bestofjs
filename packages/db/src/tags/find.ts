import { asc, count, eq, sql } from "drizzle-orm";

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
 * Fetch all tags with counts and their top 5 most-starred projects.
 * Uses two queries:
 * 1. `findTags()` for tag metadata + project counts
 * 2. A window-function query to get the top 5 projects per tag in one round-trip
 */
export async function findTagsWithProjects(): Promise<TagWithProjectsItem[]> {
  const tags = await findTags();

  // Get top 5 projects per tag using ROW_NUMBER() window function
  const topProjects = await db.execute<{
    tag_code: string;
    slug: string;
    name: string;
    logo: string | null;
    owner_id: number;
  }>(sql`
    SELECT tag_code, slug, name, logo, owner_id
    FROM (
      SELECT
        t.code AS tag_code,
        p.slug,
        p.name,
        p.logo,
        r.owner_id,
        ROW_NUMBER() OVER (PARTITION BY t.id ORDER BY r.stargazers_count DESC NULLS LAST) AS rn
      FROM tags t
      INNER JOIN projects_to_tags pt ON pt.tag_id = t.id
      INNER JOIN projects p ON p.id = pt.project_id
      INNER JOIN repos r ON r.id = p."repoId"
      WHERE p.status NOT IN ('deprecated', 'hidden')
    ) ranked
    WHERE rn <= 5
    ORDER BY tag_code, rn
  `);

  // Build a map from tag code to projects array
  const projectsByTag = new Map<string, TagProject[]>();
  for (const row of topProjects.rows) {
    const tagCode = row.tag_code;
    if (!projectsByTag.has(tagCode)) {
      projectsByTag.set(tagCode, []);
    }
    projectsByTag.get(tagCode)!.push({
      slug: row.slug,
      name: row.name,
      logo: row.logo,
      owner_id: row.owner_id,
    });
  }

  // Merge projects into tags
  return tags.map((tag) => ({
    ...tag,
    projects: projectsByTag.get(tag.code) ?? [],
  }));
}
