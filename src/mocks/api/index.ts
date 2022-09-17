import { rest } from "msw";
import monthlyDownloadsReactResponse from "../data/monthly-downloads-react.json";
import monthlyRankings202203Response from "../data/monthly-rankings-2022-03.json";
import monthlyRankings202204Response from "../data/monthly-rankings-2022-04.json";
import projectDetailsReactResponse from "../data/project-details-react.json";
import userProfileResponse from "../data/user-profile.json";

import fetchAllProjectsDefaultResponse from "../data/projects.json";
import fetchHeroesDefaultResponse from "../data/hof.json";

import projectReadMeReactResponse from "../data/project-readme-react.html";

export const mockFetchProjectReadMe = (
  callback = (response) => response,
  statusCode = 200
) =>
  rest.get("*/api/project-readme", (req, res, ctx) => {
    return res(
      ctx.status(statusCode),
      ctx.set("Content-Type", "text/html; charset=utf-8"),
      ctx.body(callback(projectReadMeReactResponse))
    );
  });

export const mockFetchProjectDetails = (
  callback = (response) => response,
  statusCode = 200
) =>
  rest.get("*/api/project-details", (req, res, ctx) => {
    return res(
      ctx.status(statusCode),
      ctx.json(callback(projectDetailsReactResponse))
    );
  });

export const mockFetchMonthlyDownloads = (
  callback = (response) => response,
  statusCode = 200
) =>
  rest.get("*/api/package-monthly-downloads", (req, res, ctx) => {
    return res(
      ctx.status(statusCode),
      ctx.json(callback(monthlyDownloadsReactResponse))
    );
  });

export const mockFetchMonthlyRankingsLatest = (
  callback = (response) => response,
  statusCode = 200
) =>
  rest.get("*/monthly/latest", (req, res, ctx) => {
    return res(
      ctx.status(statusCode),
      ctx.json(callback(monthlyRankings202204Response))
    );
  });

export const mockFetchMonthlyRankingsPreviousMonth = (
  callback = (response) => response,
  statusCode = 200
) =>
  rest.get("*/monthly/2022/:year-:month.json", (req, res, ctx) => {
    return res(
      ctx.status(statusCode),
      ctx.json(callback(monthlyRankings202203Response))
    );
  });

// Auth
export const mockFetchUserProfile = (
  callback = (response) => response,
  statusCode = 200
) =>
  rest.post("*/tokeninfo", (req, res, ctx) => {
    return res(ctx.status(statusCode), ctx.json(callback(userProfileResponse)));
  });

export const mockFetchAllProjects = (
  callback = (response) => response,
  statusCode = 200
) =>
  rest.get("*/projects.json", (req, res, ctx) => {
    return res(
      ctx.status(statusCode),
      ctx.json(callback(fetchAllProjectsDefaultResponse))
    );
  });

// Hall of fame
export const mockFetchHeroes = (
  callback = (response) => response,
  statusCode = 200
) =>
  rest.get("*/hof.json", (req, res, ctx) => {
    return res(
      ctx.status(statusCode),
      ctx.json(callback(fetchHeroesDefaultResponse))
    );
  });
