import debugPackage from "debug";

import { ProjectItem } from "@/tasks/static-api-types";

const debug = debugPackage("notify");

type Project = Pick<
  ProjectItem,
  "name" | "full_name" | "owner_id" | "description" | "url"
>;

export async function notifyDiscordProjectList<T extends Project>({
  text,
  projects,
  getProjectComment,
  webhookURL,
  dryRun,
}: {
  text: string;
  projects: T[];
  getProjectComment: (project: T, index: number) => string;
  webhookURL: string;
  dryRun: boolean;
}) {
  const colors = ["ffe38c", "ffae63", "f76d42", "d63c4a", "9c0042"]; // hex colors without the `#`

  const embeds = projects.map((project, index) => {
    const text = getProjectComment(project, index);
    const color = colors[index];
    return projectToDiscordEmbed(project, text, color);
  });

  if (dryRun) {
    console.info("[DRY RUN] No message sent to Discord", {
      webhookURL,
      text,
      embeds,
    }); //eslint-disable-line no-console
    return false;
  } else {
    await sendMessageToDiscord({ text, embeds, webhookURL });
    return true;
  }
}

export function projectToDiscordEmbed<T extends Project>(
  project: T,
  text: string,
  color: string
) {
  const url = project.url || `https://github.com/${project.full_name}`;
  const thumbnailSize = 50;
  return {
    type: "article",
    title: project.name,
    url,
    description: project.description,
    thumbnail: {
      url: `https://avatars.githubusercontent.com/u/${project.owner_id}?v=3&s=${thumbnailSize}`,
      width: thumbnailSize,
      height: thumbnailSize,
    },
    color: parseInt(color, 16), // has to be a decimal number
    footer: { text }, // a header would be better to introduce the project
  };
}

export async function sendMessageToDiscord({
  text,
  embeds,
  webhookURL,
}: {
  text: string;
  embeds: any[]; // TODO add correct types
  webhookURL: string;
}) {
  const body = {
    content: text,
    embeds,
  };
  try {
    debug(`Sending webhook to ${webhookURL}`, body);
    const result = fetch(webhookURL, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "content-type": "application/json" },
    }).then((res) => res.text());

    debug("Response", result || "(No response)");
    return true;
  } catch (error) {
    throw new Error(
      `Invalid response from Discord ${(error as Error).message}`
    );
  }
}
