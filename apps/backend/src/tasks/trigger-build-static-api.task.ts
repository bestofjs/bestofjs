import { createTask } from "@/task-runner";

export const triggerBuildStaticApiTask = createTask({
  name: "trigger-build-static-api",
  description:
    "Trigger a build for the static API, sending a webhook to Vercel",
  run: async ({ logger }) => {
    const url = process.env.API_TRIGGER_BUILD_WEBHOOK_URL;
    if (!url) {
      throw new Error("API_TRIGGER_BUILD_WEBHOOK_URL is not set");
    }
    logger.log(`Triggering build for static API, sending webhook to Vercel...`);
    const result = await fetch(url, { method: "POST" }).then((res) =>
      res.json()
    );
    logger.log(`Build triggered!`, result);

    return { data: null, meta: { sent: true } };
  },
});
