import { ConsolaInstance } from "consola";

import { DB } from "@repo/db";
import { ParsedFlags } from "./flags";
import {
  HallOfFameProcessor,
  ProjectProcessor,
  RepoProcessor,
} from "./iteration-helpers";

export interface TaskRunnerContext {
  logger: ConsolaInstance;
  db: DB;
  dryRun: boolean;
}

/** Context provided to each Task `run` handler function */
export interface TaskContext extends TaskRunnerContext {
  processProjects: ProjectProcessor["processItems"];
  processRepos: RepoProcessor["processItems"];
  processHallOfFameMembers: HallOfFameProcessor["processItems"];
  saveJSON: (json: unknown, fileName: string) => Promise<void>;
  readJSON: (fileName: string) => Promise<unknown>;
}

export type TaskLoopOptions = Pick<
  ParsedFlags,
  "concurrency" | "limit" | "skip" | "slug" | "fullName" | "throttleInterval"
>;
