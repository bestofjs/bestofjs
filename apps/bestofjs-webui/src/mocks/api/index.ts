import { http, HttpResponse } from "msw";

import monthlyDownloadsReactResponse from "../data/monthly-downloads-react.json";
import monthlyRankings202203Response from "../data/monthly-rankings-2022-03.json";
import monthlyRankings202204Response from "../data/monthly-rankings-2022-04.json";
import projectDetailsReactResponse from "../data/project-details-react.json";
import userProfileResponse from "../data/user-profile.json";

import fetchHeroesDefaultResponse from "../data/hof.json";

import projectReadMeReactResponse from "../data/project-readme-react.html";

export const mockFetchProjectReadMe = (
  callback = (response) => response,
  statusCode = 200
) =>
  http.get("*/api/project-readme", () => {
    return new HttpResponse(callback(projectReadMeReactResponse), {
      status: statusCode,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  });

export const mockFetchProjectDetails = (
  callback = (response) => response,
  statusCode = 200
) =>
  http.get("*/api/project-details", () => {
    return HttpResponse.json(callback(projectDetailsReactResponse), {
      status: statusCode,
    });
  });

export const mockFetchMonthlyDownloads = (
  callback = (response) => response,
  statusCode = 200
) =>
  http.get("*/api/package-monthly-downloads", () => {
    return HttpResponse.json(callback(monthlyDownloadsReactResponse), {
      status: statusCode,
    });
  });

export const mockFetchMonthlyRankingsLatest = (
  callback = (response) => response,
  statusCode = 200
) =>
  http.get("*/monthly/latest", () => {
    return HttpResponse.json(callback(monthlyRankings202204Response), {
      status: statusCode,
    });
  });

export const mockFetchMonthlyRankingsPreviousMonth = (
  callback = (response) => response,
  statusCode = 200
) =>
  http.get("*/monthly/2022/:year-:month.json", () => {
    return HttpResponse.json(callback(monthlyRankings202203Response), {
      status: statusCode,
    });
  });

// Auth
export const mockFetchUserProfile = (
  callback = (response) => response,
  statusCode = 200
) =>
  http.post("*/tokeninfo", () => {
    return HttpResponse.json(callback(userProfileResponse), {
      status: statusCode,
    });
  });

// Hall of fame
export const mockFetchHeroes = (
  callback = (response) => response,
  statusCode = 200
) =>
  http.get("*/hof.json", () => {
    return HttpResponse.json(callback(fetchHeroesDefaultResponse), {
      status: statusCode,
    });
  });
