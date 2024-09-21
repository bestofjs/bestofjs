import { eq } from "drizzle-orm";

import { createGitHubClient } from "@repo/api/github";
import { schema } from "@repo/db";
import { SnapshotsService } from "@repo/db/snapshots";
import { Repo } from "@/iteration-helpers/repo-processor";
import { Task } from "@/task-runner";

export const updateGitHubDataTask: Task = {
  name: "update-github-data",
  description:
    "Update GitHub data for all repos and take a snapshot. To be run run every day",
  run: async ({ db, processRepos, logger }) => {
    const accessToken = process.env.GITHUB_ACCESS_TOKEN;
    if (!accessToken) throw new Error("GITHUB_ACCESS_TOKEN is required!");
    const client = createGitHubClient(accessToken);

    const snapshotsService = new SnapshotsService(db);

    return await processRepos(async (repo) => {
      if (!shouldProcessProject(repo)) {
        logger.debug("Skipping deprecated project", repo.full_name);
        return { meta: { skipped: true }, data: { stars: repo.stars } };
      }

      logger.debug("STEP 1: get project data from GH API");

      const githubData = await client.fetchRepoInfo(repo.full_name);
      logger.debug(githubData);
      if (githubData.archived)
        logger.warn(`Repo ${repo.full_name} is archived`);
      const { full_name, stargazers_count: stars } = githubData;

      logger.debug("STEP 2: Get contributor count by scrapping GH web page");
      const contributor_count = await client.fetchContributorCount(full_name);
      logger.debug("Data from scraping", { contributor_count });

      logger.debug("STEP 3: save a snapshot record for today, if needed.");
      const snapshotAdded = await snapshotsService.addSnapshot(repo.id, stars);
      logger.debug("Snapshot added?", snapshotAdded);

      const data = {
        ...githubData,
        stars,
        contributor_count,
        updatedAt: new Date(),
      };
      logger.debug("STEP 4: save the repo record", data);

      const result = await db
        .update(schema.repos)
        .set(data)
        .where(eq(schema.repos.id, repo.id));
      logger.debug("Repo record updated", result.rowCount);

      return {
        meta: { updated: true, snapshotAdded },
        data: { stars: repo.stars },
      };
    });
  },
};

function shouldProcessProject(repo: Repo) {
  const isDeprecated = repo.projects.every(
    (project) => project.status === "deprecated"
  );
  return !isDeprecated;
}
