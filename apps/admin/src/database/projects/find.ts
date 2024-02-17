import { asc, count, desc, eq, ilike, inArray, sql } from "drizzle-orm";

import { DB } from "@/database";
import * as schema from "@/database/schema";

const { projects, tags, projectsToTags, repos } = schema;

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
  sort: ProjectListOrderByKey;
  tag?: string;
  text?: string;
};

export async function findProjects({
  db,
  limit,
  offset,
  sort,
  tag,
  text,
}: Props) {
  const query = db
    .select({
      slug: projects.slug,
      name: projects.name,
      description: projects.description,
      stars: repos.stars,
      repo: {
        full_name: repos.full_name,
        owner_id: repos.owner_id,
      },
      // full_name: repos.full_name,
      // owner_id: repos.owner_id,
      logo: projects.logo,
      tags: sql<string[]>`json_agg(${tags.code})`,
      comments: projects.comments,
    })
    .from(projectsToTags)
    .leftJoin(projects, eq(projectsToTags.projectId, projects.id))
    .leftJoin(repos, eq(projects.repoId, repos.id))
    .leftJoin(tags, eq(projectsToTags.tagId, tags.id))
    .orderBy(getOrderBy(sort))
    .offset(offset)
    .limit(limit)
    .groupBy([
      projects.comments,
      projects.slug,
      projects.name,
      projects.description,
      projects.logo,
      projects.createdAt,
      repos.stars,
      repos.full_name,
      repos.owner_id,
    ]);

  if (text) {
    query.where(getWhereClauseSearchByText(text));
  }
  if (tag) {
    query.where(getWhereClauseSearchByTag(db, tag));
  }

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
  // does not work well as we don't get all the tags related to the found projects
  return sql`${
    projectsToTags.tagId
  } = (select id from tags where code = '${sql.raw(tagCode)}')`;
}

function getWhereClauseSearchByText(text: string) {
  return ilike(projects.description, `%${text}%`);
  // return sql`${projects.description} like '%${text}%'`;
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

function getOrderBy(orderByKey: OrderByKey) {
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
