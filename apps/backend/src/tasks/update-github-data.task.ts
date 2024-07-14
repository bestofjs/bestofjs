import { Task } from "@/task-runner";
import { createClient } from "@repo/db/github";
import { SnapshotsService } from "@repo/db/snapshots";

import { schema } from "@repo/db";
import { eq } from "drizzle-orm";

export const updateGitHubDataTask: Task = {
  name: "update-github-data",
  run: async ({ db, processRepos, logger }) => {
    const accessToken = process.env.GITHUB_ACCESS_TOKEN;
    if (!accessToken) throw new Error("GITHUB_ACCESS_TOKEN is required!");
    const client = createClient(accessToken);

    const snapshotsService = new SnapshotsService(db);

    return await processRepos(async (repo) => {
      logger.debug("STEP 1: get project data from GH API");

      const githubData = await client.fetchRepoInfo(repo.full_name);
      logger.debug(githubData);
      const { full_name, stargazers_count: stars } = githubData;

      logger.debug("STEP 2: Get contributor count by scrapping GH web page");
      const contributor_count = await client.fetchContributorCount(full_name);
      logger.debug("Data from scraping", { contributor_count });

      logger.debug("STEP 3: save a snapshot record for today, if needed.");
      const snapshotAdded = await snapshotsService.addSnapshot(repo.id, stars);
      logger.debug("Snapshot added?", snapshotAdded);

      const data = { ...githubData, contributor_count, updatedAt: new Date() };
      logger.debug("STEP 4: save the repo record", data);

      const result = await db
        .update(schema.repos)
        .set(data)
        .where(eq(schema.repos.id, repo.id));
      logger.debug("Repo record updated", result);

      // return {
      //   meta: { updated: true, snapshotAdded },
      //   data: { stars: repo.stars },
      // };
      return { meta: { success: true } };
    });
  },
};
