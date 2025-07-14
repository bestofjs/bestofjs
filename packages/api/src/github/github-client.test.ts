/**
 * Manual tests to be launched with `bun test`
 */

import { createGitHubClient } from "./github-api-client";
import { describe, expect, test } from "bun:test";

const client = createGitHubClient();

describe("GitHub API client", async () => {
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
    expect(contributorCount).toBeGreaterThan(300);
  });

  test("User info", async () => {
    const userInfo = await client.fetchUserInfo("sindresorhus");
    expect(userInfo.followers).toBeGreaterThan(30_000);
  });
});
