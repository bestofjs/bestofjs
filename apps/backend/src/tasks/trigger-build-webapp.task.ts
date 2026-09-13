import { invalidateWebAppCacheTags } from "@/shared/cache";
import { createTask } from "@/task-runner";

/**
 * One Vercel deploy hook per web app deployment (see
 * `docs/features/noai-app.md`). `FRONTEND_BUILD_WEB_HOOKS` is a comma-separated
 * list; unset, it falls back to the single `FRONTEND_BUILD_WEB_HOOK` this used
 * to read.
 */
function getBuildWebHooks() {
  const webhookURLs = (
    process.env.FRONTEND_BUILD_WEB_HOOKS ||
    process.env.FRONTEND_BUILD_WEB_HOOK ||
    ""
  )
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);

  return Array.from(new Set(webhookURLs));
}

export const triggerBuildWebappTask = createTask({
  name: "trigger-build-webapp",
  description: "Trigger the build of the Next.js app",

  run: async (context) => {
    const { logger } = context;

    // Invalidate multiple cache tags for daily updates
    const tags = [
      "daily",
      "all-projects",
      // DB-backed /projects page + /api/og/projects OG route (migrated off
      // the static-JSON "all-projects" tag in #424).
      "projects",
      "project-details",
      "package-downloads",
    ];
    await invalidateWebAppCacheTags(tags, context);

    // Trigger the build webhook of every deployment. A rebuild — not just the
    // cache invalidation above — is what refreshes the surfaces fed by the
    // static JSON: `build-project-data.mjs` bakes `projects.json` into the
    // bundle, so the search palette and the rankings lookup only change on a
    // deploy.
    const sent = await triggerWebAppBuilds();

    return { data: null, meta: { sent } };

    async function triggerWebAppBuilds() {
      const webhookURLs = getBuildWebHooks();
      if (webhookURLs.length === 0)
        throw new Error(
          `No webhook URL specified (FRONTEND_BUILD_WEB_HOOKS or FRONTEND_BUILD_WEB_HOOK)`,
        );

      const results = await Promise.allSettled(
        webhookURLs.map((webhookURL, index) =>
          triggerOneWebAppBuild(webhookURL, index),
        ),
      );
      const failed = results.filter((result) => result.status === "rejected");

      if (failed.length === webhookURLs.length)
        throw new Error(
          `Unable to send the daily build webhook to any deployment`,
        );

      if (failed.length > 0)
        logger.error(
          `Daily build webhook failed for ${failed.length}/${webhookURLs.length} deployment(s)`,
        );

      return webhookURLs.length - failed.length;
    }

    async function triggerOneWebAppBuild(webhookURL: string, index: number) {
      try {
        const result = await fetch(webhookURL).then((res) => res.json());
        logger.debug(result);
        // Indexed rather than named: a deploy hook URL is a credential, so it
        // must not reach the logs.
        logger.info(`Daily build webhook request #${index + 1} sent!`);
      } catch (error) {
        const errorMessage = `Unable to send daily build webhook #${index + 1}: ${
          (error as Error).message
        }`;
        logger.error(errorMessage);
        throw new Error(errorMessage);
      }
    }
  },
});
