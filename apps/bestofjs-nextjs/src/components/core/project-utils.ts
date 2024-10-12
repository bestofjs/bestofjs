export function getProjectLogoURL(
  project: BestOfJS.Project,
  size: number,
  colorMode: string
) {
  if (project.logo) {
    return getProjectCustomLogoURL(project.logo, colorMode);
  }
  return getGitHubOwnerAvatarURL(project.owner_id, size);
}

/**
 * Return the relative URL of the project SVG logo, taking into account the color mode
 * E.g. /logos/react.dark.svg or /logos/parcel.svg
 */
export function getProjectCustomLogoURL(filename: string, colorMode: string) {
  const [main, extension] = filename.split(".");
  const actualFilename =
    colorMode === "dark" ? `${main}.dark.${extension}` : filename;
  return `/logos/${actualFilename}`;
}

export function getGitHubOwnerAvatarURL(owner_id: string, size: number) {
  return `https://avatars.githubusercontent.com/u/${owner_id}?v=3&s=${size}`;
}
