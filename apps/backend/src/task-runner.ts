import fs from "fs-extra";
import { ConsolaInstance, createConsola } from "consola";
import prettyBytes from "pretty-bytes";
import path from "path";

import { DB, runQuery } from "@repo/db";
import { processRepos, Repo } from "./iteration-helpers/process-repos";
import { Project, processProjects } from "./iteration-helpers/process-projects";

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
  run: (ctx: TaskContext) => void;
};

export type LoopOptions = {
  concurrency?: number;
  limit?: number;
  logLevel?: number;
  name?: string;
  throwOnError?: boolean;
};

export class TaskRunner {
  tasks: Task[];
  db?: DB;
  logger: ReturnType<typeof createConsola>;
  concurrency: number;
  limit: number;
  // Optional query to filter items to process
  name?: string;

  constructor(options: LoopOptions = {}) {
    this.tasks = [];
    this.logger = createConsola({
      level: options.logLevel || 3,
    });
    this.limit = options.limit || 0;
    this.concurrency = options.concurrency || 1;
    this.name = options.name;
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
            `Running task "${task.name}", logLevel: ${this.logger.level}${
              this.limit ? `, limit: ${this.limit}` : ""
            }, concurrency: ${this.concurrency}`
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
    ) => Promise<{ data: T; meta: { [key: string]: boolean | number } }>
  ) {
    const results = await processRepos<T>({ db: this.db, logger: this.logger })(
      callback,
      { limit: this.limit, name: this.name, concurrency: this.concurrency }
    );
    return results;
  }

  async processProjects<T>(
    callback: (
      project: Project,
      index: number
    ) => Promise<{ data: T; meta: { [key: string]: boolean | number } }>
  ) {
    const results = await processProjects<T>({
      db: this.db,
      logger: this.logger,
    })(callback, {
      limit: this.limit,
      name: this.name,
      concurrency: this.concurrency,
    });
    return results;
  }

  async saveJSON(json: unknown, fileName: string) {
    this.logger.info(`Saving ${fileName}`, {
      size: prettyBytes(JSON.stringify(json).length),
    });
    const filePath = path.join(
      process.cwd(),
      "apps/backend",
      "build",
      fileName
    );
    await fs.outputJson(filePath, json); // does not return anything
    this.logger.info("JSON file saved!", { fileName, filePath });
  }
}
