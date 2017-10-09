import { parse } from 'qs'

const toInteger = (input, defaultValue = 1) =>
  isNaN(input) ? defaultValue : parseInt(input, 0)

export const getPageNumber = location => {
  if (!location.search) return
  const query = parse(location.search.substr(1))
  return query.page && toInteger(query.page)
}
