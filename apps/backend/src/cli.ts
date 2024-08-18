import { cli, command } from "cleye";

import { Task, TaskRunner } from "./task-runner";
import {
  helloWorldProjectsTask,
  helloWorldReposTask,
} from "./tasks/hello-world.task";
import { updateGitHubDataTask } from "./tasks/update-github-data.task";
import { buildStaticApiTask } from "./tasks/build-static-api.task";
import { triggerBuildStaticApiTask } from "./tasks/trigger-build-static-api";
import { updatePackageDataTask } from "./tasks/update-package-data.task";

import { cliFlags as flags } from "./flags";
import { notifyDailyTask } from "./tasks/notify-daily.task";
import { triggerBuildWebappTask } from "./tasks/trigger-build-webapp.task";
import { updateBundleSizeTask } from "./tasks/update-bundle-size.task";

const commands = [
  notifyDailyTask,
  updateGitHubDataTask,
  triggerBuildStaticApiTask,
  triggerBuildWebappTask,
  buildStaticApiTask,
  helloWorldProjectsTask,
  helloWorldReposTask,
  updatePackageDataTask,
  updateBundleSizeTask,
].map(getCommand);

const staticApiDailyTask = command(
  {
    name: "static-api-daily",
    description:
      "Build command on Vercel: build static API, trigger Next.js rebuild and send notification",
    flags,
  },
  (argv) => {
    const runner = new TaskRunner(argv.flags);
    runner.addTask(buildStaticApiTask);
    runner.addTask(triggerBuildWebappTask);
    runner.addTask(notifyDailyTask);
    runner.run();
  }
);

cli({
  name: "bestofjs-cli",
  commands: [staticApiDailyTask, ...commands],
});

function getCommand(task: Task) {
  return command(
    {
      name: task.name,
      flags,
      help: {
        description: task.description,
      },
    },
    (argv) => {
      const runner = new TaskRunner(argv.flags);
      runner.addTask(task);
      runner.run();
    }
  );
}
