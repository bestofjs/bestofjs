import React, { useState, useEffect } from "react";
import ContentLoader from "react-content-loader";

import { Box, useColorMode, chakra } from "components/core";

type Props = {
  project: BestOfJS.Project;
  size: number;
};
export const ProjectAvatar = ({ project, size = 100 }: Props) => {
  const { colorMode } = useColorMode();
  const { src, srcSet } = getProjectImageProps({ project, size, colorMode });

  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const isMounted = React.useRef(true);

  useEffect(() => {
    const image = new Image();
    image.src = src;
    if (srcSet) {
      image.srcset = srcSet;
    }
    image.onload = () => {
      if (isMounted.current) setIsImageLoaded(true);
    };
    return () => {
      isMounted.current = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return isImageLoaded ? (
    <chakra.img
      src={src}
      srcSet={srcSet}
      boxSize={`${size}px`}
      alt={project.name}
      maxW="unset"
      borderRadius="5px"
    />
  ) : (
    <ImagePlaceHolder size={size} />
  );
};

function getProjectImageProps({ project, size, colorMode }) {
  const retinaURL =
    !project.icon && getProjectAvatarUrl(project, size * 2, colorMode);

  return {
    src: getProjectAvatarUrl(project, size, colorMode),
    srcSet: retinaURL ? `${retinaURL} 2x` : undefined, // to display correctly GitHub avatars on Retina screens
  };
}

const ImagePlaceHolder = ({ size }) => {
  return (
    <Box w={`${size}px`} h={`${size}px`}>
      <ContentLoader
        viewBox="0 0 100 100"
        backgroundColor="var(--graphBackgroundColor)"
        foregroundColor="var(--iconColor)"
      >
        <circle cx="50" cy="50" r="40" />
      </ContentLoader>
    </Box>
  );
};

/*
Return the image URL to be displayed inside the project card
Can be either :
* the GitHub owner avatar (by default if no `icon` property is specified)
* A custom SVG file if project's `icon`property is specified.
The SVG can be stored locally (inside `www/logos` folder) or in the cloud.
*/

function getProjectLogoURL(input, colorMode) {
  const [main, extension] = input.split(".");
  const filename = colorMode === "dark" ? `${main}.dark.${extension}` : input;
  return `https://bestofjs.org/logos/${filename}`;
}

function getGitHubOwnerAvatarURL(owner_id, size) {
  return `https://avatars.githubusercontent.com/u/${owner_id}?v=3&s=${size}`;
}

export function getProjectAvatarUrl(project, size, colorMode) {
  return project.icon
    ? getProjectLogoURL(project.icon, colorMode)
    : getGitHubOwnerAvatarURL(project.owner_id, size);
}
