/**
 * The fields a project logo is derived from. Widened from `BestOfJS.Project` so
 * the narrow DB rows the OG image routes select (where `projects.logo` is
 * nullable) type-check too; every existing caller passes a full project.
 */
export type ProjectLogoSource = {
  name: string;
  logo?: string | null;
  owner_id: number;
};

export function getProjectLogoURL(
  project: Pick<ProjectLogoSource, "logo" | "owner_id">,
  size: number,
  colorMode: "dark" | "light",
) {
  if (project.logo) {
    return getProjectCustomLogoURL(project.logo, colorMode);
  }
  return getGitHubOwnerAvatarURL(project.owner_id, size);
}

/**
 * Return the relative URL of the project's SVG logo, taking into account the color mode
 * E.g. `/logos/react.dark.svg` for dark mode or `/logos/parcel.svg` for light mode
 */
export function getProjectCustomLogoURL(
  filename: string,
  colorMode: "light" | "dark",
) {
  const [main, extension] = filename.split(".");
  const actualFilename =
    colorMode === "dark" ? `${main}.dark.${extension}` : filename;
  return `/logos/${actualFilename}`;
}

export function getGitHubOwnerAvatarURL(owner_id: number, size: number) {
  return `https://avatars.githubusercontent.com/u/${owner_id}?v=3&s=${size}`;
}
