"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

import { getProjectAvatarUrl } from "./project-utils";

type Props = {
  project: Pick<BestOfJS.Project, "name" | "owner_id" | "icon">;
  size: number;
  className?: string;
};
export const ProjectAvatar = ({ project, size = 100, className }: Props) => {
  const { resolvedTheme } = useTheme();

  const { src } = getProjectImageProps({
    project,
    size,
    colorMode: (resolvedTheme || "dark") as "dark" | "light",
  });

  return (
    <Image
      src={src}
      width={size}
      height={size}
      alt={project.name}
      className={cn(className, `w-[${size}px] h-[${size}px max-w-none`)}
      placeholder="blur"
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
