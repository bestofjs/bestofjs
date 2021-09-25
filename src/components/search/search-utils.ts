import { stringify } from 'qs'

import { parseQueryString } from 'helpers/url'

export function queryStringToState(queryString) {
  const parameters = parseQueryString(queryString)

  const selectedTags = parameters.tags ? makeArray(parameters.tags) : []

  return {
    selectedTags,
    query: parameters.query || '',
    sort: parameters.sort || '',
    page: parameters.page
  }
}

export function stateToQueryString({ query, selectedTags, sort, page }) {
  const queryString = stringify(
    {
      query: query || null,
      tags: selectedTags.length === 0 ? null : selectedTags,
      sort: sort === '' ? null : sort,
      page: page === 1 ? null : page
    },
    {
      encode: false,
      arrayFormat: 'repeat',
      skipNulls: true
    }
  )
  return queryString
}

export function updateLocation(location, changes) {
  const { search, pathname } = location
  const previousParams = queryStringToState(search)
  const params = { ...previousParams, ...changes }

  // Remove the `bookmark` sort option, only available on the "Bookmarks" page
  if (params.sort === 'bookmark' && pathname !== '/bookmarks') {
    delete params.sort
  }
  // Remove the `match` sort parameter, only available when there is a query
  if (!params.query && params.sort === 'match') {
    delete params.sort
  }

  const queryString = stateToQueryString(params)
  const nextLocation = { ...location, search: '?' + queryString }
  return nextLocation
}

const makeArray = (value) => (Array.isArray(value) ? value : [value])
