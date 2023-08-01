import useSWR from "swr";

import {
  FETCH_DETAILS_URL,
  FETCH_PACKAGE_DATA_URL,
  FETCH_RANKINGS_URL,
  FETCH_README_URL,
} from "config";
import { fetchHTML, fetchJSON } from "helpers/fetch";

export function useFetchProjectReadMe({ full_name, branch }) {
  const fetcher = () => fetchProjectReadMe({ full_name, branch });
  return useSWR(["/api/projects/readme", full_name], fetcher);
}

function fetchProjectReadMe({ full_name, branch = "master" }) {
  const url = `${FETCH_README_URL}/api/project-readme?fullName=${encodeURIComponent(
    full_name
  )}&branch=${encodeURIComponent(branch)}`;
  return fetchHTML(url);
}

export function useFetchProjectDetails({ full_name }) {
  const fetcher = () => fetchProjectDetails({ full_name });
  return useSWR(["/api/projects/details", full_name], fetcher);
}

function fetchProjectDetails({ full_name }) {
  const url = `${FETCH_DETAILS_URL}/api/project-details?fullName=${encodeURIComponent(
    full_name
  )}`;
  return fetchJSON(url);
}

export function useFetchMonthlyDownloads(packageName) {
  const fetcher = () => fetchMonthlyDownloads({ packageName });
  return useSWR(["/api/projects/downloads", packageName], fetcher);
}

const fetchMonthlyDownloads = ({ packageName }) => {
  const url = `${FETCH_PACKAGE_DATA_URL}/api/package-monthly-downloads?packageName=${encodeURIComponent(
    packageName
  )}`;
  return fetchJSON(url);
};

export function useFetchMonthlyRankings(date) {
  const fetcher = () => fetchMonthlyRankings(date);
  const key = date ? formatDate(date) : "latest";
  return useSWR(["/monthly-rankings", key], fetcher);
}

type MonthlyDate = {
  year: number;
  month: number;
};

function fetchMonthlyRankings(date?: MonthlyDate) {
  const url = `${FETCH_RANKINGS_URL}/monthly/${
    date ? formatDate(date) : "latest"
  }`;
  return fetchJSON(url);
}

function formatDate(date: MonthlyDate) {
  const year = date.year.toString();
  const month = date.month.toString().padStart(2, "0");
  return year + "/" + year + "-" + month + ".json";
}
