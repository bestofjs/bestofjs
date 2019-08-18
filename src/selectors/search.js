// Used to filter projects when the user enters text in the search box
// Search results are sorted by "relevance"
export default function filterProjects(projects, text) {
  return projects
    .map(project => ({ ...project, rank: rank(project, text) }))
    .filter(project => project.rank > 0)
    .sort((a, b) => {
      if (a.rank === b.rank) {
        return a.stars > b.stars ? -1 : 1
      }
      return a.rank > b.rank ? -1 : 1
    })
}

// for a given project and a given search text,
// return how much "relevant" is the project in the search results
// `tags` is an array of tags that match the text
function rank(project, text) {
  const startsWith = new RegExp('^' + text, 'i')
  const contains = new RegExp(text, 'i')

  if (startsWith.test(project.name)) {
    // top level relevance: project whose name or npm package name start by the text
    return 6
  }

  if (project.packageName && startsWith.test(project.packageName)) {
    return 5
  }

  if (text.length > 1) {
    // next level: check if the project's name contains the text
    if (contains.test(project.name)) {
      return 4
    }
  }

  if (text.length > 2) {
    if (contains.test(project.description)) {
      return 3
    }
    if (contains.test(project.full_name)) {
      return 2
    }
    if (contains.test(project.url)) {
      return 1
    }
  }

  // by default: the project is not included in search results
  return 0
}
