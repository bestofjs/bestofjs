import { Task } from "@/task-runner";

export const helloWorldReposTask: Task = {
  name: "hello-world-repos",
  description: "A simple `hello world` task to, looping through all repos",
  run: async ({ processRepos }) => {
    return await processRepos(async (repo) => {
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

export const helloWorldProjectsTask: Task = {
  name: "hello-world-projects",
  description: "A simple `hello world` task, looping through all projects",
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
