import { useLocation } from 'react-router-dom'
import { parse } from 'qs'

export function useParseURL(defaultValues) {
  const location = useLocation()
  const parameters = parse(location.search, { ignoreQueryPrefix: true })

  return {
    ...defaultValues,
    ...parameters,
    page: toInteger(parameters.page)
  }
}

const toInteger = (input, defaultValue = 1) =>
  isNaN(input) ? defaultValue : parseInt(input, 0)
