import { count, desc, ilike, or } from "drizzle-orm";

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
  const where =
    searchQuery &&
    or(
      ilike(schema.hallOfFame.name, `%${searchQuery}%`),
      ilike(schema.hallOfFame.username, `%${searchQuery}%`)
    );

  const offset = (page - 1) * limit;

  const totalResult = await db
    .select({ count: count() })
    .from(schema.hallOfFame)
    .where(where || undefined);
  const total = totalResult[0].count;

  const query = db.query.hallOfFame.findMany({
    with: {
      hallOfFameToProjects: {
        with: {
          project: true,
        },
      },
    },
    limit,
    offset,
    orderBy: desc(schema.hallOfFame.followers),
    ...(where && { where }),
  });

  const members = await query;
  const membersWithProjects = members.map((member) => {
    const projects = member.hallOfFameToProjects.map(
      (relation) => relation.project
    );
    return { ...member, projects };
  });
  return { members: membersWithProjects, total };
}

export type HallOfFameMember = Awaited<
  ReturnType<typeof findHallOfFameMembers>
>["members"][number];
