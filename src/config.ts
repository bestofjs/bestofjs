export const APP_DISPLAY_NAME = "Best of JS";
export const APP_REPO_URL = "https://github.com/bestofjs/bestofjs-webui";
export const RISING_STARS_URL = "https://risingstars.js.org";
export const SPONSOR_URL = `https://github.com/sponsors/michaelrambeau`;
export const STATE_OF_JS_URL = `https://stateofjs.com`;
export const APP_VERSION = process.env.VITE_APP_VERSION || "0.0.0";
export const ISSUE_TRACKER_URL = `https://github.com/michaelrambeau/bestofjs`;

// Root URLs of the static JSON files generated everyday
export const FETCH_ALL_PROJECTS_URL = readEnvironmentVariable("JSON_API");
export const FETCH_HALL_OF_FAME_URL = readEnvironmentVariable("JSON_API");

// Serverless function end-points
export const FETCH_README_URL = readEnvironmentVariable("DYNAMIC_API");
export const FETCH_DETAILS_URL = readEnvironmentVariable("DYNAMIC_API");
export const FETCH_PACKAGE_DATA_URL = readEnvironmentVariable("DYNAMIC_API");

// Monthly ranking JSON files generated every month
export const FETCH_RANKINGS_URL = readEnvironmentVariable("FETCH_RANKINGS");

function readEnvironmentVariable(key: string) {
  const variableFullName = `VITE_APP_${key}`;
  const value = process.env[variableFullName];
  if (!value) throw new Error(`No env. value setup for "${variableFullName}"`);
  return value;
}
