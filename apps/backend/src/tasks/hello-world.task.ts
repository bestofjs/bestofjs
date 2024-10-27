import { countBy } from "es-toolkit";

import { HallOfFameMember } from "@/iteration-helpers";
import { Task } from "@/task-runner";

export const helloWorldReposTask: Task = {
  name: "hello-world-repos",
  description: "A simple `hello world` task to, looping through all repos",
  run: async ({ processRepos, logger }) => {
    return await processRepos(async (repo) => {
      const isDeprecated = repo.projects.every(
        (project) => project.status === "deprecated"
      );

      logger.debug(repo);

      return {
        meta: { isDeprecated },
        data: { stars: repo.stars },
      };
    });
  },
};

export const helloWorldProjectsTask: Task = {
  name: "hello-world-projects",
  description: "A simple `hello world` task, looping through all projects",
  run: async ({ processProjects, logger }) => {
    return await processProjects(async (project) => {
      const isDeprecated = project.status === "deprecated";

      logger.debug(project);

      return {
        meta: { isDeprecated },
        data: { stars: project.name },
      };
    });
  },
};

export const helloWorldHallOfFameTask: Task = {
  name: "hello-hall-of-fame",
  description:
    "A simple `hello world` task, looping through all Hall of Fame members",
  run: async ({ processHallOfFameMembers, logger }) => {
    const result = await processHallOfFameMembers<{ status: string }>(
      async (member) => {
        const isActive = (
          project: HallOfFameMember["relatedProjects"][number]
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
      }
    );
    console.log(countBy(result.data, (item) => item?.status || ""));
    return result;
  },
};
