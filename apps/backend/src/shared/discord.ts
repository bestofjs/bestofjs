import debugPackage from "debug";

import { ProjectItem } from "@/tasks/static-api-types";

const debug = debugPackage("notify");

type Project = Pick<
  ProjectItem,
  "name" | "full_name" | "owner_id" | "description" | "url"
>;

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

export async function sendMessageToDiscord(
  text: string,
  { url, embeds }: { url: string; embeds: any }
) {
  const body = {
    content: text,
    embeds,
  };
  try {
    debug(`Sending webhook to ${url}`, body);
    const result = fetch(url, {
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
