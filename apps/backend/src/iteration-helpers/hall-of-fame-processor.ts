import { omit } from "es-toolkit";

import { DB, schema } from "@repo/db";
import { desc, eq } from "@repo/db/drizzle";
import { TaskLoopOptions, TaskRunnerContext } from "@/task-types";
import { ItemProcessor } from "./abstract-item-processor";

export type HallOfFameMember = Awaited<
  ReturnType<typeof findHallOfFameMemberByUsername>
>;

export class HallOfFameProcessor extends ItemProcessor<HallOfFameMember> {
  type: "hall-of-fame";

  constructor(context: TaskRunnerContext, loopOptions: TaskLoopOptions) {
    super(context, loopOptions);
    this.type = "hall-of-fame";
  }

  toString(item: HallOfFameMember) {
    return item.username + " " + item.name;
  }

  async getAllItemsIds() {
    const { db, logger } = this.context;
    const { limit, skip, slug } = this.loopOptions;
    const { hallOfFame } = schema;

    const query = db
      .select({ username: hallOfFame.username })
      .from(hallOfFame)
      .orderBy(desc(hallOfFame.createdAt))
      .offset(skip);

    if (limit) {
      query.limit(limit);
    }

    if (slug) {
      query.where(eq(hallOfFame, slug));
    }

    const foundMembers = await query;
    if (!foundMembers.length) logger.error("No members found");

    const usernames = foundMembers.map((repo) => repo.username);
    return usernames;
  }

  async getItemById(id: string) {
    return await findHallOfFameMemberByUsername(this.context.db, id);
  }
}

async function findHallOfFameMemberByUsername(db: DB, username: string) {
  const member = await db.query.hallOfFame.findFirst({
    where: eq(schema.hallOfFame.username, username),
    with: {
      hallOfFameToProjects: {
        with: {
          project: true,
        },
      },
      repos: {
        with: {
          projects: true,
        },
      },
    },
  });

  if (!member) throw new Error(`Member not found by username: ${username}`);

  const relatedProjects = member.hallOfFameToProjects.map(
    (relation) => relation.project
  );
  const ownedProjects = member.repos.flatMap((repo) => repo.projects);

  return omit({ ...member, relatedProjects, ownedProjects }, [
    "hallOfFameToProjects",
    "repos",
  ]);
}
