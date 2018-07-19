import { createSelector } from 'reselect'
import populate from '../helpers/populate'
import * as helpers from '../helpers/projectHelpers'
import filterProjects from '../helpers/filter'

// return a hash object
// key: tag code
// value: number of project for the tag
export const getTagCounters = createSelector(
  [state => state.entities.projects],
  projects => {
    const processProjectTags = (acc, id) => ({
      ...acc,
      [id]: acc[id] ? acc[id] + 1 : 1
    })
    const processProjects = (acc, project) =>
      project.tags.reduce(processProjectTags, acc)
    return Object.values(projects).reduce(processProjects, {})
  }
)

// Return an array of all tags, including counter about the number of projects by tag
export const getAllTags = createSelector(
  [
    state => state.entities.projects,
    state => state.entities.tags,
    getTagCounters
  ],
  (projectIds, tagIds, countsByTag) =>
    Object.values(tagIds).map(tag => {
      const counter = countsByTag[tag.code]
      return { ...tag, counter }
    })
)

export const getPopularTags = createSelector([getAllTags], allTags => {
  return allTags
    .slice() // required because `sort()` mutates the array
    .sort((a, b) => (b.counter > a.counter ? 1 : -1))
    .slice(0, 10)
})

const allProjects = createSelector(
  [state => state.entities.projects],
  projectsById => Object.values(projectsById)
)

export const getAllProjectsCount = createSelector(
  [allProjects],
  projects => projects.length
)

export const npmProjects = createSelector([allProjects], projects =>
  projects.filter(project => !!project.npm)
)

const sortProjects = fn => projects => helpers.sortBy(projects.slice(0), fn)

const sortFn = {
  total: project => project.stars,
  daily: project => project.stats.daily,
  weekly: project => project.stats.weekly,
  monthly: project => project.stats.monthly,
  quaterly: project => project.stats.quaterly,
  quality: project => project.quality,
  score: project => project.score,
  yearly: project => project.stats.yearly
}

// a sub-selector used by both `getProjectsSortedBy` and `getProjectsByTag`
const getRawProjectsSortedBy = ({ criteria, start = 0, limit = 10 }) => {
  return createSelector([allProjects], projects => {
    const sliced = sortProjects(sortFn[criteria])(projects).slice(
      start,
      start + limit
    )
    return sliced
  })
}

// Create a selector for a given criteria (`total`, `daily`)
export const getProjectsSortedBy = ({ criteria, start, limit }) =>
  createSelector(
    [
      getRawProjectsSortedBy({ criteria, start, limit }),
      state => state.entities.tags,
      state => state.auth
    ],
    (projects, tags, auth) => projects.map(getFullProject(tags, auth))
  )

export const getHotProjects = count =>
  getProjectsSortedBy({
    criteria: 'daily',
    limit: count
  })

const getAllProjectsByTag = tagId =>
  createSelector([allProjects], projects =>
    projects.filter(project => project.tags.includes(tagId))
  )

// Selector used to display the list of projects belonging to a given tag
export const getProjectsByTag = ({ criteria, tagId, start, limit }) =>
  createSelector(
    [
      // getRawProjectsSortedBy({ criteria, start, limit }),
      getAllProjectsByTag(tagId),
      state => state.entities.tags,
      state => state.auth
    ],
    (projects, tags, auth) => {
      const filteredProjects = sortProjects(sortFn[criteria])(projects)
        .slice(start, start + limit)
        .map(getFullProject(tags, auth))
      return filteredProjects
    }
  )

export const searchForProjects = text =>
  createSelector(
    [
      allProjects,
      getAllTags,
      state => state.entities.tags,
      state => state.auth
    ],
    (projects, allTags, tagsById, auth) =>
      filterProjects(projects, allTags, text)
        .slice(0, 50)
        .map(getFullProject(tagsById, auth))
  )

export const getMyProjects = createSelector(
  [
    state => state.entities.projects,
    state => state.auth,
    state => state.entities.tags
  ],
  (projects, auth, tags) => {
    if (!auth.myProjects) return []
    const myProjectsSlugs = auth.myProjects
      .sort((a, b) => (a.bookmarked_at > b.bookmarked_at ? -1 : 1))
      .map(item => item.slug)
    const result = myProjectsSlugs
      .map(slug => projects[slug])
      .filter(project => !!project)
      .map(getFullProject(tags, auth))
    return result
  }
)

export const getFullProject = (tags, auth) => project => {
  const { myProjects, pendingProject } = auth
  const fullProject = populate(tags)(project)
  const pending = project.slug === pendingProject
  const belongsToMyProjects =
    myProjects && myProjects.map(item => item.slug).includes(project.slug)
  if (!myProjects) return fullProject
  return {
    ...fullProject,
    belongsToMyProjects,
    pending
  }
}

export const getProjectsByFullname = createSelector(
  [state => state.entities.projects],
  projects => {
    return Object.keys(projects)
      .map(key => ({
        slug: key,
        full_name: projects[key].full_name
      }))
      .reduce((acc, item) => ({ ...acc, [item.full_name]: item.slug }), {})
  }
)

export const getProjectSlugFromFullname = fullname =>
  createSelector(
    [getProjectsByFullname],
    projectsByFullname => projectsByFullname[fullname]
  )

// Return true if fresh data is available from the API,
// that is to say if the `lastUpdate` date is older than 24 hours
// since new data is supposed to be generate every day at 21:00 GMT.
export const isFreshDataAvailable = date =>
  createSelector([state => state.entities.meta.lastUpdate], lastUpdate => {
    const hours = (date - lastUpdate) / 1000 / 3600
    return hours > 24
  })
