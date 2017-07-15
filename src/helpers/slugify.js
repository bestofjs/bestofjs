const removeSpaces = (value, replaced = '') => replace(value, '\\s+', replaced)

const replace = function replace(value) {
  const search =
    arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1]
  const newvalue =
    arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2]
  const caseSensitive =
    arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3]
  const flags = caseSensitive ? 'g' : 'gi'
  return value.replace(new RegExp(search, flags), newvalue)
}

const slugify = value => {
  let result = value
  result = result.trim().toLowerCase()
  result = removeSpaces(result, '-')
  result = replace(result, '&', '-and-')
  result = replace(result, '[^\\w\\-]+', '')
  result = replace(result, '--+', '-')
  return result
}

export default slugify
