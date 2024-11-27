import { schema } from "@repo/db";
import { eq, notInArray } from "@repo/db/drizzle";
import { ProjectDetails } from "@repo/db/projects";
import { createNpmClient } from "@/apis/npm-api-client";
import { createTask } from "@/task-runner";

const npmClient = createNpmClient();

export const updatePackageDataTask = createTask({
  name: "update-package-data",
  description: "Update package data from NPM",
  run: async ({ db, logger, processProjects }) => {
    const results = await processProjects(
      async (project) => {
        let updatedCount = 0;
        let deprecatedCount = 0;

        for (const packageData of project.packages) {
          const updatedData = await processPackage(packageData);
          if (updatedData) updatedCount++;
          if (updatedData?.deprecated) {
            logger.warn(`Deprecated package ${packageData.name}`);
            deprecatedCount++;
          }
        }

        return {
          data: null,
          meta: {
            processed: project.packages.length,
            updated: updatedCount,
            deprecated: deprecatedCount,
          },
        };
      },
      { where: notInArray(schema.projects.status, ["deprecated"]) }
    );

    return results;

    async function processPackage(
      packageData: ProjectDetails["packages"][number]
    ) {
      const packageName = packageData.name;
      const previousVersion = packageData.version;
      const data = await npmClient.fetchPackageInfo(packageName);
      logger.trace(`Fetched package data for ${packageName}`, data);

      if (data.version === previousVersion && !data.deprecated) {
        logger.debug(`No new version for ${packageName} (${previousVersion})`);
        return null;
      }

      const monthlyDownloads =
        await npmClient.fetchMonthlyDownloadCount(packageName);

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

      logger.debug("Package record updated", updatedData);
      return updatedData;
    }
  },
});

function formatDependencies(dependencies?: { [key: string]: string }) {
  return dependencies ? Object.keys(dependencies) : [];
}
