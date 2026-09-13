import { invalidateWebAppCacheTags } from "@/shared/cache";
import { createTask } from "@/task-runner";

type BuildWebHook = {
  /** Names the deployment in the logs — a hook URL is a credential. */
  label: string;
  /** The flagship: a failure against it fails the task. */
  required: boolean;
  url: string;
};

/**
 * One Vercel deploy hook per web app deployment (see
 * `docs/features/noai-app.md`), one environment variable each.
 *
 * Deliberately *not* a comma-separated list, unlike the human-readable
 * `WEBAPP_URLS` next door: a deploy hook is an opaque token URL, so two of them
 * concatenated into one value cannot be told apart by eye. Pasting the same
 * hook twice, or the wrong project's, would fire successfully and leave a
 * deployment silently unbuilt. A variable per deployment makes the mistake
 * visible in the Vercel UI, and lets `noai` be optional (unset = not deployed)
 * and non-fatal, while main is neither.
 *
 * A third deployment would mean editing this list. That is fine: none is
 * planned, and this whole mechanism may be replaced by a warming pass once
 * bestofjs/bestofjs#503 removes the last build-time-baked data.
 */
function getBuildWebHooks(): BuildWebHook[] {
  const main = process.env.FRONTEND_BUILD_WEB_HOOK?.trim();
  const noai = process.env.FRONTEND_NOAI_BUILD_WEB_HOOK?.trim();

  return [
    ...(main ? [{ label: "main", required: true, url: main }] : []),
    ...(noai ? [{ label: "noai", required: false, url: noai }] : []),
  ];
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

    // Trigger the build webhook of every deployment. The invalidation above is
    // not a substitute, for two reasons:
    //
    // 1. `build-project-data.mjs` bakes `projects.json` into the bundle and the
    //    monthly-rankings lookup reads it from disk (`server/api-local-json`),
    //    where no tag reaches it — so those pages only change on a deploy.
    //    (The ⌘K palette is *not* in this category any more: it fetches the
    //    static API over HTTP under the `all-projects` tag. Once the rankings
    //    lookup moves to the DB — bestofjs/bestofjs#503 — nothing baked is left
    //    and this reason disappears.)
    // 2. Warming. `/api/revalidate` calls `revalidateTag(tag, { expire: 0 })`,
    //    which empties entries rather than marking them stale, and Next
    //    revalidates on request, not on the call. The build is what refills the
    //    prerendered set (home, the `/trends/*` windows, `/projects`, and the
    //    hot slugs from `generateStaticParams`); without it the first visitor
    //    after each daily run pays the full render. `{ expire: 0 }` is
    //    deliberate: "Trends today" serving yesterday's numbers until the
    //    visitor reloads is worse than a slow first hit.
    //
    // Reason 2 survives #503, which is why this stays after the baked JSON is
    // gone. Replacing it with a warming pass (GET those URLs on each
    // `WEBAPP_URLS` target, no credentials, no second Vercel build) is the open
    // alternative — to be evaluated once #503 lands, which is why the hook
    // plumbing is kept confined to this file.
    const sent = await triggerWebAppBuilds();

    return { data: null, meta: { sent } };

    async function triggerWebAppBuilds() {
      const webhooks = getBuildWebHooks();
      if (webhooks.length === 0)
        throw new Error(`No webhook URL specified (FRONTEND_BUILD_WEB_HOOK)`);

      const results = await Promise.allSettled(
        webhooks.map((webhook) => triggerOneWebAppBuild(webhook)),
      );
      const failed = webhooks.filter(
        (_, index) => results[index]?.status === "rejected",
      );

      // Main failing is the pre-existing failure mode and still throws: the
      // flagship not rebuilding means its rankings pages keep yesterday's baked
      // data. A secondary deployment failing costs that one site a slower first
      // visit — an error line, not a red daily pipeline.
      const failedRequired = failed.filter((webhook) => webhook.required);
      if (failedRequired.length > 0)
        throw new Error(
          `Unable to send the daily build webhook to: ${failedRequired
            .map((webhook) => webhook.label)
            .join(", ")}`,
        );

      if (failed.length > 0)
        logger.error(
          `Daily build webhook failed for: ${failed
            .map((webhook) => webhook.label)
            .join(", ")}`,
        );

      return webhooks.length - failed.length;
    }

    async function triggerOneWebAppBuild({ label, url }: BuildWebHook) {
      try {
        const result = await fetch(url).then((res) => res.json());
        logger.debug(result);
        // The label, never the URL: a deploy hook URL is a credential.
        logger.info(`Daily build webhook sent to the ${label} deployment!`);
      } catch (error) {
        const errorMessage = `Unable to send daily build webhook to the ${label} deployment: ${
          (error as Error).message
        }`;
        logger.error(errorMessage);
        throw new Error(errorMessage);
      }
    }
  },
});
