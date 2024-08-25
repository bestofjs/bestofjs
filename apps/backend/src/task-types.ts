import { ConsolaInstance } from "consola";

import { DB } from "@repo/db";
import { ProjectProcessor, RepoProcessor } from "./iteration-helpers";

/** Options passed from the command line as flags */
export type TaskRunInputParams = {
  concurrency?: number;
  dryRun?: boolean;
  limit?: number;
  skip?: number;
  logLevel?: number;
  name?: string;
  throttleInterval?: number;
};

export type TaskRunParams = Required<TaskRunInputParams>;

export interface TaskRunnerContext {
  logger: ConsolaInstance;
  db: DB;
  dryRun: boolean;
}

/** Context provided to each Task `run` handler function */
export interface TaskContext extends TaskRunnerContext {
  processProjects: ProjectProcessor["processItems"];
  processRepos: RepoProcessor["processItems"];
  saveJSON: (json: unknown, fileName: string) => Promise<void>;
}

export type TaskLoopOptions = Pick<
  TaskRunParams,
  "concurrency" | "limit" | "skip" | "name" | "throttleInterval"
>;
