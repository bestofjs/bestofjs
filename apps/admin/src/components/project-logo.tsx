"use client";

import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

type Props = {
  project: Pick<BestOfJS.Project, "name" | "owner_id" | "logo">;
  size: number;
  className?: string;
};
export const ProjectLogo = ({ project, size = 100, className }: Props) => {
  const { resolvedTheme } = useTheme();

  const { src } = getProjectImageProps({
    project,
    size,
    colorMode: (resolvedTheme || "dark") as "dark" | "light",
  });

  return (
    <img
      src={src}
      width={size}
      height={size}
      alt={project.name}
      className={cn(className, "project-logo")}
    />
  );
};

function getProjectImageProps({
  project,
  size,
  colorMode,
}: {
  project: Pick<BestOfJS.Project, "name" | "owner_id" | "logo">;
  size: number;
  colorMode: "dark" | "light";
}) {
  const retinaURL =
    !project.logo && getProjectLogoUrl(project, size * 2, colorMode);

  return {
    src: getProjectLogoUrl(project, size, colorMode),
    srcSet: retinaURL ? `${retinaURL} 2x` : undefined, // to display correctly GitHub avatars on Retina screens
  };
  s;
}

/**
 * Return the image URL to be displayed inside the project card
 *  Can be either :
 * - the GitHub owner avatar (by default if no `icon` property is specified)
 * - A custom SVG file if project's `icon`property is specified.
 */
export function getProjectLogoUrl(
  project: Pick<BestOfJS.Project, "name" | "owner_id" | "icon">,
  size: number,
  colorMode: "dark" | "light"
) {
  const url = project.logo
    ? getProjectLogoURL(project.logo, colorMode)
    : getGitHubOwnerAvatarURL(project.owner_id, size);
  return url;
}

function getProjectLogoURL(input: string, colorMode: string) {
  const [main, extension] = input.split(".");
  const filename = colorMode === "dark" ? `${main}.dark.${extension}` : input;
  return `https://bestofjs.org/logos/${filename}`;
}

function getGitHubOwnerAvatarURL(owner_id: string, size: number) {
  return `https://avatars.githubusercontent.com/u/${owner_id}?v=3&s=${size}`;
}
