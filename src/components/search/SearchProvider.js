import React, { createContext, useContext } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { queryStringToState, stateToQueryString } from './search-utils'
import { getSortOrderOptions } from './sort-order'

export const SearchContext = createContext({})

export const SearchProvider = ({ children }) => {
  const location = useLocation()
  const history = useHistory()

  const { query, selectedTags, page, sort } = queryStringToState(
    location.search
  )

  const onChange = changes => {
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

  return (
    <SearchContext.Provider
      value={{ selectedTags, query, sort, page, history, location, onChange }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export const useSearch = ({ defaultSortOptionId = 'total' } = {}) => {
  const { sort, ...values } = useContext(SearchContext)

  const sortOrderOptions = getSortOrderOptions()
  const sortOptionId = sort || (values.query ? 'match' : defaultSortOptionId)
  const sortOption =
    sortOrderOptions.find(item => item.id === sortOptionId) ||
    sortOrderOptions[0]

  return { ...values, sortOption }
}
