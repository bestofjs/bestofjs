import { invalidateWebAppCacheTags } from "@/shared/cache";
import { createTask } from "@/task-runner";

export const triggerBuildWebappTask = createTask({
  name: "trigger-build-webapp",
  description: "Trigger the build of the Next.js app",

  run: async (context) => {
    const { logger } = context;

    // Invalidate multiple cache tags for daily updates
    const tags = [
      "daily",
      "all-projects",
      "project-details",
      "package-downloads",
    ];
    await invalidateWebAppCacheTags(tags, context);

    // Trigger the build webhook
    await triggerWebAppBuild();

    return { data: null, meta: { sent: true } };

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
          `Unable to send daily build webhook ${(error as Error).message}`,
        );
      }
    }
  },
});
