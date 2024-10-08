"use server";

import { nanoid } from "nanoid";
import slugify from "slugify";

import { getDatabase } from "..";
import * as schema from "../schema";

export async function createProject(gitHubURL: string) {
  const db = getDatabase();
  const fullName = gitHubURL.split("/").slice(-2).join("/");
  const data = await fetchGitHubRepoData(fullName);
  const repoId = nanoid();
  await db
    .insert(schema.repos)
    .values({ id: repoId, added_at: new Date(), ...data });

  const createdProjects = await db
    .insert(schema.projects)
    .values({
      id: nanoid(),
      createdAt: new Date(),
      repoId,
      name: data.name,
      slug: slugify(data.name),
      description: data.description,
      url: data.homepage,
      status: "active",
    })
    .returning();

  return createdProjects[0];
}

async function fetchGitHubRepoData(fullName: string) {
  const data = await fetch(`https://api.github.com/repos/${fullName}`).then(
    (res) => res.json()
  );
  return {
    owner_id: data.owner.id,
    name: data.name,
    full_name: data.full_name,
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
