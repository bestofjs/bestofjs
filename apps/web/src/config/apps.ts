import { env } from "@/env.mjs";

/**
 * Best of JS runs as several deployments of *this same code*, differing only in
 * which tags they hide. `BESTOFJS_APP` picks one; there is deliberately no
 * conditional keyed on the app anywhere else in the codebase, so
 * `git diff` between deployment branches stays empty.
 */
export const webApps = {
  MAIN: "main",
  NOAI: "noai",
} as const;

export type WebApp = (typeof webApps)[keyof typeof webApps];

/**
 * A list rather than a single tag code so the exclusion can be widened later
 * (`llm`, `mcp`, ...) without touching anything but this table.
 */
export const excludedTagsByApp: Record<WebApp, string[]> = {
  [webApps.MAIN]: [],
  [webApps.NOAI]: ["ai"],
};

/**
 * Marks which deployment you are on, in the header, on every page. Most of the
 * site — project pages, `/tags`, `/hall-of-fame` — renders identically on both,
 * so without a persistent marker there is no way to tell them apart. `null` on
 * the main deployment: it is the unmarked default.
 */
export const badgeLabelByApp: Record<WebApp, string | null> = {
  [webApps.MAIN]: null,
  [webApps.NOAI]: "No AI",
};

export const hostByApp: Record<WebApp, string> = {
  [webApps.MAIN]: "bestofjs.org",
  [webApps.NOAI]: "noai.bestofjs.org",
};

export const currentApp: WebApp = env.BESTOFJS_APP;

/**
 * The tags this deployment hides. Read it through the `@/app/db` façade rather
 * than here: passing it by hand at a query call site is the one mistake that
 * fails silently — the page looks completely normal, it just quietly serves the
 * projects this deployment exists to hide.
 */
export const excludedTagCodes = excludedTagsByApp[currentApp];

export const isMainApp = currentApp === webApps.MAIN;

export const appBadgeLabel = badgeLabelByApp[currentApp];

/**
 * The default value of the `/projects` `?ai=1|0` parameter: the *only*
 * difference between deployments on that page. The control itself behaves
 * identically on both — the No AI deployment does show AI projects when the URL
 * explicitly asks for them. Suppressing that would mean hiding the parameter on
 * one deployment and deciding what a hand-typed `?ai=1` does there, which is
 * exactly the app-specific branching this design avoids.
 */
export const showExcludedTagsByDefault = excludedTagCodes.length === 0;
