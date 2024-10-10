import debugPackage from "debug";

import { ProjectItem } from "@/tasks/static-api-types";

const debug = debugPackage("notify");

type Project = Pick<
  ProjectItem,
  "name" | "full_name" | "owner_id" | "description" | "url"
>;

export async function sendMessageToSlack(
  text: string,
  {
    url,
    channel,
    attachments,
  }: { url: string; channel?: string; attachments: any }
) {
  const body = {
    text,
    mrkdwn: true,
    attachments,
  };
  if (channel) {
    // TODO add correct types
    (body as any).channel = `#${channel}`; // Override the default webhook channel, if specified (for tests)
  }

  debug("Request", body);
  try {
    const result = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "content-type": "application/json" },
    }).then((res) => res.text());

    debug("Response", result);
    return true;
  } catch (error) {
    throw new Error(`Invalid response from Slack ${(error as Error).message}`);
  }
}

/**
 * Convert a `Project` into an "attachment" included in the Slack message
 * See: https://api.slack.com/docs/message-attachments
 */
export function projectToSlackAttachment<T extends Project>(
  project: T,
  pretext: string
) {
  const url = project.url || `https://github.com/${project.full_name}`;
  const owner = project.full_name.split("/")[0];
  const author_name = owner;
  // `thumb_url` does not accept .svg files so we don't use project `logo` property
  const thumb_url = `https://avatars.githubusercontent.com/u/${project.owner_id}?v=3&s=75`;
  const attachment = {
    color: "#e65100",
    pretext,
    author_name,
    author_link: `https://github.com/${owner}`,
    title: project.name,
    title_link: url,
    text: project.description,
    thumb_url,
  };
  return attachment;
}
