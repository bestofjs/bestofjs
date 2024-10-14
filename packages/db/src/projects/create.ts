"use server";

import { nanoid } from "nanoid";
import slugify from "slugify";
import { z } from "zod";

import { getDatabase } from "..";
import * as schema from "../schema";

export async function createProject(gitHubURL: string) {
  const db = getDatabase();
  const fullName = gitHubURL.split("/").slice(-2).join("/");
  const repoData = await fetchGitHubRepoData(fullName);

  const repoId = nanoid();

  const createdProjects = await db.transaction(async (tx) => {
    await tx.insert(schema.repos).values({ id: repoId, ...repoData });

    return await tx
      .insert(schema.projects)
      .values({
        id: nanoid(),
        repoId,
        name: repoData.name,
        slug: slugify(repoData.name),
        description: repoData.description || "(No description)",
        url: repoData.homepage,
        status: "active",
      })
      .returning();
  });

  console.log("Project created", createdProjects);

  return createdProjects[0];
}

async function fetchGitHubRepoData(fullName: string) {
  const rawData = await fetch(`https://api.github.com/repos/${fullName}`).then(
    (res) => res.json()
  );
  const data = apiResponseSchema.parse(rawData);
  return {
    owner_id: data.owner.id,
    owner: data.owner.login,
    name: data.name,
    description: data.description,
    default_branch: data.default_branch,
    homepage: data.homepage,
    stars: data.stargazers_count,
    created_at: new Date(data.created_at),
    pushed_at: new Date(data.pushed_at),
    topics: data.topics,
  };
}

export async function addProjectToRepo({
  name,
  description,
  repoId,
}: {
  name: string;
  description: string;
  repoId: string;
}) {
  const db = getDatabase();
  const createdProjects = await db
    .insert(schema.projects)
    .values({
      id: nanoid(),
      createdAt: new Date(),
      repoId,
      name,
      description,
      slug: slugify(name).toLowerCase(),
      status: "active",
    })
    .returning();

  return createdProjects[0];
}

const apiResponseSchema = z.object({
  name: z.string(),
  owner: z.object({
    id: z.number(),
    login: z.string(),
  }),
  homepage: z.string().nullable(),
  default_branch: z.string().nullable(),
  description: z.string().nullable(),
  stargazers_count: z.number(),
  created_at: z.string(),
  pushed_at: z.string(),
  topics: z.array(z.string()),
});
