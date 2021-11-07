import { stringify } from "qs";
import { useLocation } from "react-router-dom";

import { parseQueryString } from "helpers/url";

type NavigationState = {
  selectedTags: string[];
  query: string;
  sort: string;
  page: number;
};

export function queryStringToState(queryString: string): NavigationState {
  const parameters = parseQueryString(queryString);

  const selectedTags = parameters.tags ? makeArray(parameters.tags) : [];

  return {
    selectedTags,
    query: parameters.query || "",
    sort: parameters.sort || "",
    page: parameters.page,
  };
}

export function stateToQueryString({
  query,
  selectedTags,
  sort,
  page,
}: NavigationState) {
  const queryString = stringify(
    {
      query: query || null,
      tags: selectedTags.length === 0 ? null : selectedTags,
      sort: sort === "" ? null : sort,
      page: page === 1 ? null : page,
    },
    {
      encode: false,
      arrayFormat: "repeat",
      skipNulls: true,
    }
  );
  return queryString;
}

export function updateLocation(location, changes) {
  const { search, pathname } = location;
  const previousParams = queryStringToState(search);
  const params = { ...previousParams, ...changes };

  // Remove the `bookmark` sort option, only available on the "Bookmarks" page
  if (params.sort === "bookmark" && pathname !== "/bookmarks") {
    delete params.sort;
  }
  // Remove the `match` sort parameter, only available when there is a query
  if (!params.query && params.sort === "match") {
    delete params.sort;
  }

  const queryString = stateToQueryString(params);
  const nextLocation = { ...location, search: "?" + queryString };
  return nextLocation;
}

type StateUpdater = (state: NavigationState) => NavigationState;

export function useUpdateLocationState() {
  const location = useLocation();
  const { search } = location;
  const state = queryStringToState(search);
  return (updater: StateUpdater) => {
    const nextState = updater(state);
    const queryString = stateToQueryString(nextState);
    const nextLocation = { ...location, search: "?" + queryString };
    return nextLocation;
  };
}

const makeArray = (value) => (Array.isArray(value) ? value : [value]);
