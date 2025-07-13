import { useHistory, useLocation } from "react-router-dom";
import { createContainer } from "unstated-next";

import { queryStringToState, stateToQueryString } from "./search-utils";
import { type SortOption, sortOrderOptions } from "./sort-order-options";

function useSearchState() {
  const location = useLocation();
  const history = useHistory();

  const { query, selectedTags, page, sort, direction } = queryStringToState(
    location.search,
  );

  const onChange = (changes) => {
    const queryString = stateToQueryString({
      query,
      selectedTags,
      page: 1,
      sort,
      ...changes,
    });

    history.push({
      pathname: queryString ? "/projects" : "/", // back to the homepage if there is nothing to search
      search: queryString ? "?" + queryString : "",
    });
  };

  return { selectedTags, query, sort, direction, page, location, onChange };
}

export const SearchContainer = createContainer(useSearchState);

export const useSearch = ({ defaultSortOptionId = "total" } = {}) => {
  const { sort, direction, ...values } = SearchContainer.useContainer();

  const sortOptionId = sort || (values.query ? "match" : defaultSortOptionId);
  const currentSortOption: SortOption =
    sortOrderOptions[sortOptionId] || sortOrderOptions[defaultSortOptionId];

  return {
    ...values,
    direction: direction || currentSortOption.direction,
    sortOptionId,
  };
};
