import React from "react";
import { Tag } from "lucide-react";

import { SvgSprite } from "./svg-sprite";

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
};

// For a maximum flexibility, we export each available icon as a separate component.
// The default size (16px) is sometimes overridden by the `size` prop,
// it's useful for Sun and Moon icons that have a viewVBox of 24px.

export const ChevronDownIcon = (props: IconProps) => (
  <SvgSprite id="chevron-down-icon" {...props} />
);

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
  <SvgSprite id="external-link-icon" {...props} />
);

export const GitHubIcon = (props: IconProps) => (
  <SvgSprite id="github-icon" {...props} />
);

export const HamburgerMenuIcon = (props: IconProps) => (
  <SvgSprite id="hamburger-menu-icon" {...props} />
);

export const HomeIcon = (props: IconProps) => (
  <SvgSprite id="home-icon" {...props} />
);

export const MoonIcon = (props: IconProps) => (
  <SvgSprite id="moon-icon" size={24} {...props} />
);

export const PlusIcon = (props: IconProps) => (
  <SvgSprite id="plus-icon" {...props} />
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
  // <SvgSprite id="tag-icon" {...props} />
  <Tag {...props} />
);

export const TagsIcons = (props: IconProps) => (
  <SvgSprite id="tags-icon" {...props} />
);

export const XMarkIcon = (props: IconProps) => (
  <SvgSprite id="x-mark-icon" {...props} />
);

export function NpmIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="currentColor"
    >
      <title>npm</title>
      <path
        d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z"
        color="currentColor"
      />
    </svg>
  );
}
