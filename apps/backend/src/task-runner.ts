import fs from "fs-extra";
import { ConsolaInstance, createConsola } from "consola";
import prettyBytes from "pretty-bytes";
import path from "path";
import invariant from "tiny-invariant";

import { DB, runQuery } from "@repo/db";
import { processRepos, Repo } from "./iteration-helpers/process-repos";
import { Project, processProjects } from "./iteration-helpers/process-projects";
import { MetaResult } from "./iteration-helpers/utils";

export interface RunnerContext {
  db: DB;
  logger: ConsolaInstance;
}

export interface TaskContext extends RunnerContext {
  processRepos: ReturnType<typeof processRepos>;
  processProjects: ReturnType<typeof processProjects>;
  saveJSON: (json: unknown, fileName: string) => Promise<void>;
}

export type Task = {
  name: string;
  run: (ctx: TaskContext) => Promise<{
    data: unknown;
    meta: MetaResult;
  }>;
};

export type LoopOptions = {
  concurrency?: number;
  limit?: number;
  skip?: number;
  logLevel?: number;
  name?: string;
  throwOnError?: boolean;
};

export class TaskRunner {
  tasks: Task[];
  db?: DB;
  logger: ReturnType<typeof createConsola>;
  options: {
    concurrency: number;
    limit: number;
    skip: number;
    throwOnError?: boolean;
    // Optional query to filter items to process
    name?: string;
  };

  constructor(options: LoopOptions = {}) {
    this.tasks = [];
    this.logger = createConsola({
      level: options.logLevel || 3,
    });
    this.options = {
      limit: options.limit || 0,
      skip: options.skip || 0,
      concurrency: options.concurrency || 1,
      name: options.name,
      throwOnError: options.throwOnError,
    };
  }

  addTask(task: Task) {
    this.tasks.push(task);
  }

  async run() {
    return new Promise((resolve) => {
      runQuery(async (db) => {
        this.db = db;
        for (const task of this.tasks) {
          this.logger.box(
            `Running task "${task.name}" ${stringifyOptions(this)}`
          );
          const context = {
            db,
            logger: this.logger,
            processRepos: this.processRepos.bind(this),
            processProjects: this.processProjects.bind(this),
            saveJSON: this.saveJSON.bind(this),
          };
          const result = await task.run(context);
          this.logger.success("Task", task.name, "completed", result.meta);
        }
        resolve(true);
      });
    });
  }

  async processRepos<T>(
    callback: (
      repo: Repo,
      index: number
    ) => Promise<{ data: T; meta: MetaResult }>
  ) {
    invariant(this.db, "DB connection is required");
    const results = await processRepos({ db: this.db, logger: this.logger })(
      callback,
      this.options
    );
    return results;
  }

  async processProjects<T>(
    callback: (
      project: Project,
      index: number
    ) => Promise<{
      data: T;
      meta: MetaResult;
    }>
  ) {
    invariant(this.db, "DB connection is required");
    const results = await processProjects({
      db: this.db,
      logger: this.logger,
    })(callback, this.options);
    return results;
  }

  async saveJSON(json: unknown, fileName: string) {
    this.logger.info(`Saving ${fileName}`, {
      size: prettyBytes(JSON.stringify(json).length),
    });
    const filePath = path.join(process.cwd(), "build", fileName); // to be run from app/backend, not from the root!
    await fs.outputJson(filePath, json); // does not return anything
    this.logger.info("JSON file saved!", filePath);
  }
}
function stringifyOptions(runner: TaskRunner) {
  const { limit, skip, concurrency } = runner.options;
  return [
    `logLevel: ${runner.logger.level}`,
    limit ? `limit: ${limit}` : "",
    skip ? `skip: ${skip}` : "",
    `concurrency: ${concurrency}`,
  ]
    .filter(Boolean)
    .join(", ");
}
