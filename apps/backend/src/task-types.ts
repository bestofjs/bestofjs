import { ConsolaInstance } from "consola";

import { DB } from "@repo/db";
import { ParsedFlags } from "./flags";
import { ProjectProcessor, RepoProcessor } from "./iteration-helpers";

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
  ParsedFlags,
  "concurrency" | "limit" | "skip" | "name" | "throttleInterval"
>;
