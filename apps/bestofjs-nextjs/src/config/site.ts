export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Best of JS",
  description:
    "Check out the most popular open-source projects and the latest trends about the web platform: React, Bue.js, Node.js, Bun, Deno...",
  links: {
    github: "https://github.com/bestofjs/bestofjs-webui",
  },
};

export const APP_DISPLAY_NAME = "Best of JS";
export const APP_REPO_URL = "https://github.com/bestofjs/bestofjs-webui";
export const RISING_STARS_URL = "https://risingstars.js.org";
export const SPONSOR_URL = `https://github.com/sponsors/michaelrambeau`;
export const STATE_OF_JS_URL = `https://stateofjs.com`;
export const APP_VERSION = process.env.NEXT_PUBLIC_VERSION || "0.0.0";
export const ISSUE_TRACKER_URL = `https://github.com/michaelrambeau/bestofjs`;
export const ADD_PROJECT_REQUEST_URL = `${ISSUE_TRACKER_URL}/issues/new?template=add-a-project-to-best-of-javascript.md`;

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  isActive: (pathname: string) => boolean;
}

export const mainNavItems: NavItem[] = [
  {
    title: "Home",
    href: "/",
    isActive: (pathname: string) => pathname === "/",
  },
  {
    title: "Projects",
    href: "/projects",
    isActive: (pathname: string) => pathname.startsWith("/projects"),
  },
  {
    title: "Tags",
    href: "/tags",
    isActive: (pathname: string) => pathname.startsWith("/tags"),
  },
  {
    title: "Monthly",
    href: "/rankings/monthly",
    isActive: (pathname: string) => pathname.startsWith("/rankings"),
  },
  // TODO: add a "More" button to reveal more links from the top nav bar?
  // {
  //   title: "About",
  //   href: "/about",
  //   isActive: (pathname: string) => pathname.startsWith("/about"),
  // },
];
