"use server";

import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { snapshotsService } from "@/db";
import { createClient } from "@repo/db/github";
import {
  ProjectData,
  addPackage,
  removePackage,
  saveTags,
  updateProjectById,
} from "@repo/db/projects";
import { EditableTagData, updateTagById } from "@repo/db/tags";
import invariant from "tiny-invariant";

import { Tag } from "@/components/ui/tags/tag-input";

type EditableProjectData = Omit<
  ProjectData,
  "repoId" | "id" | "createdAt" | "updatedAt"
>;

export async function updateProjectData(
  projectId: string,
  projectData: EditableProjectData
) {
  noStore();
  await updateProjectById(projectId, projectData);
  revalidatePath(`/projects/${projectData.slug}`);
}

export async function updateProjectTags(
  projectId: string,
  projectSlug: string,
  tags: Tag[]
) {
  await saveTags(projectId, tags);
  revalidatePath(`/projects/${projectSlug}`);
}

export async function updateTagData(tagId: string, tagData: EditableTagData) {
  await updateTagById(tagId, tagData);
  revalidatePath(`/tags/${tagData.code}`);
  revalidatePath(`/tags`);
}

export async function addPackageAction(
  projectId: string,
  projectSlug: string,
  packageName: string
) {
  await addPackage(projectId, packageName);
  revalidatePath(`/projects/${projectSlug}`);
}

export async function removePackageAction(
  projectId: string,
  projectSlug: string,
  packageName: string
) {
  await removePackage(projectId, packageName);
  revalidatePath(`/projects/${projectSlug}`);
}

export async function addSnapshotAction(
  projectSlug: string,
  repoId: string,
  repoFullName: string
) {
  const token = process.env.GITHUB_ACCESS_TOKEN;
  invariant(token, "The GITHUB_ACCESS_TOKEN is required!");
  const gitHubClient = createClient(token);
  const data = await gitHubClient.fetchRepoInfo(repoFullName);
  const stars = data.stargazers_count as number;

  // TODO add a real UI?
  console.log("Adding snapshot for", repoId, stars);

  snapshotsService.addSnapshot(repoId, stars);

  revalidatePath(`/projects/${projectSlug}`);
}
