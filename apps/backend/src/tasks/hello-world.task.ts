import { Task } from "@/task-runner";

export const helloWorldTask: Task = {
  name: "hello-world",
  run: async ({ processRepos }) => {
    return await processRepos(async (repo, i) => {
      const isDeprecated = repo.projects.every(
        (project) => project.status === "deprecated"
      );
      return {
        meta: { isDeprecated },
        data: { stars: repo.stars },
      };
    });
  },
};

export const helloProjectsTask: Task = {
  name: "hello-projects",
  run: async ({ processProjects }) => {
    return await processProjects(async (project) => {
      const isDeprecated = project.status === "deprecated";
      return {
        meta: { isDeprecated },
        data: { stars: project.name },
      };
    });
  },
};
