/**
 * Manual integration tests (require GITHUB_ACCESS_TOKEN). Run:
 * `GITHUB_ACCESS_TOKEN=... bun test src/github/github-client.test.ts`
 */

import { createGitHubClient } from "./github-api-client";
import { describe, expect, test } from "bun:test";

if (process.env.GITHUB_ACCESS_TOKEN) {
  const client = createGitHubClient();

  describe("GitHub API client (integration)", () => {
    test("Moved repo", async () => {
      const repoInfo = await client.fetchRepoInfo("foreverjs/forever");
      expect(repoInfo.full_name).toBe("foreversd/forever");
    });

    test("Repo fallback", async () => {
      const repoInfo = await client.fetchRepoInfoFallback("foreverjs/forever");
      expect(repoInfo.full_name).toBe("foreversd/forever");
    });

    test("Repo info", async () => {
      const repoInfo = await client.fetchRepoInfo("expressjs/express");
      expect(repoInfo.full_name).toBe("expressjs/express");
      expect(repoInfo.topics).toEqual([
        "javascript",
        "nodejs",
        "express",
        "server",
      ]);
    });

    test("Repo description", async () => {
      const { description } = await client.fetchRepoInfo("nodejs/node");
      expect(description).toBe("Node.js JavaScript runtime");
    });

    test("Contributor count", async () => {
      const contributorCount =
        await client.fetchContributorCount("expressjs/express");
      expect(contributorCount).toBeGreaterThan(350);
    });

    test("Contributor count (bestofjs/bestofjs)", async () => {
      const contributorCount =
        await client.fetchContributorCount("bestofjs/bestofjs");
      expect(contributorCount).toBeGreaterThanOrEqual(25);
      expect(contributorCount).toBeLessThanOrEqual(50);
    });

    test("User info", async () => {
      const userInfo = await client.fetchUserInfo("sindresorhus");
      expect(userInfo.followers).toBeGreaterThan(30_000);
    });
  });
}
