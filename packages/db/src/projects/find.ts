import { and, eq, ilike, inArray, or, sql } from "drizzle-orm";

import type { PROJECT_STATUSES } from "../constants";
import type { DB } from "../index";
import * as schema from "../schema";
import type { ProjectsSortableColumnName } from "../shared-schemas";
import { getSortQuery, getTotalNumberOfProjects } from "../utils/queries-utils";

const { projects, tags, packages, projectsToTags, repos } = schema;

export interface FindProjectsOptions {
  page?: number;
  limit?: number;
  owner?: string;
  name?: string;
  full_name?: string;
  sort?: { id: ProjectsSortableColumnName; desc: boolean }[];
  status?: string[];
  tagCodes?: string[];
}
interface Props extends FindProjectsOptions {
  db: DB;
}

export async function findProjects({
  db,
  limit = 100,
  page = 1,
  full_name,
  owner,
  name,
  sort = [{ id: "createdAt", desc: true }],
  status,
  tagCodes,
}: Props) {
  const orderBy = getSortQuery(projects, sort);
  const offset = (page - 1) * limit;
  const query = db
    .select({
      slug: projects.slug,
      name: projects.name,
      description: projects.description,
      createdAt: projects.createdAt,
      stars: repos.stars,
      lastCommit: repos.last_commit,
      commitCount: repos.commit_count,
      repo: {
        name: repos.name,
        full_name: sql<string>`${repos.owner} || '/' || ${repos.name}`,
        owner_id: repos.owner_id,
        archived: repos.archived,
      },
      logo: projects.logo,
      tags: sql<
        string[]
      >`COALESCE(json_agg(distinct ${tags.code}) FILTER (WHERE ${tags.code} IS NOT NULL), '[]')`, // avoid [null], return empty arrays instead
      comments: projects.comments,
      packages: sql<string[]>`json_agg(distinct ${packages.name})`,
      status: projects.status,
    })
    .from(projects)
    .leftJoin(projectsToTags, eq(projectsToTags.projectId, projects.id))
    .leftJoin(repos, eq(projects.repoId, repos.id))
    .leftJoin(tags, eq(projectsToTags.tagId, tags.id))
    .leftJoin(schema.packages, eq(schema.packages.projectId, projects.id))
    .orderBy(...orderBy)
    .offset(offset)
    .groupBy(() => [
      projects.comments,
      projects.createdAt,
      projects.slug,
      projects.name,
      projects.description,
      projects.logo,
      projects.createdAt,
      repos.archived,
      repos.name,
      repos.owner,
      repos.stars,
      repos.owner_id,
      repos.last_commit,
      repos.commit_count,
      projectsToTags.projectId,
      packages.projectId,
      projects.status,
    ]);

  if (limit) {
    query.limit(limit);
  }

  function getWhereClause() {
    return and(
      name ? getWhereClauseSearchByText(name) : undefined,
      tagCodes && tagCodes.length > 0
        ? getWhereClauseSearchByTag(db, tagCodes)
        : undefined,
      owner ? eq(repos.owner, owner) : undefined,
      full_name ? getWhereClauseSearchByFullName(full_name) : undefined,
      status && status.length > 0
        ? inArray(
            projects.status,
            status as (typeof PROJECT_STATUSES)[number][],
          )
        : undefined,
    );
  }

  const where = getWhereClause();
  if (where) {
    query.where(where);
  }

  const total = await getTotalNumberOfProjects(where);
  const foundProjects = await query;

  return { projects: foundProjects, total };
}

/** Select project IDs that have ALL the requested tags */
function getWhereClauseSearchByTag(db: DB, tagCodes: string[]) {
  return inArray(
    projects.id,
    db
      .select({ id: projectsToTags.projectId })
      .from(projectsToTags)
      .innerJoin(tags, eq(projectsToTags.tagId, tags.id))
      .where(inArray(tags.code, tagCodes))
      .groupBy(projectsToTags.projectId)
      .having(sql`count(distinct ${tags.code}) = ${tagCodes.length}`),
  );
}

function getWhereClauseSearchByText(text: string) {
  return or(
    ilike(projects.name, `%${text}%`),
    ilike(projects.description, `%${text}%`),
  );
}

function getWhereClauseSearchByFullName(full_name: string) {
  const [owner, name] = full_name.split("/");
  return and(eq(repos.owner, owner), eq(repos.name, name));
}
