import { count, asc, desc } from "drizzle-orm";

import * as schema from "@/database/schema";
import { DB } from "@/database/run-query";

export async function countProjects(db: DB) {
  const records = await db.select({ value: count() }).from(schema.projects);
  return records?.at(0)?.value || 0;
}

type Props = {
  db: DB;
  limit: number;
  offset: number;
  sort: OrderByKey;
};

export async function findProjects({ db, limit, offset, sort }: Props) {
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

export type ProjectListOrderByKey =
  | "createdAt"
  | "updatedAt"
  | "stars"
  | "-createdAt"
  | "-updatedAt"
  | "-stars";

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
