import path from "path";
import { Command } from "cleye";
import { createConsola } from "consola";
import fs from "fs-extra";
import prettyBytes from "pretty-bytes";
import { z } from "zod";

import { DB, runQuery } from "@repo/db";
import { ParsedFlags, sharedFlagsSchema } from "./flags";
import { ProjectProcessor, RepoProcessor } from "./iteration-helpers";
import { MetaResult } from "./iteration-helpers/utils";
import { TaskContext } from "./task-types";

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

type RawFlags = { [key: string]: unknown };

export function createTaskRunner(tasks: Task<any>[]) {
  return {
    run(rawFlags: RawFlags) {
      const flags = sharedFlagsSchema.parse(rawFlags);
      const logger = createConsola({ level: flags.logLevel });
      const dryRun = flags.dryRun;
      const options = {
        limit: flags.limit,
        skip: flags.skip,
        concurrency: flags.concurrency,
        name: flags.name,
        throttleInterval: flags.throttleInterval,
      };

      return new Promise((resolve) => {
        runQuery(async (db) => {
          let i = 0;
          for (const task of tasks) {
            i++;
            logger.box(
              `Running task ${i}/${tasks.length} "${task.name} ${stringifyFlags(flags)}`
            );
            const context = createTaskContext(db);
            const taskFlags = task.schema?.parse(rawFlags) || {};

            const result = await task.run(context, taskFlags);
            logger.success("Task", task.name, "completed", result.meta);
          }
          resolve(true);
        });
      });

      function createTaskContext(db: DB): TaskContext {
        const context = { db, logger, dryRun };
        const projectProcessor = new ProjectProcessor(context, options);
        const repoProcessor = new RepoProcessor(context, options);

        return {
          db,
          logger,
          dryRun,

          // Database helpers
          processProjects: projectProcessor.processItems.bind(projectProcessor),
          processRepos: repoProcessor.processItems.bind(repoProcessor),

          // Filesystem helpers
          async saveJSON(json: unknown, fileName: string) {
            logger.info(`Saving ${fileName}`, {
              size: prettyBytes(JSON.stringify(json).length),
            });
            const filePath = path.join(process.cwd(), "build", fileName); // to be run from app/backend because of monorepo setup on Vercel, not from the root!
            await fs.outputJson(filePath, json);
            logger.info("JSON file saved!", filePath);
          },
        };
      }
    },
  };
}

function stringifyFlags(flags: ParsedFlags) {
  const { dryRun, limit, logLevel, skip, concurrency, throttleInterval } =
    flags;
  return [
    `logLevel: ${logLevel}`,
    limit ? `limit: ${limit}` : "",
    skip ? `skip: ${skip}` : "",
    `concurrency: ${concurrency}`,
    throttleInterval ? `throttleInterval: ${throttleInterval}` : "",
    dryRun ? "DRY RUN" : "",
  ]
    .filter(Boolean)
    .join(", ");
}
