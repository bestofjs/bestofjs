import {
  asc,
  count,
  desc,
  eq,
  ilike,
  inArray,
  like,
  or,
  sql,
} from "drizzle-orm";

import { DB } from "../index";
import * as schema from "../schema";

const { projects, tags, packages, projectsToTags, repos } = schema;

export type ProjectListOrderByKey =
  | "createdAt"
  | "updatedAt"
  | "stars"
  | "-createdAt"
  | "-updatedAt"
  | "-stars";

type Props = {
  db: DB;
  limit: number;
  offset: number;
  owner?: string;
  full_name?: string;
  sort: ProjectListOrderByKey;
  tag?: string;
  text?: string;
};

export async function findProjects({
  db,
  limit,
  offset,
  full_name,
  owner,
  sort,
  tag,
  text,
}: Props) {
  const query = db
    .select({
      slug: projects.slug,
      name: projects.name,
      description: projects.description,
      createdAt: projects.createdAt,
      stars: repos.stars,
      repo: {
        full_name: repos.full_name,
        owner_id: repos.owner_id,
        archived: repos.archived,
      },
      logo: projects.logo,
      tags: sql<
        string[]
      >`COALESCE(json_agg(distinct ${tags.code}) FILTER (WHERE ${tags.code} IS NOT NULL), '[]')`, // avoid [null], return empty arrays instead
      comments: projects.comments,
      packages: sql<string[]>`json_agg(distinct ${packages.name})`,
    })
    .from(projects)
    .leftJoin(projectsToTags, eq(projectsToTags.projectId, projects.id))
    .leftJoin(repos, eq(projects.repoId, repos.id))
    .leftJoin(tags, eq(projectsToTags.tagId, tags.id))
    .leftJoin(schema.packages, eq(schema.packages.projectId, projects.id))
    .orderBy(getOrderBy(sort))
    .offset(offset)
    .limit(limit)
    .groupBy(() => [
      projects.comments,
      projects.createdAt,
      projects.slug,
      projects.name,
      projects.description,
      projects.logo,
      projects.createdAt,
      repos.archived,
      repos.stars,
      repos.full_name,
      repos.owner_id,
      projectsToTags.projectId,
      packages.projectId,
    ]);

  if (text) {
    query.where(getWhereClauseSearchByText(text));
  }
  if (tag) {
    query.where(getWhereClauseSearchByTag(db, tag));
  }
  if (owner) {
    query.where(like(repos.full_name, `${owner}/%`));
  }
  if (full_name) {
    query.where(like(repos.full_name, full_name));
  }

  // console.log(query.toSQL());

  const records = await query;
  return records;
}

function getWhereClauseSearchByTag(db: DB, tagCode: string) {
  return inArray(
    projects.id,
    db
      .select({ id: projectsToTags.projectId })
      .from(projectsToTags)
      .innerJoin(tags, eq(projectsToTags.tagId, tags.id))
      .where(eq(tags.code, tagCode))
      .leftJoin(repos, eq(projects.repoId, repos.id))
  );
}

function getWhereClauseSearchByText(text: string) {
  return or(
    ilike(projects.name, `%${text}%`),
    ilike(projects.description, `%${text}%`)
  );
}

export async function countProjects({
  db,
  tag,
  text,
}: Pick<Props, "db" | "tag" | "text">) {
  const query = db.select({ value: count() }).from(schema.projects);
  if (text) {
    query.where(getWhereClauseSearchByText(text));
  }
  if (tag) {
    query.where(getWhereClauseSearchByTag(db, tag));
  }

  const records = await query;
  return records?.at(0)?.value || 0;
}

export async function findProjects0({ db, limit, offset, sort }: Props) {
  const projects = await db.query.projects.findMany({
    orderBy: getOrderBy(sort), //TODO only work for `projects` columns
    limit,
    offset,
    with: {
      repo: {
        columns: {
          full_name: true,
          stars: true,
        },
      },
      projectsToTags: {
        with: {
          tag: {
            columns: {
              code: true,
              name: true,
            },
          },
        },
      },
    },
  });
  return projects;
}

function getOrderBy(orderByKey: ProjectListOrderByKey) {
  switch (orderByKey) {
    case "createdAt":
      return asc(schema.projects.createdAt);
    case "-createdAt":
      return desc(schema.projects.createdAt);
    case "updatedAt":
      return asc(schema.projects.updatedAt);
    case "-updatedAt":
      return desc(schema.projects.updatedAt);
    case "stars":
      return asc(schema.repos.stars);
    default:
      return desc(schema.repos.stars);
  }
}
