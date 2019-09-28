import { parse, stringify } from 'qs'

export function queryStringToState(queryString) {
  const parameters = parse(queryString, { ignoreQueryPrefix: true })

  const selectedTags = parameters.tags ? makeArray(parameters.tags) : []
  const page = toInteger(parameters.page)

  return {
    selectedTags,
    query: parameters.query || '',
    sort: parameters.sort || '',
    page
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

const makeArray = value => (Array.isArray(value) ? value : [value])

const toInteger = (input, defaultValue = 1) =>
  isNaN(input) ? defaultValue : parseInt(input, 0)
