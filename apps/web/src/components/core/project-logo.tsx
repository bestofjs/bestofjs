"use client";

import { Fragment } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

import {
  getGitHubOwnerAvatarURL,
  getProjectCustomLogoURL,
} from "./project-utils";

type BaseProject =
  | { name: string; owner_id: number }
  | { name: string; logo: string };

type Props<T extends BaseProject> = {
  project: T;
  size?: number;
  className?: string;
};
/**
 * Project logo to be displayed in project lists. It can be:
 * - the GitHub owner avatar (by default if no `logo` property is specified)
 * - A custom SVG file if project's `logo` property is specified.
 */
export function ProjectLogo<T extends BaseProject>({
  project,
  size = 100,
  className,
}: Props<T>) {
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
}

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
  return (
    <Fragment>
      <Image
        src={getProjectCustomLogoURL(filename, "light")}
        width={size}
        height={size}
        alt={name}
        className={cn(className, "project-logo", "light-mode-only")}
      />
      <Image
        src={getProjectCustomLogoURL(filename, "dark")}
        width={size}
        height={size}
        alt={name}
        className={cn(className, "project-logo", "dark-mode-only")}
      />
    </Fragment>
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
