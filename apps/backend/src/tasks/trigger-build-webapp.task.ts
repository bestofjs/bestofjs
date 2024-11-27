import { createTask } from "@/task-runner";

export const triggerBuildWebappTask = createTask({
  name: "trigger-build-webapp",
  description: "Trigger the build of the Next.js app",

  run: async ({ logger }) => {
    await invalidateWebAppCacheByTag("all-projects");
    await invalidateWebAppCacheByTag("project-details");
    await invalidateWebAppCacheByTag("package-downloads");
    await triggerWebAppBuild();

    return { data: null, meta: { sent: true } };

    async function invalidateWebAppCacheByTag(tag: string) {
      const rootURL = "https://bestofjs.org"; // TODO: use env variable?
      const invalidateCacheURL = `${rootURL}/api/revalidate?tag=${tag}`;
      try {
        const result = await fetch(invalidateCacheURL).then((res) =>
          res.json()
        );
        logger.debug(result);
        logger.info(`Invalid cache request for "${tag}" tag sent!`);
      } catch (error) {
        throw new Error(
          `Unable to invalid the cache for "${tag}" tag ${
            (error as Error).message
          }`
        );
      }
    }

    async function triggerWebAppBuild() {
      const webhookURL = process.env.FRONTEND_BUILD_WEB_HOOK;
      if (!webhookURL)
        throw new Error(`No webhook URL specified (FRONTEND_BUILD_WEB_HOOK)`);
      try {
        const result = await fetch(webhookURL).then((res) => res.json());
        logger.debug(result);
        logger.info("Daily build webhook request sent!");
      } catch (error) {
        throw new Error(
          `Unable to send daily build webhook ${(error as Error).message}`
        );
      }
    }
  },
});
