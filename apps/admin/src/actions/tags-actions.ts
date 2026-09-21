"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

import {
  createTag as apiCreateTag,
  setTagFacet,
  setTagParent,
  TAG_FACETS,
  updateTagWithFacetById,
} from "@repo/core/services/tags";

const facetSchema = z.enum(TAG_FACETS).nullable();
const tagDataSchema = z.object({
  name: z.string().trim().min(1),
  code: z.string().trim().toLowerCase().min(1),
  description: z.string().nullable(),
  facet: facetSchema,
});

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown taxonomy error";
}

export async function createTag(tagName: string) {
  const createdTag = await apiCreateTag(tagName);

  revalidateTag("tags", { expire: 0 });
  revalidatePath(`/tags`);

  return createdTag;
}

export async function updateTagData(tagId: string, input: unknown) {
  try {
    const data = tagDataSchema.parse(input);
    await updateTagWithFacetById(tagId, {
      name: data.name,
      code: data.code,
      description: data.description,
      facet: data.facet,
    });
    revalidateTag("tags", { expire: 0 });
    revalidatePath("/tags");
    revalidatePath(`/tags/${data.code}`);
    return { error: null };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function updateTagFacet(tagId: string, input: unknown) {
  try {
    const facet = facetSchema.parse(input);
    await setTagFacet(tagId, facet);
    revalidateTag("tags", { expire: 0 });
    revalidatePath("/tags");
    return { error: null };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function updateTagParent(
  tagId: string,
  tagCode: string,
  input: unknown,
) {
  try {
    const parentTagId = z.string().nullable().parse(input);
    await setTagParent(tagId, parentTagId);
    revalidateTag("tags", { expire: 0 });
    revalidatePath("/tags");
    revalidatePath(`/tags/${tagCode}`);
    return { error: null };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}
