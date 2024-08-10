import { createNpmClient } from "@/apis/npm-api-client";
import { Task } from "@/task-runner";
import { schema } from "@repo/db";
import { ProjectDetails } from "@repo/db/projects";
import { eq } from "drizzle-orm";

const npmClient = createNpmClient();

export const updatePackageDataTask: Task = {
  name: "update-package-data",
  description: "Update package data from NPM",
  run: async ({ db, logger, processProjects }) => {
    const results = await processProjects(async (project) => {
      let updatedCount = 0;

      for (const packageData of project.packages) {
        const updated = await processPackage(packageData);
        if (updated) updatedCount++;
      }

      return {
        data: null,
        meta: { processed: project.packages.length, updated: updatedCount },
      };
    });

    return results;

    async function processPackage(
      packageData: ProjectDetails["packages"][number]
    ) {
      const packageName = packageData.name;
      const previousVersion = packageData.version;
      const data = await npmClient.fetchPackageInfo(packageName);
      logger.trace(`Fetched package data for ${packageName}`, data);

      if (data.version === previousVersion) {
        logger.debug(`No new version for ${packageName}`);
        return false;
      }

      const monthlyDownloads = await npmClient.fetchMonthlyDownloadCount(
        packageName
      );

      const updatedData = {
        version: data.version,
        dependencies: formatDependencies(data.dependencies),
        deprecated: !!data.deprecated,
        monthlyDownloads,
        devDependencies: formatDependencies(data.devDependencies),
        updatedAt: new Date(),
      };

      await db
        .update(schema.packages)
        .set(updatedData)
        .where(eq(schema.packages.name, packageName));

      logger.debug("Repo record updated", updatedData);
      return true;
    }
  },
};

function formatDependencies(dependencies?: { [key: string]: string }) {
  return dependencies ? Object.keys(dependencies) : [];
}
