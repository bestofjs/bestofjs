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

export function createTaskRunner(tasks: Task<RawFlags | undefined>[]) {
  return {
    run(rawFlags: RawFlags) {
      const flags = sharedFlagsSchema.parse(rawFlags);
      const { logLevel, dryRun, ...options } = flags;
      const logger = createConsola({ level: logLevel });

      return new Promise((resolve) => {
        runQuery(async (db) => {
          let i = 0;
          for (const task of tasks) {
            i++;
            const taskFlags = task.schema?.parse(rawFlags);
            logger.box(
              `Running task ${i}/${tasks.length} "${task.name}" ${stringifyFlags(flags, taskFlags)}`
            );
            const context = createTaskContext(db);

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

          // File system helpers to access JSON files from the `build` folder
          // when running the script either from the monorepo root (local dev)
          // or from the `backend` app root (when running on Vercel)
          async saveJSON(json: unknown, fileName: string) {
            logger.info(`Saving ${fileName}`, {
              size: prettyBytes(JSON.stringify(json).length),
            });
            const appRoot = getAppRootPath();
            const filePath = path.join(appRoot, "build", fileName);
            await fs.outputJson(filePath, json);
            logger.info("JSON file saved!", filePath);
          },

          async readJSON(fileName: string) {
            const appRoot = getAppRootPath();
            const filePath = path.join(appRoot, "build", fileName);
            return fs.readJson(filePath);
          },
        };
      }
    },
  };
}

/**
 * @returns The path to the current app's root directory
 * Scripts can be run either:
 * - from the root of the monorepo (when working in local `bun run apps/backend/src/cli.ts ...`)
 * - or from the app's root when running on Vercel
 */
function getAppRootPath() {
  const appRoot = "apps/backend";
  const currentDir = process.cwd();
  if (currentDir.endsWith(appRoot)) {
    return currentDir;
  } else {
    return path.join(currentDir, appRoot);
  }
}

function stringifyFlags(flags: ParsedFlags, taskFlags?: RawFlags) {
  const { dryRun, limit, logLevel, skip, concurrency, throttleInterval } =
    flags;

  return [
    `logLevel: ${logLevel}`,
    limit ? `limit: ${limit}` : "",
    skip ? `skip: ${skip}` : "",
    concurrency > 1 ? `concurrency: ${concurrency}` : "",
    throttleInterval ? `throttleInterval: ${throttleInterval}` : "",
    dryRun ? "DRY RUN" : "",
  ]
    .concat(
      Object.entries(taskFlags || {}).map(([key, value]) => `${key}: ${value}`)
    )
    .filter(Boolean)
    .join(", ");
}
