import fs from "fs-extra";
import { createConsola } from "consola";
import prettyBytes from "pretty-bytes";
import path from "path";

import { DB, runQuery } from "@repo/db";
import { MetaResult } from "./iteration-helpers/utils";
import {
  TaskContext,
  TaskLoopOptions,
  TaskRunInputParams,
  TaskRunnerContext,
} from "./task-types";
import { ProjectProcessor, RepoProcessor } from "./iteration-helpers";

export type Task = {
  name: string;
  description?: string;
  run: (ctx: TaskContext) => Promise<{
    data: unknown;
    meta: MetaResult;
  }>;
};

export class TaskRunner {
  tasks: Task[];
  logger: TaskRunnerContext["logger"];
  dryRun: boolean;
  options: TaskLoopOptions;

  constructor(options: TaskRunInputParams = {}) {
    this.tasks = [];
    this.logger = createConsola({
      level: options.logLevel || 3,
    });
    this.dryRun = options.dryRun || false;
    this.options = {
      limit: options.limit || 0,
      skip: options.skip || 0,
      concurrency: options.concurrency || 1,
      name: options.name || "",
      throttleInterval: options.throttleInterval || 0,
    };
  }

  addTask(task: Task) {
    this.tasks.push(task);
  }

  async run() {
    return new Promise((resolve) => {
      runQuery(async (db) => {
        let i = 0;
        for (const task of this.tasks) {
          i++;
          this.logger.box(
            `Running task ${i}/${this.tasks.length} "${
              task.name
            }" ${stringifyOptions(this)}`
          );
          const context = this.createTaskContext(db);
          const result = await task.run(context);
          this.logger.success("Task", task.name, "completed", result.meta);
        }
        resolve(true);
      });
    });
  }

  createTaskContext(db: DB): TaskContext {
    const context = { db, logger: this.logger, dryRun: this.dryRun };
    const projectProcessor = new ProjectProcessor(context, this.options);
    const repoProcessor = new RepoProcessor(context, this.options);

    return {
      db,
      logger: this.logger,
      dryRun: this.dryRun,
      processProjects: projectProcessor.processItems.bind(projectProcessor),
      processRepos: repoProcessor.processItems.bind(repoProcessor),
      saveJSON: this.saveJSON.bind(this),
    };
  }

  async saveJSON(json: unknown, fileName: string) {
    this.logger.info(`Saving ${fileName}`, {
      size: prettyBytes(JSON.stringify(json).length),
    });
    const filePath = path.join(process.cwd(), "build", fileName); // to be run from app/backend because of monorepo setup on Vercel, not from the root!
    await fs.outputJson(filePath, json);
    this.logger.info("JSON file saved!", filePath);
  }
}

function stringifyOptions(runner: TaskRunner) {
  const { limit, skip, concurrency, throttleInterval } = runner.options;
  return [
    `logLevel: ${runner.logger.level}`,
    limit ? `limit: ${limit}` : "",
    skip ? `skip: ${skip}` : "",
    `concurrency: ${concurrency}`,
    throttleInterval ? `throttleInterval: ${throttleInterval}` : "",
    runner.dryRun ? "DRY RUN" : "",
  ]
    .filter(Boolean)
    .join(", ");
}
