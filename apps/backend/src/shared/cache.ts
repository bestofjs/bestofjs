/**
 * Shared utilities for managing Next.js web app cache
 */

import type { TaskRunnerContext } from "@/task-types";

/**
 * The web app deployments to refresh. Several because the same code runs as
 * more than one deployment (see `docs/features/noai-app.md`): each one has its
 * own cache, so each one has to be told.
 *
 * `WEBAPP_URLS` is a comma-separated list; unset, it falls back to the single
 * `WEBAPP_URL` this used to read, so an environment that knows nothing about
 * the second deployment behaves exactly as before.
 */
export function getWebAppURLs() {
  const urls = (
    process.env.WEBAPP_URLS ||
    process.env.WEBAPP_URL ||
    "https://bestofjs.org"
  )
    .split(",")
    .map((url) => url.trim().replace(/\/$/, ""))
    .filter(Boolean);

  return Array.from(new Set(urls));
}

/**
 * Invalidate web app cache by tag via the Next.js revalidation API, on every
 * deployment.
 *
 * The tag names are the same for all of them: `revalidateTag()` runs inside the
 * deployment that receives the request, so the per-deployment tag the web app
 * appends (`cacheTagForApp`) separates the cache *entries*, not these calls.
 */
export async function invalidateWebAppCacheByTag(
  tag: string,
  context: TaskRunnerContext,
) {
  const { logger, dryRun } = context;
  const webAppURLs = getWebAppURLs();

  const results = await Promise.allSettled(
    webAppURLs.map((webAppURL) =>
      invalidateOneWebAppCacheByTag(webAppURL, tag, context),
    ),
  );

  const failed = results.filter((result) => result.status === "rejected");

  if (failed.length === webAppURLs.length) {
    // Every target failed: the tag was not invalidated anywhere, which is the
    // pre-existing failure mode and must still throw.
    throw new Error(
      `Unable to invalidate cache for "${tag}" tag on any web app deployment`,
    );
  }

  if (failed.length > 0) {
    logger.error(
      `Cache invalidation for "${tag}" failed on ${failed.length}/${webAppURLs.length} deployment(s)`,
    );
  }

  return { success: true, tag, dryRun, results };
}

async function invalidateOneWebAppCacheByTag(
  webAppURL: string,
  tag: string,
  context: TaskRunnerContext,
) {
  const { logger, dryRun } = context;
  const revalidateURL = `${webAppURL}/api/revalidate?tag=${tag}`;

  // The target is logged with the tag: an invalidation sent to only one of the
  // deployments succeeds, and leaves the other serving stale pages for a full
  // `cacheLife("daily")` window with nothing in the logs to say so.
  logger.info(`Invalidating cache for tag: "${tag}" on ${webAppURL}`);

  if (dryRun) {
    logger.info(`[DRY RUN] Would revalidate: ${revalidateURL}`);
    return { success: true, tag, webAppURL, dryRun: true };
  }

  try {
    const response = await fetch(revalidateURL);

    // `fetch` only rejects on network failures, and `/api/revalidate` answers a
    // bad request with a JSON body and `status: 400` — so without this check the
    // response parses cleanly and a target that invalidated nothing is counted
    // as a success, hiding it from both the partial-failure warning and the
    // all-targets-failed throw.
    if (!response.ok)
      throw new Error(`${response.status} ${response.statusText}`);

    const result = await response.json();

    logger.debug(result);
    logger.info(`Cache invalidation request for "${tag}" tag sent!`);

    return { success: true, tag, webAppURL, result };
  } catch (error) {
    const errorMessage = `Unable to invalidate cache for "${tag}" tag on ${webAppURL}: ${
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
