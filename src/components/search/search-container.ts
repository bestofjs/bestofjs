import { useHistory, useLocation } from 'react-router-dom'

import { queryStringToState, stateToQueryString } from './search-utils'
import { sortOrderOptions } from './sort-order-options'
import { createContainer } from 'unstated-next'

function useSearchState() {
  const location = useLocation()
  const history = useHistory()

  const { query, selectedTags, page, sort } = queryStringToState(
    location.search
  )

  const onChange = (changes) => {
    const queryString = stateToQueryString({
      query,
      selectedTags,
      page: 1,
      sort,
      ...changes
    })

    history.push({
      pathname: queryString ? '/projects' : '/', // back to the homepage if there is nothing to search
      search: queryString ? '?' + queryString : ''
    })
  }

  return { selectedTags, query, sort, page, history, location, onChange }
}

export const SearchContainer = createContainer(useSearchState)

export const useSearch = ({ defaultSortOptionId = 'total' } = {}) => {
  const { sort, ...values } = SearchContainer.useContainer()

  const sortOptionId = sort || (values.query ? 'match' : defaultSortOptionId)
  const sortOption =
    sortOrderOptions.find((item) => item.id === sortOptionId) ||
    sortOrderOptions[0]

  return { ...values, sortOption }
}
