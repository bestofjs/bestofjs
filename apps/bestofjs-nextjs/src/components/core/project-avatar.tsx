"use client";

import { useTheme } from "next-themes";

import { getProjectAvatarUrl } from "./project-utils";

type Props = {
  project: Pick<BestOfJS.Project, "name" | "owner_id" | "icon">;
  size: number;
  className?: string;
};
export const ProjectAvatar = ({ project, size = 100, className }: Props) => {
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
      className={className}
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
