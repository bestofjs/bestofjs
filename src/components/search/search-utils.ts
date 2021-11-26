import { stringify } from "qs";
import { useHistory, useLocation } from "react-router";

import { parseQueryString } from "helpers/url";

type NavigationState = {
  selectedTags: string[];
  query: string;
  page: number;
  sort?: string;
  direction?: "desc" | "asc";
};

export function queryStringToState(queryString: string): NavigationState {
  const parameters = parseQueryString(queryString);

  const selectedTags = parameters.tags ? makeArray(parameters.tags) : [];

  return {
    selectedTags,
    query: parameters.query || "",
    sort: parameters.sort || "",
    page: parameters.page,
    direction: parseSortDirection(parameters.direction),
  };
}

function parseSortDirection(input: string) {
  return input === "asc" || input === "desc" ? input : undefined;
}

export function stateToQueryString({
  query,
  selectedTags,
  sort,
  direction,
  page,
}: NavigationState) {
  const queryString = stringify(
    {
      query: query || null,
      tags: selectedTags.length === 0 ? null : selectedTags,
      sort: sort === "" ? null : sort,
      page: page === 1 ? null : page,
      direction,
    },
    {
      encode: false,
      arrayFormat: "repeat",
      skipNulls: true,
    }
  );
  return queryString;
}

type StateChanges = Partial<NavigationState>;
type StateUpdater = (state: NavigationState) => NavigationState;

export function useNextLocation() {
  const location = useLocation();
  const history = useHistory();
  const state = queryStringToState(location.search);

  // Accepts either a function to generate the next location from the previous one,
  // or an object that describes the changes to apply
  const updateLocation = (changes: StateUpdater | StateChanges) => {
    const nextState =
      typeof changes === "function" ? changes(state) : { ...state, ...changes };
    cleanNavigationState(nextState, location.pathname);
    const queryString = stateToQueryString(nextState);
    const nextLocation = {
      ...location,
      search: "?" + queryString,
    };
    return nextLocation;
  };

  const navigate = (changes: StateUpdater | StateChanges) => {
    const nextLocation = updateLocation(changes);
    history.push(nextLocation);
  };

  return { navigate, updateLocation };
}

function cleanNavigationState(state: NavigationState, pathname: string) {
  // Remove the `bookmark` sort option, only available on the "Bookmarks" page
  if (state.sort === "bookmark" && pathname !== "/bookmarks") {
    delete state.sort;
  }
  // Remove the `match` sort parameter, only available when there is a query
  if (!state.query && state.sort === "match") {
    delete state.sort;
  }
}

const makeArray = (value) => (Array.isArray(value) ? value : [value]);
