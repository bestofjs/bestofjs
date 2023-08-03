"use client";

import { useTheme } from "next-themes";

type Props = {
  project: Pick<BestOfJS.Project, "name" | "owner_id" | "icon">;
  size: number;
};
export const ProjectAvatar = ({ project, size = 100 }: Props) => {
  const { resolvedTheme } = useTheme();

  const { src, srcSet } = getProjectImageProps({
    project,
    size,
    colorMode: (resolvedTheme || "dark") as "dark" | "light",
  });

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      srcSet={srcSet}
      style={{
        height: `${size}px`,
        maxWidth: "unset",
        width: `${size}px`,
      }}
      alt={project.name}
    />
  );
};

function getProjectImageProps({
  project,
  size,
  colorMode,
}: {
  project: Pick<BestOfJS.Project, "name" | "owner_id" | "icon">;
  size: number;
  colorMode: "dark" | "light";
}) {
  const retinaURL =
    !project.icon && getProjectAvatarUrl(project, size * 2, colorMode);

  return {
    src: getProjectAvatarUrl(project, size, colorMode),
    srcSet: retinaURL ? `${retinaURL} 2x` : undefined, // to display correctly GitHub avatars on Retina screens
  };
}

/*
Return the image URL to be displayed inside the project card
Can be either :
* the GitHub owner avatar (by default if no `icon` property is specified)
* A custom SVG file if project's `icon`property is specified.
The SVG can be stored locally (inside `www/logos` folder) or in the cloud.
*/

function getProjectLogoURL(input: string, colorMode: string) {
  const [main, extension] = input.split(".");
  const filename = colorMode === "dark" ? `${main}.dark.${extension}` : input;
  return `https://bestofjs.org/logos/${filename}`;
}

function getGitHubOwnerAvatarURL(owner_id: string, size: number) {
  return `https://avatars.githubusercontent.com/u/${owner_id}?v=3&s=${size}`;
}

export function getProjectAvatarUrl(
  project: Props["project"],
  size: number,
  colorMode: "dark" | "light"
) {
  const url = project.icon
    ? getProjectLogoURL(project.icon, colorMode)
    : getGitHubOwnerAvatarURL(project.owner_id, size);
  return url;
}
