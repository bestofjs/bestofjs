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

const commands = [
  updateGitHubDataTask,
  triggerBuildStaticApiTask,
  buildStaticApiTask,
  helloWorldProjectsTask,
  helloWorldReposTask,
  updatePackageDataTask,
].map(getCommand);

cli({
  name: "bestofjs-cli",
  commands,
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
