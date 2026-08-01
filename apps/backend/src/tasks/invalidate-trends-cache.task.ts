import { invalidateWebAppCacheTags } from "@/shared/cache";
import { createTask } from "@/task-runner";

/**
 * Last step of the `daily-update-trends` pipeline, refreshing the web app
 * surfaces that read the tables the two passes before it just wrote.
 *
 * The daily job is a strict chain — `update-github-data` → `update-trends` →
 * static API build → web app rebuild — so `trigger-build-webapp` at the end of
 * the Vercel build already invalidates `daily` after the trends passes have
 * finished. This task is not what makes the ordering correct; it makes the
 * refresh *prompt and independent*:
 *
 * - the home and `/trends` pages update as soon as their data lands, instead of
 *   waiting on a full static API build plus a Vercel deploy;
 * - they still update if that build fails, which would otherwise leave a stale
 *   ranking pinned for a full 24 hours by `cacheLife("daily")`.
 *
 * Cheap enough to be worth it: two HTTP GETs against `/api/revalidate`.
 */
export const invalidateTrendsCacheTask = createTask({
  name: "invalidate-trends-cache",
  description:
    "Invalidate the web app cache tags fed by the trends tables, after the daily trends passes have written them",

  run: async (context) => {
    const tags = ["daily", "home"];
    const { successful, failed } = await invalidateWebAppCacheTags(
      tags,
      context,
    );
    return { data: null, meta: { successful, failed } };
  },
});
