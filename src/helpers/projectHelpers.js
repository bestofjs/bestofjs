export function sortBy (projects, get, direction = 'DESC') {
  return projects.sort(function (a, b) {
    let diff = get(a) - get(b)
    if (diff === 0) {
      diff = a.stars - b.stars
    }
    return diff * ((direction === 'DESC') ? -1 : 1)
  })
}

export const idToProject = state => id => {
  return state.entities.projects[id]
}
