import React from "react";

import { SvgSprite } from "../icons";

export const ExternalLinkIcon = (props: IconProps) => (
  <SvgSprite id="external-icon" {...props} />
);

export const GitHubIcon = (props: IconProps) => (
  <SvgSprite id="github-icon" {...props} />
);

export const PlusIcon = (props: IconProps) => (
  <SvgSprite id="plus-icon" {...props} />
);

export const HomeIcon = (props: IconProps) => (
  <SvgSprite id="home-icon" {...props} />
);

export const SearchIcon = (props: IconProps) => (
  <SvgSprite id="search-icon" {...props} />
);

export const StarIcon = (props: IconProps) => (
  <SvgSprite id="star-icon" {...props} />
);

export const TagIcon = (props: IconProps) => (
  <SvgSprite id="tag-icon" {...props} />
);

export const XMarkIcon = (props: IconProps) => (
  <SvgSprite id="x-mark-icon" {...props} />
);

type IconProps = {
  color?: string;
  size?: number;
};

export const DoubleChevronLeftIcon = (props: IconProps) => {
  return (
    <SVGContainer {...props}>
      <polyline points="11 17 6 12 11 7" />
      <polyline points="18 17 13 12 18 7" />
    </SVGContainer>
  );
};

export const DoubleChevronRightIcon = (props: IconProps) => {
  return (
    <SVGContainer {...props}>
      <polyline points="13 17 18 12 13 7" />
      <polyline points="6 17 11 12 6 7" />
    </SVGContainer>
  );
};

export const ChevronLeftIcon = (props: IconProps) => {
  return (
    <SVGContainer {...props}>
      <polyline points="15 18 9 12 15 6" />
    </SVGContainer>
  );
};

export const ChevronRightIcon = (props: IconProps) => {
  return (
    <SVGContainer {...props}>
      <polyline points="9 18 15 12 9 6" />
    </SVGContainer>
  );
};

const SVGContainer = ({
  children,
  color = "currentColor",
  size = 24,
}: IconProps & {
  children: React.ReactNode;
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      stroke={color}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
};
