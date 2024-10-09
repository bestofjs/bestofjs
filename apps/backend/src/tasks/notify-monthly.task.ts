import { z } from "zod";

import { projectToDiscordEmbed, sendMessageToDiscord } from "@/shared/discord";
import { Task } from "@/task-runner";
import { ProjectItem } from "./static-api-types";

interface Project extends ProjectItem {
  delta: number;
}

type RankingsData = {
  year: number;
  month: number;
  trending: Project[];
};

const NUMBER_OF_PROJECTS = 5;

const schema = z.object({ year: z.number(), month: z.number() });

export const notifyMonthlyTask: Task<z.infer<typeof schema>> = {
  name: "notify-monthly",
  description:
    "Send notification on Discord after monthly rankings are published",

  flags: {
    year: { type: Number },
    month: { type: Number },
  },
  schema,

  run: async (context, flags) => {
    const { dryRun, logger } = context;
    const { year, month } = flags;
    const discordURL = process.env.DISCORD_MONTHLY_WEBHOOK;
    if (!discordURL)
      throw new Error('No "DISCORD_MONTHLY_WEBHOOK" env. variable!');

    const projects = await fetchMonthlyRankings(year, month);

    logger.info(
      "Sending the daily notifications...",
      projects.map((project) => `${project.name}: +${project.delta}`)
    );

    if (
      await notifyDiscord({ year, month, projects, url: discordURL, dryRun })
    ) {
      logger.info("Notification sent to Discord");
    }
    return { data: null, meta: { sent: true } };
  },
};

async function fetchMonthlyRankings(year: number, month: number) {
  const rootURL = process.env.RANKINGS_ROOT_URL;
  if (!rootURL) throw new Error('No "RANKINGS_ROOT_URL" env. variable!');
  const url = `${rootURL}/monthly/${formatDateForFilename(year, month)}`;
  const data = (await fetch(url).then((res) => res.json())) as RankingsData;
  const { trending } = data;
  const projects = trending.slice(0, NUMBER_OF_PROJECTS);
  return projects;
}

async function notifyDiscord({
  projects,
  month,
  year,
  url,
  dryRun,
}: {
  month: number;
  year: number;
  projects: Project[];
  url: string;
  dryRun: boolean;
}) {
  const pageURL = `https://bestofjs.org/rankings/monthly/${year}/${month}`;
  const text = [
    `TOP ${NUMBER_OF_PROJECTS} Hottest Projects in ${formatMonth(year, month)}`,
    `[Full rankings on Best of JS](${pageURL})`,
  ].join("\n");
  const colors = ["ffe38c", "ffae63", "f76d42", "d63c4a", "9c0042"]; // hex colors without the `#`

  const embeds = projects.map((project, index) => {
    const starsAdded = project.delta;
    const text = `+${starsAdded} stars [number ${index + 1}]`;
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
 * @returns format a month as "2024/2024-10.json", to fetch data from the JSON API
 */
function formatDateForFilename(year: number, month: number) {
  return year + "/" + year + "-" + month.toString().padStart(2, "0") + ".json";
}

/**
 * @returns format a month as "October 2024"
 */
function formatMonth(year: number, month: number) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  });
  return formatter.format(new Date(year, month - 1));
}
