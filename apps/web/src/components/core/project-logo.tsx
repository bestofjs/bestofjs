"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import {
  getGitHubOwnerAvatarURL,
  getProjectCustomLogoURL,
} from "./project-utils";

type Props = {
  project: { name: string; owner_id: number } | { name: string; logo: string };
  size?: number;
  className?: string;
};
/**
 * Project logo to be displayed in project lists. It can be:
 * - the GitHub owner avatar (by default if no `logo` property is specified)
 * - A custom SVG file if project's `logo` property is specified.
 */
export const ProjectLogo = ({ project, size = 100, className }: Props) => {
  if ("logo" in project && project.logo) {
    return (
      <ProjectCustomLogo
        filename={project.logo}
        name={project.name}
        size={size}
        className={className}
      />
    );
  }

  if ("owner_id" in project) {
    return (
      <GitHubAvatar
        owner_id={project.owner_id}
        name={project.name}
        size={size}
        className={className}
      />
    );
  }
  return null;
};

type BaseProps = {
  name: string;
  size?: number;
  className?: string;
};

export function ProjectCustomLogo({
  name,
  filename,
  size = 100,
  className,
}: {
  filename: string;
} & BaseProps) {
  const colorMode = useColorMode();
  const imageURL = getProjectCustomLogoURL(filename, colorMode);
  return (
    <Image
      src={imageURL}
      width={size}
      height={size}
      alt={name}
      className={cn(className, "project-logo")}
    />
  );
}

export function GitHubAvatar({
  owner_id,
  name,
  size = 100,
  className,
}: { owner_id: number } & BaseProps) {
  const imageURL = getGitHubOwnerAvatarURL(owner_id, size * 2);

  return (
    <Image
      src={imageURL}
      sizes={`(min-resolution: 2dppx) ${size * 2}px, ${size}px`}
      width={size}
      height={size}
      alt={name}
      className={cn(className, "project-logo")}
    />
  );
}

function useColorMode() {
  const { resolvedTheme } = useTheme();
  return (resolvedTheme || "dark") as "dark" | "light";
}
