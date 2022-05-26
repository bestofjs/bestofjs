import { rest } from "msw";
import {
  fetchMonthlyDownloadsDefaultResponse,
  fetchMonthlyRankingPreviousMonthDefaultResponse,
  fetchMonthlyRankingsLatestDefaultResponse,
  fetchProjectDetailsDefaultResponse,
  fetchProjectReadMeDefaultResponse,
  fetchUserProfileDefaultResponse,
} from "mocks/data";
import fetchAllProjectsDefaultResponse from "../data/project.json";
import fetchHeroesDefaultResponse from "../data/hof.json";

export const mockFetchProjectReadMe = (
  callback = (response) => response,
  statusCode = 200
) =>
  rest.get("*/api/project-readme", (req, res, ctx) => {
    return res(
      ctx.status(statusCode),
      ctx.set("Content-Type", "text/html; charset=utf-8"),
      ctx.body(callback(fetchProjectReadMeDefaultResponse))
    );
  });

export const mockFetchProjectDetails = (
  callback = (response) => response,
  statusCode = 200
) =>
  rest.get("*/api/project-details", (req, res, ctx) => {
    return res(
      ctx.status(statusCode),
      ctx.json(callback(fetchProjectDetailsDefaultResponse))
    );
  });

export const mockFetchMonthlyDownloads = (
  callback = (response) => response,
  statusCode = 200
) =>
  rest.get("*/api/package-monthly-downloads", (req, res, ctx) => {
    return res(
      ctx.status(statusCode),
      ctx.json(callback(fetchMonthlyDownloadsDefaultResponse))
    );
  });

export const mockFetchMonthlyRankingsLatest = (
  callback = (response) => response,
  statusCode = 200
) =>
  rest.get("*/monthly/latest", (req, res, ctx) => {
    return res(
      ctx.status(statusCode),
      ctx.json(callback(fetchMonthlyRankingsLatestDefaultResponse))
    );
  });

export const mockFetchMonthlyRankingsPreviousMonth = (
  callback = (response) => response,
  statusCode = 200
) =>
  rest.get("*/monthly/2022/:year-:month.json", (req, res, ctx) => {
    return res(
      ctx.status(statusCode),
      ctx.json(callback(fetchMonthlyRankingPreviousMonthDefaultResponse))
    );
  });

// Auth
export const mockFetchUserProfile = (
  callback = (response) => response,
  statusCode = 200
) =>
  rest.post("*/tokeninfo", (req, res, ctx) => {
    return res(
      ctx.status(statusCode),
      ctx.json(callback(fetchUserProfileDefaultResponse))
    );
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
