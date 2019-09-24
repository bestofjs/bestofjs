import { parse, stringify } from 'qs'

export function queryStringToState(queryString) {
  const parameters = parse(queryString, { ignoreQueryPrefix: true })

  const selectedTags = parameters.tags || []
  const page = toInteger(parameters.page)

  return {
    selectedTags,
    query: parameters.query || '',
    sort: parameters.sort || 'total',
    page
  }
}

export function stateToQueryString({ query, selectedTags, sort, page }) {
  return stringify(
    { query, tags: selectedTags, sort, page },
    {
      encode: false,
      // indices: false,
      filter: (prefix, value) => (!value ? undefined : value)
    }
  )
}

const toInteger = (input, defaultValue = 1) =>
  isNaN(input) ? defaultValue : parseInt(input, 0)
