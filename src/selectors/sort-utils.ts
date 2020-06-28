export function sortByNumber(items, property, direction = 'ASC') {
  const sortedItems = items
    .slice(0) // use `slice(0)` to avoid mutating the array
    .sort((a, b) => {
      let diff = a[property] - b[property]
      return diff * (direction === 'DESC' ? -1 : 1)
    })
  return sortedItems
}

export function sortByString(items, property, direction = 'ASC') {
  const sortedItems = items
    .slice(0) // use `slice(0)` to avoid mutating the array
    .sort((a, b) => {
      let diff = a[property].localeCompare(b[property])
      return diff * (direction === 'DESC' ? -1 : 1)
    })
  return sortedItems
}

/*
Sort an array of projects, applying the given function to all projects.
If the function returns `undefined` (meaning that no data is available),
the project should be displayed at the end, when the descending direction is used (by default).
*/
export function sortProjectsByFunction(projects, fn, direction = 'DESC') {
  // console.time('Sort')
  const getValue = project => {
    const value = fn(project)
    return value === undefined ? -Infinity : value
  }

  const sortedProjects = projects
    .slice(0) // use `slice(0)` to avoid mutating the array
    .sort(function(a, b) {
      let diff = getValue(a) - getValue(b)
      if (diff === 0) {
        diff = a.stars - b.stars
      }
      return diff * (direction === 'DESC' ? -1 : 1)
    })
  // console.timeEnd('Sort')
  return sortedProjects
}
