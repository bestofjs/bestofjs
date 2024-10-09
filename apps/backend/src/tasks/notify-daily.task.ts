import { TAGS_EXCLUDED_FROM_RANKINGS } from "@repo/db/constants";
import { projectToDiscordEmbed, sendMessageToDiscord } from "@/shared/discord";
import { projectToSlackAttachment, sendMessageToSlack } from "@/shared/slack";
import { Task } from "@/task-runner";
import { ProjectItem } from "./static-api-types";

export const notifyDailyTask: Task = {
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

    if (await notifyDiscord({ projects, url: discordURL, dryRun })) {
      logger.info("Notification sent to Discord");
    }
    return { data: null, meta: { sent: true } };

    async function fetchProjectsFromJSON() {
      const data = await readJSON("projects.json");
      return (data as any).projects as ProjectItem[]; // TODO parse data
    }

    async function fetchHottestProjects() {
      const projects = await fetchProjectsFromJSON();

      const score = (project: ProjectItem) => project.trends?.daily || 0;

      const topProjects = projects
        .filter(isIncludedInHotProjects)
        .sort((a, b) => (score(a) > score(b) ? -1 : 1))
        .slice(0, 5);
      return topProjects;
    }
  },
};

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
  const text = `TOP 5 Hottest Projects Today (${formatTodayDate()})`;

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
  url,
  dryRun,
}: {
  projects: ProjectItem[];
  url: string;
  dryRun: boolean;
}) {
  const text = `TOP 5 Hottest Projects Today (${formatTodayDate()})`;
  const colors = ["9c0042", "d63c4a", "f76d42", "ffae63", "ffe38c"]; // hex colors without the `#`

  const embeds = projects.map((project, index) => {
    const stars = project.trends.daily;
    const text = `+${stars} stars since yesterday [number ${index + 1}]`;
    const color = colors[index];
    return projectToDiscordEmbed(project, text, color);
  });

  if (dryRun) {
    console.info("[DRY RUN] No message sent to Discord", { text, embeds }); //eslint-disable-line no-console
    return;
  }

  await sendMessageToDiscord(text, { url, embeds });
  return true;
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
