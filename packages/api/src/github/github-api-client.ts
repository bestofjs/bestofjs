import debugPackage from "debug";
import { GraphQLClient } from "graphql-request";

import { processReadMeHtml } from "./process-readme-html";
import { extractRepoInfo, queryRepoInfo } from "./repo-info-query";
import { extractUserInfo, queryUserInfo } from "./user-info-query";

const debug = debugPackage("github");

export function createGitHubClient() {
  const accessToken = process.env.GITHUB_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("GITHUB_ACCESS_TOKEN is required!");
  }
  const graphQLClient = new GraphQLClient("https://api.github.com/graphql", {
    headers: {
      authorization: `bearer ${accessToken}`,
    },
  });

  async function makeRestApiRequest(
    endPoint: string,
    accept = "application/vnd.github.v3+json",
  ) {
    const url = `https://api.github.com/${endPoint}`;
    const options = {
      headers: {
        accept,
        authorization: `token ${accessToken}`,
      },
    };
    const response = await fetch(url, options);
    debug("Remaining API calls", response.headers.get("x-ratelimit-remaining")); // auth credentials are needed to avoid the default limit (60)
    return response;
  }

  function makeRestApiRequestJSON(endPoint: string) {
    return makeRestApiRequest(endPoint).then((response) => response.json());
  }

  const fetchRepoInfoMain = (fullName: string) => {
    const [owner, name] = fullName.split("/");
    debug("Fetch repo info from GitHub GraphQL", owner, name);
    return graphQLClient
      .request(queryRepoInfo, { owner, name })
      .then(extractRepoInfo)
      .catch((error) => {
        const message = error.response?.message;
        if (message) throw new Error(`GraphQL API error "${message}"`);
        throw error;
      });
  };

  const fetchRepoInfoFallback = async (fullName: string) => {
    debug("Fetch repo info using the REST API", fullName);
    const repoInfo = await makeRestApiRequestJSON(`repos/${fullName}`);
    debug(repoInfo);
    if (repoInfo.status === 404) throw new Error(`Repo not found!`);

    // TODO validate API response
    const { name, full_name, description, stargazers_count, owner } = repoInfo;
    return {
      name,
      full_name,
      description,
      stargazers_count,
      owner_id: owner.id,
    };
  };

  const fetchRepoInfoSafe = async (fullName: string) => {
    try {
      const repoInfo = await fetchRepoInfoMain(fullName);
      return repoInfo;
    } catch (error) {
      if (isErrorNotFound(error as Error)) {
        debug(`The repo "${fullName}" was not found, try the fallback method!`);
        const { full_name: updatedFullName } =
          await fetchRepoInfoFallback(fullName);
        const repoInfo = await fetchRepoInfoMain(updatedFullName);
        return repoInfo;
      } else {
        throw error;
      }
    }
  };

  const isErrorNotFound = (error: unknown) => {
    // biome-ignore lint/suspicious/noExplicitAny: TODO type correctly
    const errorType = (error as any).response?.errors?.[0]?.type;
    return errorType === "NOT_FOUND";
  };

  // === Public API for the GitHub client ===

  return {
    fetchRepoInfo: fetchRepoInfoSafe,

    fetchRepoInfoFallback,

    async fetchContributorCount(fullName: string) {
      debug(`Fetching contributor count from REST API`, fullName);
      const query = new URLSearchParams({ per_page: "1", anon: "true" });
      const response = await makeRestApiRequest(
        `repos/${fullName}/contributors?${query}`,
      );
      if (!response.ok) {
        const body = await response.text();
        throw new Error(
          `GitHub contributors request failed (${response.status}): ${body}`,
        );
      }
      const data: unknown = await response.json();
      const contributors = Array.isArray(data) ? data : [];
      const lastPage = parseLastPageFromLinkHeader(
        response.headers.get("link"),
      );
      return lastPage ?? contributors.length;
    },

    async fetchUserInfo(login: string) {
      debug("Fetch user info from GitHub GraphQL", login);
      return graphQLClient
        .request(queryUserInfo, { login })
        .then(extractUserInfo);
    },

    async fetchRepoReadMeAsHtml(
      fullName: string,
      { path, branch = "main" }: { path?: string | null; branch?: string } = {},
    ) {
      const baseEndpoint = `repos/${fullName}/readme`;
      const apiEndpoint = path ? `${baseEndpoint}/${path}` : baseEndpoint;
      const html = await makeRestApiRequest(
        apiEndpoint,
        "application/vnd.github.VERSION.html",
      ).then((response) => response.text());
      const readme = processReadMeHtml(html, fullName, branch);
      return readme;
    },
  };
}

/** GitHub pagination: `Link` header entry with `rel="last"` includes `page=N`. */
function parseLastPageFromLinkHeader(link: string | null): number | undefined {
  if (!link) return undefined;
  for (const part of link.split(",")) {
    const trimmed = part.trim();
    if (!trimmed.includes('rel="last"')) continue;
    const urlMatch = trimmed.match(/^<([^>]+)>/);
    if (!urlMatch) continue;
    const page = new URL(urlMatch[1]).searchParams.get("page");
    if (page) {
      const n = parseInt(page, 10);
      if (!Number.isNaN(n)) return n;
    }
  }
  return undefined;
}
