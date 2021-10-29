import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import numeral from "numeral";
import slugify from "slugify";
import ContentLoader from "react-content-loader";

import { Box, useColorMode, chakra } from "components/core";
import { StarIcon } from "./icons";

export const DownloadCount = ({ value }) => {
  if (value === undefined) {
    return <div className="star-delta text-secondary text-small">N/A</div>;
  }

  return <span>{numeral(value).format("a")}</span>;
};

const getSign = (value) => {
  if (value === 0) return "";
  return value > 0 ? "+" : "-";
};

const StarDeltaContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StarDelta = ({ average, ...props }) =>
  // @ts-ignore
  average ? <StarDeltaAverage {...props} /> : <StarDeltaNormal {...props} />;

const StarDeltaNormal = ({ value, ...props }) => {
  const sign = getSign(value);
  return (
    <StarDeltaContainer>
      {value === 0 ? (
        "="
      ) : (
        <>
          <Box as="span" mr="2px">
            {sign}
          </Box>
          <span>{formatBigNumber(Math.abs(value))}</span>
          <StarIcon fontSize="20px" {...props} />
        </>
      )}
    </StarDeltaContainer>
  );
};

const StarDeltaAverageContainer = styled.div`
  text-align: center;
`;

export const StarDeltaAverage = ({ value }) => {
  const integerPart = Math.abs(Math.trunc(value));
  const decimalPart = (Math.abs(value - integerPart) * 10)
    .toFixed()
    .slice(0, 1);
  const sign = getSign(value);

  if (value === undefined)
    return <div className="star-delta text-secondary text-small">N/A</div>;

  return (
    <StarDeltaAverageContainer>
      <StarDeltaContainer>
        <span style={{ marginRight: 2 }}>{sign}</span>
        <span>{integerPart}</span>
        <span className="text-secondary">.{decimalPart}</span>
        <StarIcon fontSize="20px" />
        <span> /day</span>
      </StarDeltaContainer>
    </StarDeltaAverageContainer>
  );
};

export const StarTotal = ({ value }) => {
  return (
    <Span>
      <span>{formatBigNumber(value)}</span>
      <StarIcon fontSize="20px" />
    </Span>
  );
};

// Display a (potentially) big number, either the total number of star or a yearly/monthly delta
// using the `k` prefix
function formatBigNumber(value: number): string {
  const digits = value > 1000 && value < 10000 ? "0.0" : "0";
  return numeral(value).format(digits + " a");
}

const Span = styled.span`
  display: inline-flex;
`;

export const Avatar = ({ project, size = 100, ...props }) => {
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
  return `/logos/${filename}`;
}

function getGitHubOwnerAvatarURL(owner_id, size) {
  return `https://avatars.githubusercontent.com/u/${owner_id}?v=3&s=${size}`;
}

export function getProjectAvatarUrl(project, size, colorMode) {
  return project.icon
    ? getProjectLogoURL(project.icon, colorMode)
    : getGitHubOwnerAvatarURL(project.owner_id, size);
}

export function getProjectId(project) {
  return slugify(project.name, { lower: true, remove: /[.'/]/g });
}
