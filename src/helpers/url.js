import { useLocation } from 'react-router-dom'
import { parse } from 'qs'

export function useParseURL(defaultValues) {
  const location = useLocation()
  const parameters = parseQueryString(location.search)

  return {
    ...defaultValues,
    ...parameters
  }
}

export function parseQueryString(queryString) {
  const parameters = parse(queryString, { ignoreQueryPrefix: true })

  return {
    ...parameters,
    page: toInteger(parameters.page)
  }
}

const toInteger = (input, defaultValue = 1) =>
  isNaN(input) ? defaultValue : parseInt(input, 0)
