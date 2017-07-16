import { createSelector } from 'reselect'
import populate from '../helpers/populate'
import * as helpers from '../helpers/projectHelpers'
import filterProjects from '../helpers/filter'

// return a hash object
// key: tag code
// value: number of project for the tag
const getTagCounters = createSelector(
  [state => state.entities.projects],
  projects => {
    const counters = {}
    Object.values(projects).forEach(function(project) {
      project.tags.forEach(function(id) {
        if (counters[id]) {
          counters[id]++
        } else {
          counters[id] = 1
        }
      })
    })
    return counters
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

// const npmProjects = createSelector(
//   [allProjects],
//   (projects) => projects.filter(project => !!project.npm)
// )

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
const getRawProjectsSortedBy = ({ criteria }) =>
  createSelector([allProjects], projects => {
    return sortProjects(sortFn[criteria])(projects)
  })

// Create a selector for a given criteria (`total`, `daily`)
export const getProjectsSortedBy = ({ criteria, limit }) =>
  createSelector(
    [
      getRawProjectsSortedBy({ criteria, limit }),
      state => state.entities.tags,
      state => state.auth
    ],
    (projects, tags, auth) =>
      projects.map(getFullProject(tags, auth)).slice(0, limit)
  )

// TOP 10 projects displayed in the homepage
export const getHotProjects = getProjectsSortedBy({
  criteria: 'daily',
  limit: 10
})

// Selector used to display the list of projects belonging to a given tag
export const getProjectsByTag = ({ criteria, tagId, limit }) =>
  createSelector(
    [
      getRawProjectsSortedBy({ criteria, limit }),
      state => state.entities.tags,
      state => state.auth
    ],
    (projects, tags, auth) => {
      const filteredProjects = projects
        .filter(project => project.tags.includes(tagId))
        .map(getFullProject(tags, auth))
      return filteredProjects
    }
  )

export const searchForProjects = text =>
  createSelector(
    [
      getRawProjectsSortedBy({ criteria: 'total' }),
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
    // getRawProjectsSortedBy({ criteria: 'total' }),
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
