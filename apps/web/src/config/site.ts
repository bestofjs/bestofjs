export const APP_DISPLAY_NAME = "Best of JS";
export const APP_DESCRIPTION = `Check out the most popular open-source projects and the latest trends about the web platform: React, Vue.js, Node.js, Deno, Bun... The best of JavaScript, TypeScript and friends!`;
export const APP_CANONICAL_URL = "https://bestofjs.org";
export const APP_REPO_FULL_NAME = "bestofjs/bestofjs";
export const APP_REPO_URL = "https://github.com/" + APP_REPO_FULL_NAME;
export const DISCORD_URL = "https://discord.com/invite/rdctdFX2qR";
export const RISING_STARS_URL = "https://risingstars.js.org";
export const SPONSOR_URL = `https://github.com/sponsors/michaelrambeau`;
export const STATE_OF_JS_URL = `https://stateofjs.com`;
export const APP_VERSION = process.env.NEXT_PUBLIC_VERSION || "0.0.0";
export const ISSUE_TRACKER_URL = `https://github.com/michaelrambeau/bestofjs`;
export const ADD_PROJECT_REQUEST_URL = `${ISSUE_TRACKER_URL}/issues/new?template=add-a-project-to-best-of-javascript.md`;

export interface NavItem {
  title: string;
  href: string;
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
];

export const extraNavItems: NavItem[] = [
  {
    title: "Hall of Fame",
    href: "/hall-of-fame",
    isActive: (pathname: string) => pathname.startsWith("/hall-of-fame"),
  },
  {
    title: "About",
    href: "/about",
    isActive: (pathname: string) => pathname.startsWith("/about"),
  },
];
