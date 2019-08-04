/*
Sort an array of projects, applying the given function to all projects.
If the function returns `undefined` (meaning that no data is available),
the project should be displayed at the end, when the descending direction is used (by default).
CAUTION: it mutates the array
*/
export function sortBy(projects, fn, direction = 'DESC') {
  const getValue = project => {
    const value = fn(project)
    return value === undefined ? -10000 : value
  }

  return projects.sort(function(a, b) {
    let diff = getValue(a) - getValue(b)
    if (diff === 0) {
      diff = a.stars - b.stars
    }
    return diff * (direction === 'DESC' ? -1 : 1)
  })
}

export const idToProject = state => id => {
  return state.entities.projects[id]
}
