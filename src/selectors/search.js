import intersection from 'lodash.intersection'

// Used to filter projects when the user enters text in the search box
// Search results are sorted by "relevance"
export default function filterProjects(projects, tags, text) {
  // First find the tags that match the text
  const matchingTags =
    text.length > 2
      ? tags
          .filter(tag => new RegExp(text, 'i').test(tag.name))
          .map(tag => tag.id)
      : []

  return projects
    .map(p =>
      Object.assign({}, p, {
        rank: rank(p, matchingTags, text)
      })
    )
    .filter(p => p.rank > 0)
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
function rank(project, tags, text) {
  const re1 = new RegExp('^' + text, 'i')
  const re2 = new RegExp(text, 'i')

  if (
    re1.test(project.name) ||
    (project.packageName && re1.test(project.packageName))
  ) {
    // top level relevance: project whose name or npm package name start by the text
    return 5
  }
  if (text.length > 1) {
    // next level: check if the project names contains the text
    if (re2.test(project.name)) {
      return 4
    }
  }

  // check if the project has one of the "matching tags"
  const matchingTags = intersection(tags, project.tags)
  if (matchingTags.length > 0) {
    return 3
  }

  if (text.length > 2) {
    if (re2.test(project.description)) {
      return 2
    }
    if (re2.test(project.full_name)) {
      return 1
    }
    if (re2.test(project.url)) {
      return 1
    }
  }

  // by default: the project is not included in search results
  return 0
}
