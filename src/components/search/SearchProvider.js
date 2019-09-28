import React, { createContext, useContext } from 'react'
import useReactRouter from 'use-react-router'
import { queryStringToState, stateToQueryString } from './search-utils'
import { getSortOrderOptions } from './sort-order'

export const SearchContext = createContext({})

export const SearchProvider = ({ children }) => {
  const { history, location } = useReactRouter()

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
      pathname: '/projects',
      search: queryString ? '?' + queryString : '' // show "All Projects" if there is no query string
    })
  }

  return (
    <SearchContext.Provider
      value={{ selectedTags, query, sort, page, history, onChange }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export const useSearch = ({ defaultSortOptionId = 'total' } = {}) => {
  const { sort, ...values } = useContext(SearchContext)

  const sortOrderOptions = getSortOrderOptions({ showBookmark: true })
  const sortOptionId = sort || defaultSortOptionId
  const sortOption =
    sortOrderOptions.find(item => item.id === sortOptionId) ||
    sortOrderOptions[0]

  return { ...values, sortOption }
}
