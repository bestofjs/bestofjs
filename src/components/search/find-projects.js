import { getFullProject } from '../../selectors'
import { sortProjectsByFunction } from '../../selectors/sort-utils'
import { paginateItemList } from '../common/pagination'

export function findProjects(
  projects,
  tagsById,
  auth,
  { tags, query, page = 1, selector, limit }
) {
  // console.info('Find', tags, query, page)
  const filterByTag = project =>
    tags.every(tagId => project.tags.includes(tagId))

  const filteredProjects = projects.filter(project => {
    if (tags.length > 0) {
      if (!filterByTag(project)) return false
    }
    return true
  })

  const foundProjects = query
    ? filterProjectsByQuery(filteredProjects, query)
    : filteredProjects

  const sortedProjects = sortProjectsByFunction(foundProjects, selector)

  const relevantTags =
    (tags.length > 0 || query) && getResultRelevantTags(sortedProjects, tags)

  const paginatedProjects = paginateItemList(sortedProjects, page, { limit })

  const results = paginatedProjects.map(getFullProject(tagsById, auth))

  return {
    results,
    relevantTags,
    total: foundProjects.length
  }
}

// Used to filter projects when the user enters text in the search box
// Search results are sorted by "relevance"
export function filterProjectsByQuery(projects, query) {
  return projects
    .map(project => ({ ...project, rank: rank(project, query) }))
    .filter(project => project.rank > 0)
}

// for a given project and a query,
// return how much "relevant" is the project in the search results
// `tags` is an array of tags that match the text
function rank(project, query) {
  const equals = new RegExp('^' + query + '$', 'i')
  const startsWith = new RegExp('^' + query, 'i')
  const contains = new RegExp(query.replace(/ /g, '.+'), 'i') // the query is split if it contains spaces

  if (equals.test(project.name)) {
    // top level relevance: project whose name or package name is what the user entered
    return 7
  }

  if (startsWith.test(project.name)) {
    return 6
  }

  if (project.packageName && startsWith.test(project.packageName)) {
    return 5
  }

  if (query.length > 1) {
    if (contains.test(project.name)) {
      return 4
    }
  }

  if (query.length > 2) {
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

function getResultRelevantTags(projects, excludedTags = []) {
  const projectCountByTag = getTagsFromProjects(projects, excludedTags)
  return orderBy(
    Array.from(projectCountByTag.entries()),
    ([tagId, count]) => count
  )
}

function orderBy(items, fn) {
  return items.sort((a, b) => fn(b) - fn(a))
}

function getTagsFromProjects(projects, excludedTagIds = []) {
  const result = new Map()
  projects.forEach(project => {
    project.tags
      .filter(tagId => !excludedTagIds.includes(tagId))
      .forEach(tagId => {
        if (result.has(tagId)) {
          result.set(tagId, result.get(tagId) + 1)
        } else {
          result.set(tagId, 1)
        }
      })
  })
  return result
}
