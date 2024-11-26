import { orderBy } from "es-toolkit";

import { TAGS_EXCLUDED_FROM_RANKINGS } from "@repo/db/constants";
import { notifyDiscordProjectList } from "@/shared/discord";
import { projectToSlackAttachment, sendMessageToSlack } from "@/shared/slack";
import { createTask } from "@/task-runner";
import { ProjectItem } from "./static-api-types";

const NUMBER_OF_PROJECTS = 5;

export const notifyDailyTask = createTask({
  name: "notify-daily",
  description:
    "Send notification on Slack and Discord after static API is built",

  run: async ({ dryRun, logger, readJSON }) => {
    const slackURL = process.env.SLACK_DAILY_WEBHOOK;
    if (!slackURL) throw new Error('No "SLACK_WEBHOOK" env. variable defined');
    const discordURL = process.env.DISCORD_DAILY_WEBHOOK;
    if (!discordURL)
      throw new Error('No "DISCORD_WEBHOOK" env. variable defined');

    const projects = await fetchHottestProjects();

    logger.debug("Send the daily notifications...");

    if (await notifySlack({ projects, url: slackURL, dryRun })) {
      logger.info("Notification sent to Slack");
    }

    const sent = await notifyDiscord({
      projects,
      webhookURL: discordURL,
      dryRun,
    });
    if (sent) logger.info("Notification sent to Discord");

    return { data: null, meta: { sent } };

    async function fetchProjectsFromJSON() {
      const data = await readJSON("projects.json");
      return (data as any).projects as ProjectItem[]; // TODO parse data with Zod
    }

    async function fetchHottestProjects() {
      const projects = await fetchProjectsFromJSON();

      const topProjects = orderBy(
        projects.filter(isIncludedInHotProjects),
        [(project) => project.trends?.daily || 0],
        ["desc"]
      );

      return topProjects.slice(0, NUMBER_OF_PROJECTS);
    }
  },
});

/**
 * Exclude from the rankings projects with specific tags
 * TODO: move this behavior to the `tag` record, adding an attribute `exclude_from_rankings`?
 **/
const isIncludedInHotProjects = (project: ProjectItem) => {
  const hasExcludedTag = TAGS_EXCLUDED_FROM_RANKINGS.some((tag) =>
    project.tags.includes(tag)
  );
  return !hasExcludedTag;
};

async function notifySlack({
  projects,
  url,
  dryRun,
}: {
  projects: ProjectItem[];
  url: string;
  dryRun: boolean;
}) {
  const text = `TOP ${NUMBER_OF_PROJECTS} Hottest Projects Today (${formatTodayDate()})`;

  const attachments = projects.map((project, i) => {
    const stars = project.trends.daily;
    const text = `Number ${i + 1} +${stars} stars since yesterday:`;
    return projectToSlackAttachment(project, text);
  });

  if (dryRun) {
    console.info("[DRY RUN] No message sent to Slack", { text, attachments }); //eslint-disable-line no-console
    return;
  }

  await sendMessageToSlack(text, { url, channel: "", attachments });
  return true;
}

async function notifyDiscord({
  projects,
  webhookURL,
  dryRun,
}: {
  projects: ProjectItem[];
  webhookURL: string;
  dryRun: boolean;
}) {
  return await notifyDiscordProjectList({
    text: `TOP ${NUMBER_OF_PROJECTS} Hottest Projects Today (${formatTodayDate()})`,
    projects,
    getProjectComment: (project, index) =>
      `+${project.trends.daily} stars since yesterday [number ${index + 1}]`,
    webhookURL,
    dryRun,
  });
}

/**
 * @returns format a date as "Tuesday, May 14"
 */
function formatTodayDate() {
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  return formatter.format(new Date());
}
