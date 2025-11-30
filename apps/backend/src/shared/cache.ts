/**
 * Shared utilities for managing Next.js web app cache
 */

import type { TaskRunnerContext } from "@/task-types";

/**
 * Invalidate web app cache by tag via the Next.js revalidation API
 */
export async function invalidateWebAppCacheByTag(
  tag: string,
  context: TaskRunnerContext,
) {
  const { logger, dryRun } = context;
  const webAppURL = process.env.WEBAPP_URL || "https://bestofjs.org";
  const revalidateURL = `${webAppURL}/api/revalidate?tag=${tag}`;

  logger.info(`Invalidating cache for tag: "${tag}"`);

  if (dryRun) {
    logger.info(`[DRY RUN] Would revalidate: ${revalidateURL}`);
    return { success: true, tag, dryRun: true };
  }

  try {
    const response = await fetch(revalidateURL);
    const result = await response.json();

    logger.debug(result);
    logger.info(`Cache invalidation request for "${tag}" tag sent!`);

    return { success: true, tag, result };
  } catch (error) {
    const errorMessage = `Unable to invalidate cache for "${tag}" tag: ${
      (error as Error).message
    }`;

    logger.error(errorMessage, error);
    throw new Error(errorMessage);
  }
}

/**
 * Invalidate multiple cache tags
 */
export async function invalidateWebAppCacheTags(
  tags: string[],
  context: TaskRunnerContext,
) {
  const { logger } = context;
  const results = await Promise.allSettled(
    tags.map((tag) => invalidateWebAppCacheByTag(tag, context)),
  );

  const successful = results.filter((r) => r.status === "fulfilled");
  const failed = results.filter((r) => r.status === "rejected");

  if (failed.length > 0) {
    logger.error(`${failed.length} cache invalidation(s) failed`);
  }

  return {
    total: tags.length,
    successful: successful.length,
    failed: failed.length,
    results,
  };
}
