import { countBy } from "es-toolkit";
import { z } from "zod";

import { schema } from "@repo/db";
import { PROJECT_STATUSES } from "@repo/db/constants";
import { and, eq, type SQL } from "@repo/db/drizzle";

import type { HallOfFameMember } from "@/iteration-helpers";
import { createTask } from "@/task-runner";

export const helloWorldReposTask = createTask({
  name: "hello-world-repos",
  description: "A simple `hello world` task to, looping through all repos",
  flags: {
    archived: { type: Boolean },
    status: { type: String },
  },
  schema: z.object({
    archived: z.boolean().optional(),
    status: z.enum(PROJECT_STATUSES).optional(),
  }),
  run: async (context, flags) => {
    const { processRepos, logger } = context;
    const where = [];

    if (flags.status) {
      where.push(eq(schema.projects.status, flags.status));
    }
    if (flags.archived) {
      where.push(eq(schema.repos.archived, flags.archived));
    }
    return await processRepos(
      async (repo) => {
        const isDeprecated = repo.projects.every(
          (project) => project.status === "deprecated",
        );

        logger.debug(repo.full_name);

        return {
          meta: { isDeprecated },
          data: { stars: repo.stars },
        };
      },
      { ...(where.length > 0 && { where: and(...where) }) },
    );
  },
});

export const helloWorldProjectsTask = createTask({
  name: "hello-world-projects",
  description: "A simple `hello world` task, looping through all projects",
  flags: {
    status: { type: String },
  },
  schema: z.object({
    status: z.enum(PROJECT_STATUSES).optional(),
  }),
  run: async (context, flags) => {
    const { processProjects, logger } = context;
    const where: SQL<unknown>[] = [];
    if (flags.status) {
      where.push(eq(schema.projects.status, flags.status));
    }
    return await processProjects(
      async (project) => {
        const isDeprecated = project.status === "deprecated";

        logger.debug(project);

        return {
          meta: { isDeprecated },
          data: { stars: project.name },
        };
      },
      { ...(where.length > 0 && { where: and(...where) }) },
    );
  },
});

export const helloWorldHallOfFameTask = createTask({
  name: "hello-hall-of-fame",
  description:
    "A simple `hello world` task, looping through all Hall of Fame members",
  run: async ({ processHallOfFameMembers, logger }) => {
    const result = await processHallOfFameMembers<{ status: string }>(
      async (member) => {
        const isActive = (
          project: HallOfFameMember["relatedProjects"][number],
        ) => project.status !== "deprecated";

        const getStatus = () => {
          const hasProjects = member.relatedProjects.length > 0;
          const hasOwnedProjects = member.relatedProjects.length > 0;
          const allProjects = [
            ...member.relatedProjects,
            ...member.ownedProjects,
          ];

          if (!member.bio && !hasOwnedProjects && !hasProjects) {
            logger.info("no projects:", member.username);
            return "no projects";
          }
          if (!member.bio && allProjects.filter(isActive).length === 0) {
            logger.info("no active projects:", member.username);
            return "inactive";
          }

          return "normal";
        };

        return {
          meta: { processed: true },
          data: { status: getStatus() },
        };
      },
    );
    console.log(countBy(result.data, (item) => item?.status || ""));
    return result;
  },
});
