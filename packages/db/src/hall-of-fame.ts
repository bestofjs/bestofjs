import { and, count, desc, eq, ilike, or, SQL } from "drizzle-orm";
import { orderBy, uniqBy } from "es-toolkit";

import { DB } from ".";
import * as schema from "./schema";

type Props = {
  db: DB;
  page: number;
  limit: number;
  searchQuery?: string;
};

export async function findHallOfFameMembers({
  db,
  page,
  limit,
  searchQuery,
}: Props) {
  const whereSearchQuery = searchQuery
    ? or(
        ilike(schema.hallOfFame.name, `%${searchQuery}%`),
        ilike(schema.hallOfFame.username, `%${searchQuery}%`)
      )
    : undefined;
  const where = and(eq(schema.hallOfFame.status, "active"), whereSearchQuery);

  const offset = (page - 1) * limit;

  const totalResult = await db
    .select({ count: count() })
    .from(schema.hallOfFame)
    .where(where);
  const total = totalResult[0].count;

  const query = fetchHallOfFameRecords(db, limit, offset, where);
  const members = await query;

  const membersWithProjects = members.map((member) => {
    const projects = getHallOfFameMemberProjects(member);
    return { ...member, projects };
  });
  return { members: membersWithProjects, total };
}

export type HallOfFameMember = Awaited<
  ReturnType<typeof findHallOfFameMembers>
>["members"][number];

function fetchHallOfFameRecords(
  db: DB,
  limit: number,
  offset: number,
  where?: SQL<unknown>
) {
  const projectColumns = {
    name: true,
    slug: true,
    logo: true,
    status: true,
  } as const;

  const query = db.query.hallOfFame.findMany({
    with: {
      hallOfFameToProjects: {
        with: {
          project: { columns: projectColumns },
        },
      },
      repos: {
        with: {
          projects: { columns: projectColumns },
        },
      },
    },
    limit,
    offset,
    orderBy: desc(schema.hallOfFame.followers),
    ...(where && { where }),
  });

  return query;
}

type RawMember = Awaited<ReturnType<typeof fetchHallOfFameRecords>>[number];

/**
 * Return all projects associated to a given Hall of Fame member:
 * - projects manually associated to the member through the `hallOfFameToProjects` relation
 * - repos whose owner is the member
 **/
export function getHallOfFameMemberProjects(member: RawMember) {
  const relatedProjects = member.hallOfFameToProjects.map(
    (relation) => relation.project
  );
  const ownedRepoProjects = member.repos.flatMap((repo) => repo.projects);

  const projects = orderBy(
    uniqBy(
      [...relatedProjects, ...ownedRepoProjects],
      (project) => project.slug
    ),
    [(project) => (project.status === "featured" ? 1 : 0)],
    ["desc"]
  );
  return projects;
}
