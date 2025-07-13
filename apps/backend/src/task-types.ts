import type { Command } from "cleye";
import type { ConsolaInstance } from "consola";
import type { z } from "zod";

import type { DB } from "@repo/db";

import type { ParsedFlags } from "./flags";
import type {
  HallOfFameProcessor,
  ProjectProcessor,
  RepoProcessor,
} from "./iteration-helpers";
import type { MetaResult } from "./iteration-helpers/utils";

export type Task<FlagsType = undefined> = {
  name: string;
  description?: string;
  flags?: Command["options"]["flags"];
  schema?: z.ZodType<FlagsType>;
  run: (
    ctx: TaskContext,
    flags: FlagsType extends undefined ? undefined : FlagsType,
  ) => Promise<{
    data: unknown;
    meta: MetaResult;
  }>;
};

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
