import { z } from "zod";

import { notifyDiscordProjectList } from "@/shared/discord";
import { createTask } from "@/task-runner";

import type { ProjectItem } from "./static-api-types";

interface Project extends ProjectItem {
  delta: number;
}

type RankingsData = {
  year: number;
  month: number;
  trending: Project[];
};

const NUMBER_OF_PROJECTS = 5;

export const notifyMonthlyTask = createTask({
  name: "notify-monthly",
  description:
    "Send notification on Discord after monthly rankings are published",

  flags: {
    year: { type: Number },
    month: { type: Number },
  },
  schema: z.object({ year: z.number(), month: z.number() }),

  run: async (context, flags) => {
    const { dryRun, logger } = context;
    const { year, month } = flags;
    const discordURL = process.env.DISCORD_MONTHLY_WEBHOOK;
    if (!discordURL)
      throw new Error('No "DISCORD_MONTHLY_WEBHOOK" env. variable!');

    const projects = await fetchMonthlyRankings(year, month);

    logger.info(
      "Sending the monthly notifications...",
      projects.map((project) => `${project.name}: +${project.delta}`),
    );

    const pageURL = `https://bestofjs.org/rankings/monthly/${year}/${month}`;
    const text = [
      `TOP ${NUMBER_OF_PROJECTS} Hottest Projects in ${formatMonth(year, month)}`,
      `[Full rankings on Best of JS](${pageURL})`,
    ].join("\n");

    const sent = await notifyDiscordProjectList({
      webhookURL: discordURL,
      text,
      projects,
      getProjectComment: (project, index) =>
        `+${project.delta} stars [number ${index + 1}]`,
      dryRun,
    });

    if (sent) logger.info("Notification sent to Discord");

    return { data: null, meta: { sent } };
  },
});

async function fetchMonthlyRankings(year: number, month: number) {
  const rootURL = process.env.RANKINGS_ROOT_URL;
  if (!rootURL) throw new Error('No "RANKINGS_ROOT_URL" env. variable!');
  const url = `${rootURL}/monthly/${formatDateForFilename(year, month)}`;
  const data = (await fetch(url).then((res) => res.json())) as RankingsData; // TODO parse data with Zod
  const { trending } = data;
  const projects = trending.slice(0, NUMBER_OF_PROJECTS);
  return projects;
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
