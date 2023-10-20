import React from "react";

import { SvgSprite } from "../icons";

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
};

export const ChevronLeftIcon = (props: IconProps) => (
  <SvgSprite id="chevron-left-icon" {...props} />
);

export const ChevronRightIcon = (props: IconProps) => (
  <SvgSprite id="chevron-right-icon" {...props} />
);

export const DiscordIcon = (props: IconProps) => (
  <SvgSprite id="discord-icon" {...props} />
);

export const ExternalLinkIcon = (props: IconProps) => (
  <SvgSprite id="external-icon" {...props} />
);

export const GitHubIcon = (props: IconProps) => (
  <SvgSprite id="github-icon" {...props} />
);

export const MoonIcon = (props: IconProps) => (
  <SvgSprite id="moon-icon" size={24} {...props} />
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

export const SunIcon = (props: IconProps) => (
  <SvgSprite id="sun-icon" size={24} {...props} />
);

export const TagIcon = (props: IconProps) => (
  <SvgSprite id="tag-icon" {...props} />
);

export const XMarkIcon = (props: IconProps) => (
  <SvgSprite id="x-mark-icon" {...props} />
);
