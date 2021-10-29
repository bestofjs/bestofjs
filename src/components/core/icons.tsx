import React from "react";
import { GoChevronDown, GoLinkExternal, GoTag } from "react-icons/go";
import { MdStarBorder } from "react-icons/md";

import { Icon, IconProps } from "components/core";

export const StarIcon = (props: IconProps) => (
  <Icon as={MdStarBorder} fontSize="16px" {...props} />
);

export const TagIcon = (props) => <GoTag {...props} />;

export const DoubleChevronLeftIcon = (props) => {
  return (
    <SVGContainer {...props}>
      <polyline points="11 17 6 12 11 7" />
      <polyline points="18 17 13 12 18 7" />
    </SVGContainer>
  );
};

export const DoubleChevronRightIcon = (props) => {
  return (
    <SVGContainer {...props}>
      <polyline points="13 17 18 12 13 7" />
      <polyline points="6 17 11 12 6 7" />
    </SVGContainer>
  );
};

export const ChevronLeftIcon = (props) => {
  return (
    <SVGContainer {...props}>
      <polyline points="15 18 9 12 15 6" />
    </SVGContainer>
  );
};

export const ChevronRightIcon = (props) => {
  return (
    <SVGContainer {...props}>
      <polyline points="9 18 15 12 9 6" />
    </SVGContainer>
  );
};

export const ChevronDownIcon = (props: IconProps) => (
  <Icon as={GoChevronDown} {...props} />
);

const SVGContainer = ({ children, color = "currentColor", size = 24 }) => {
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

export const ExternalLinkIcon = (props: IconProps) => {
  return <Icon as={GoLinkExternal} ml={1} {...props} />;
};

export const DiscordIcon = ({ size = 24 }) => {
  return (
    <svg viewBox="0 0 146 146" width={size} height={size}>
      <path
        fill="currentColor"
        d="M107.75 125.001s-4.5-5.375-8.25-10.125c16.375-4.625 22.625-14.875 22.625-14.875-5.125 3.375-10 5.75-14.375 7.375-6.25 2.625-12.25 4.375-18.125 5.375-12 2.25-23 1.625-32.375-.125-7.125-1.375-13.25-3.375-18.375-5.375-2.875-1.125-6-2.5-9.125-4.25-.375-.25-.75-.375-1.125-.625-.25-.125-.375-.25-.5-.375-2.25-1.25-3.5-2.125-3.5-2.125s6 10 21.875 14.75c-3.75 4.75-8.375 10.375-8.375 10.375-27.625-.875-38.125-19-38.125-19 0-40.25 18-72.875 18-72.875 18-13.5 35.125-13.125 35.125-13.125l1.25 1.5c-22.5 6.5-32.875 16.375-32.875 16.375s2.75-1.5 7.375-3.625c13.375-5.875 24-7.5 28.375-7.875.75-.125 1.375-.25 2.125-.25 7.625-1 16.25-1.25 25.25-.25 11.875 1.375 24.625 4.875 37.625 12 0 0-9.875-9.375-31.125-15.875l1.75-2S110 19.626 128 33.126c0 0 18 32.625 18 72.875 0 0-10.625 18.125-38.25 19zM49.625 66.626c-7.125 0-12.75 6.25-12.75 13.875s5.75 13.875 12.75 13.875c7.125 0 12.75-6.25 12.75-13.875.125-7.625-5.625-13.875-12.75-13.875zm45.625 0c-7.125 0-12.75 6.25-12.75 13.875s5.75 13.875 12.75 13.875c7.125 0 12.75-6.25 12.75-13.875s-5.625-13.875-12.75-13.875z"
        fillRule="nonzero"
      ></path>
    </svg>
  );
};
