import { eq } from "drizzle-orm";

import { schema } from "@repo/db";
import { ProjectDetails } from "@repo/db/projects";
import { createNpmClient } from "@/apis/npm-api-client";
import { Task } from "@/task-runner";

const npmClient = createNpmClient();

type Result = "updated" | "same-version" | "timeout" | "error" | "backend-only";

export const updateBundleSizeTask: Task = {
  name: "update-bundle-size",
  description: "Update bundle size data from bundlejs.com",
  run: async ({ db, logger, processProjects }) => {
    const results = await processProjects(async (project) => {
      if (!shouldProcessProject(project)) {
        logger.debug(`Skipping deprecated project ${project.repo.full_name}`);
        return { meta: { skipped: true }, data: null };
      }

      const resultCounts: Record<Result, number> = {
        "backend-only": 0,
        "same-version": 0,
        updated: 0,
        error: 0,
        timeout: 0,
      };

      for (const packageData of project.packages) {
        const result = await processPackage(project, packageData);
        resultCounts[result]++;
      }

      return {
        data: null,
        meta: resultCounts,
      };
    });

    return results;

    async function processPackage(
      project: ProjectDetails,
      packageData: ProjectDetails["packages"][number]
    ): Promise<Result> {
      const packageName = packageData.name;

      if (!canRunInBrowser(project)) {
        return "backend-only";
      }

      if (!needsUpdate(packageData)) {
        return "same-version";
      }

      const bundleData = await npmClient.fetchBundleData(packageName);
      const recordData = { ...bundleData, name: packageName };

      // update or create the record  if it does not exist
      // https://orm.drizzle.team/learn/guides/upsert
      const result = await db
        .insert(schema.bundles)
        .values(recordData)
        .onConflictDoUpdate({
          target: schema.bundles.name,
          set: { ...recordData, updatedAt: new Date() },
        })
        .returning();

      logger.debug("Bundle record updated", result[0]);
      if (bundleData.error) {
        return bundleData.error === "timeout" ? "timeout" : "error";
      }
      return "updated";
    }
  },
};

function needsUpdate(packageData: ProjectDetails["packages"][number]) {
  const bundle = packageData.bundles;
  if (!bundle) return true;
  const { errorMessage, version } = bundle;
  if (errorMessage) return true;
  const packageCurrentVersion = packageData.version;
  if (packageCurrentVersion === version) return false;
  return true;
}

function canRunInBrowser(project: ProjectDetails) {
  if (isBackendProject(project)) return false;
  return true;
}

function shouldProcessProject(project: ProjectDetails) {
  const isDeprecated = project.status === "deprecated";
  return !isDeprecated;
}

function isBackendProject(project: ProjectDetails) {
  const projectTags = project.tags.map((tag) => tag.code);
  return projectTags.some((tagName) => backendTags.includes(tagName));
}

const backendTags = [
  "archive",
  "astro",
  "auto",
  "boilerplate",
  "build",
  "bun",
  "cli",
  "cron",
  "css-tool",
  "deno",
  "dependency",
  "desktop",
  "ecommerce",
  "express",
  "fullstack",
  "iot",
  "lint",
  "meteor",
  "microservice",
  "middleware",
  "module",
  "mongodb",
  "monorepo",
  "nextjs",
  "nodejs-framework",
  "npm-scripts",
  "nvm",
  "orm",
  "package",
  "process",
  "queue",
  "runtime",
  "rust",
  "scaffolding",
  "scraping",
  "screenshot",
  "security",
  "serverless",
  "ssg",
  "test",
  "websocket",
];
