import { Command } from "cleye";
import { ConsolaInstance } from "consola";
import { z } from "zod";

import { DB } from "@repo/db";
import { ParsedFlags } from "./flags";
import {
  HallOfFameProcessor,
  ProjectProcessor,
  RepoProcessor,
} from "./iteration-helpers";
import { MetaResult } from "./iteration-helpers/utils";

export type Task<FlagsType = undefined> = {
  name: string;
  description?: string;
  flags?: Command["options"]["flags"];
  schema?: z.ZodType<FlagsType>;
  run: (
    ctx: TaskContext,
    flags: FlagsType extends undefined ? undefined : FlagsType
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
