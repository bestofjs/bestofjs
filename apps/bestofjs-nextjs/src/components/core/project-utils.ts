/**
 * Return the image URL to be displayed inside the project card
 *  Can be either :
 * - the GitHub owner avatar (by default if no `icon` property is specified)
 * - A custom SVG file if project's `icon`property is specified.
 */
export function getProjectAvatarUrl(
  project: Pick<BestOfJS.Project, "name" | "owner_id" | "icon">,
  size: number,
  colorMode: "dark" | "light"
) {
  const url = project.icon
    ? getProjectLogoURL(project.icon, colorMode)
    : getGitHubOwnerAvatarURL(project.owner_id, size);
  return url;
}

function getProjectLogoURL(input: string, colorMode: string) {
  const [main, extension] = input.split(".");
  const filename = colorMode === "dark" ? `${main}.dark.${extension}` : input;
  return `/logos/${filename}`;
}

function getGitHubOwnerAvatarURL(owner_id: string, size: number) {
  return `https://avatars.githubusercontent.com/u/${owner_id}?v=3&s=${size}`;
}
