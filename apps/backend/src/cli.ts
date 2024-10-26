import { cli, command } from "cleye";

import { cliFlags as sharedFlags } from "./flags";
import { createTaskRunner, Task } from "./task-runner";
import { buildMonthlyRankingsTask } from "./tasks/build-monthly-rankings";
import { buildStaticApiTask } from "./tasks/build-static-api.task";
import {
  helloWorldHallOfFameTask,
  helloWorldProjectsTask,
  helloWorldReposTask,
} from "./tasks/hello-world.task";
import { notifyDailyTask } from "./tasks/notify-daily.task";
import { triggerBuildStaticApiTask } from "./tasks/trigger-build-static-api";
import { triggerBuildWebappTask } from "./tasks/trigger-build-webapp.task";
import { updateBundleSizeTask } from "./tasks/update-bundle-size.task";
import { updateGitHubDataTask } from "./tasks/update-github-data.task";
import { updateHallOfFameTask } from "./tasks/update-hall-of-fame";
import { updatePackageDataTask } from "./tasks/update-package-data.task";

const commands = [
  notifyDailyTask,
  updateGitHubDataTask,
  triggerBuildStaticApiTask,
  triggerBuildWebappTask,
  buildStaticApiTask,
  helloWorldProjectsTask,
  helloWorldReposTask,
  helloWorldHallOfFameTask,
  updatePackageDataTask,
  updateHallOfFameTask,
  updateBundleSizeTask,
  buildMonthlyRankingsTask,
].map(getCommand);

const staticApiDailyTask = command(
  {
    name: "static-api-daily",
    description:
      "Build command on Vercel: build static API, trigger Next.js rebuild and send notification",
    flags: sharedFlags,
  },
  (argv) => {
    const tasks: Task<any>[] = [
      buildStaticApiTask,
      triggerBuildWebappTask,
      notifyDailyTask,
    ];
    const runner = createTaskRunner(tasks);
    runner.run(argv.flags);
  }
);

cli({
  name: "bestofjs-cli",
  commands: [staticApiDailyTask, ...commands],
});

function getCommand(task: Task<any>) {
  return command(
    {
      name: task.name,
      flags: { ...sharedFlags, ...task.flags },
      help: {
        description: task.description,
      },
    },
    (argv) => {
      const runner = createTaskRunner([task]);
      runner.run(argv.flags);
    }
  );
}
