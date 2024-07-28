import { cli, command } from "cleye";
import { TaskRunner } from "./task-runner";
import { helloProjectsTask, helloWorldTask } from "./tasks/hello-world.task";
import { updateGitHubDataTask } from "./tasks/update-github-data.task";
import { buildStaticApiTask } from "./tasks/build-static-api";

const flags = {
  concurrency: {
    type: Number,
    default: 1,
  },
  logLevel: {
    type: Number,
    description:
      "Log level: 0 => error, 1 => warn, 2 => log, 3 => info, 4 => debug...",
    default: 3,
  },
  limit: {
    type: Number,
    description: "Records to process",
    default: 0,
  },
  skip: {
    type: Number,
    description: "Records to skip (when paginating)",
    default: 0,
  },
  name: {
    type: String,
    description: "Full name of the GitHub repo to process",
  },
};

cli({
  name: "bestofjs-cli",
  commands: [
    command(
      {
        name: "hello-world",
        help: {
          description: "A simple hello world task",
        },
        flags,
      },
      (argv) => {
        const runner = new TaskRunner(argv.flags);
        runner.addTask(helloWorldTask);
        runner.run();
      }
    ),
    command(
      {
        name: helloProjectsTask.name,
        help: {
          description: "A simple hello world task",
        },
        flags,
      },
      (argv) => {
        const runner = new TaskRunner(argv.flags);
        runner.addTask(helloProjectsTask);
        runner.run();
      }
    ),
    command(
      {
        name: updateGitHubDataTask.name,
        flags,
        help: {
          description:
            "Update GitHub data for all repos and take a snapshot. To be run run every day",
        },
      },
      (argv) => {
        const runner = new TaskRunner(argv.flags);
        runner.addTask(updateGitHubDataTask);
        runner.run();
      }
    ),
    command(
      {
        name: buildStaticApiTask.name,
        flags,
        help: {
          description:
            "Build a static API from the database, to be used by the frontend app.",
        },
      },
      (argv) => {
        const runner = new TaskRunner(argv.flags);
        runner.addTask(buildStaticApiTask);
        runner.run();
      }
    ),
  ],
});
