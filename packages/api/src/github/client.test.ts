// import "dotenv/config";

import assert from "assert";
import debugPackage from "debug";

import { createClient } from "./github-api-client";

const debug = debugPackage("github");

const accessToken = process.env.GITHUB_ACCESS_TOKEN;
if (!accessToken) throw new Error("The GITHUB_ACCESS_TOKEN is required!");
const client = createClient(accessToken);

const fullName = "expressjs/express";

async function main() {
  debug("Testing the GitHub API client");

  await testRepoInfo();

  await testRepoDescription();

  await testRepoInfoFallback();

  await testMovedRepo();

  await testContributorCount();

  await testUserInfo();
}

async function testMovedRepo() {
  const repoInfo = await client.fetchRepoInfo("foreverjs/forever");
  assert.equal(repoInfo.full_name, "foreversd/forever");
}

async function testRepoInfo() {
  const repoInfo = await client.fetchRepoInfo(fullName);
  debug(repoInfo);
  assert.ok(Array.isArray(repoInfo.topics));
}

async function testRepoInfoFallback() {
  const repoInfo = await client.fetchRepoInfoFallback("foreversd/forever");
  debug(repoInfo);
  assert.equal(repoInfo.full_name, "foreversd/forever");
}

async function testContributorCount() {
  const contributorCount = await client.fetchContributorCount(fullName);
  debug({ contributorCount });
  assert.ok(contributorCount > 200);
}

async function testUserInfo() {
  const userInfo = await client.fetchUserInfo("sindresorhus");
  debug(userInfo);
  assert.ok(userInfo.followers > 30000);
}

async function testRepoDescription() {
  const { description } = await client.fetchRepoInfo("nodejs/node");
  debug(description);
  assert.equal(description, "Node.js JavaScript runtime");
}

main();
