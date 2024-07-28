import debugPackage from "debug";
import { GraphQLClient } from "graphql-request";
import scrapeIt from "scrape-it";

import { extractRepoInfo, queryRepoInfo } from "./repo-info-query";
import { extractUserInfo, queryUserInfo } from "./user-info-query";

const debug = debugPackage("github");

export function createClient(accessToken: string) {
  const graphQLClient = new GraphQLClient("https://api.github.com/graphql", {
    headers: {
      authorization: `bearer ${accessToken}`,
    },
  });

  const fetchRepoInfoMain = (fullName: string) => {
    const [owner, name] = fullName.split("/");
    debug("Fetch repo info from GitHub GraphQL", owner, name);
    return graphQLClient
      .request(queryRepoInfo, { owner, name })
      .then(extractRepoInfo)
      .catch((error) => {
        const message = error.response && error.response.message;
        if (message) throw new Error(`GraphQL API error "${message}"`);
        throw error;
      });
  };

  const fetchRepoInfoFallback = async (fullName: string) => {
    debug("Fetch repo info using the REST API", fullName);
    const repoInfo = await gitHubRequest(`repos/${fullName}`, accessToken);
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
        debug(`The repo "${fullName}" was mot found, try the fallback method!`);
        const { full_name: updatedFullName } = await fetchRepoInfoFallback(
          fullName
        );
        const repoInfo = await fetchRepoInfoMain(updatedFullName);
        return repoInfo;
      } else {
        throw error;
      }
    }
  };

  const isErrorNotFound = (error: unknown) => {
    const errorType = (error as any).response?.errors?.[0]?.type;
    return errorType === "NOT_FOUND";
  };

  // === Public API for the GitHub client ===

  return {
    fetchRepoInfo: fetchRepoInfoSafe,

    fetchRepoInfoFallback,

    async fetchContributorCount(fullName: string) {
      debug(`Fetching the number of contributors by scraping`, fullName);
      const url = `https://github.com/${fullName}`;
      const {
        data: { contributor_count },
      } = await scrapeIt<{ contributor_count: number }>(url, {
        contributor_count: {
          selector: `a[href="/${fullName}/graphs/contributors"] .Counter`,
          convert: toInteger,
        },
      });
      return contributor_count;
    },

    async fetchUserInfo(login: string) {
      debug("Fetch user info from GitHub GraphQL", login);
      return graphQLClient
        .request(queryUserInfo, { login })
        .then(extractUserInfo);
    },
  };
}

// Convert a String from the web page E.g. `1,300` into an Integer
const toInteger = (source: string) => {
  const onlyNumbers = source.replace(/[^\d]/, "");
  return !onlyNumbers || isNaN(Number(onlyNumbers))
    ? 0
    : parseInt(onlyNumbers, 10);
};

function gitHubRequest(endPoint: string, accessToken: string) {
  const url = `https://api.github.com/${endPoint}`;
  const options = {
    headers: {
      accept: "application/vnd.github.v3+json",
      authorization: `token ${accessToken}`,
    },
  };
  return fetch(url, options).then((res) => res.json());
}
