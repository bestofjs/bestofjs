/* eslint-disable @next/next/no-img-element */
"use client";

import { useTheme } from "next-themes";
import invariant from "tiny-invariant";

import { cn } from "@/lib/utils";

type Props = {
  project: {
    name: string;
    logo?: string | null;
    repo: { owner_id: number } | null;
  };
  size: number;
  className?: string;
};
export const ProjectLogo = ({ project, size = 100, className }: Props) => {
  invariant(project);
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
  project: Props["project"];
  size: number;
  colorMode: "dark" | "light";
}) {
  invariant(project);
  const retinaURL =
    !project.logo && getProjectLogoUrl(project, size * 2, colorMode);

  return {
    src: getProjectLogoUrl(project, size, colorMode),
    srcSet: retinaURL ? `${retinaURL} 2x` : undefined, // to display correctly GitHub avatars on Retina screens
  };
}

/**
 * Return the image URL to be displayed inside the project card
 *  Can be either :
 * - the GitHub owner avatar (by default if no `icon` property is specified)
 * - A custom SVG file if project's `icon`property is specified.
 */
export function getProjectLogoUrl(
  project: Props["project"],
  size: number,
  colorMode: "dark" | "light",
) {
  invariant(project);
  invariant(project.repo);
  const url = project.logo
    ? getProjectLogoURL(project.logo, colorMode)
    : getGitHubOwnerAvatarURL(project.repo.owner_id, size);
  return url;
}

function getProjectLogoURL(input: string, colorMode: "dark" | "light") {
  const [main, extension] = input.split(".");
  const filename = colorMode === "dark" ? `${main}.dark.${extension}` : input;
  return `https://bestofjs.org/logos/${filename}`;
}

function getGitHubOwnerAvatarURL(owner_id: number, size: number) {
  return `https://avatars.githubusercontent.com/u/${owner_id}?v=3&s=${size}`;
}
