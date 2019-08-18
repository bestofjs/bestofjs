import { createSelector } from 'reselect'

import { populateProject } from './project'
import search from './search'

// Number of projects under each tag:
//  {react: 200, vue: 60...}
export const getTagCounters = createSelector(
  [state => Object.values(state.entities.projects)],
  projects => {
    const tagCounters = {}

    projects.forEach(({ tags }) => {
      tags.forEach(tag => {
        tagCounters[tag] = tagCounters[tag] ? tagCounters[tag] + 1 : 1
      })
    })

    return tagCounters
  }
)

// All tags including counter data:
// [{id, description, name, counter}]
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

export const getPopularTags = createSelector(
  [getAllTags],
  allTags => {
    return allTags
      .slice() // required because `sort()` mutates the array
      .sort((a, b) => (b.counter > a.counter ? 1 : -1))
      .slice(0, 10)
  }
)

const allProjects = createSelector(
  [state => state.entities.projects],
  projectsById => Object.values(projectsById)
)

export const getAllProjectsCount = createSelector(
  [allProjects],
  projects => projects.length
)

export const npmProjects = createSelector(
  [allProjects],
  projects => projects.filter(project => !!project.packageName)
)

const sortProjects = fn => projects => sortBy(projects.slice(0), fn)

const sortFn = {
  total: project => project.stars,
  daily: project => project.trends.daily,
  weekly: project => project.trends.weekly,
  monthly: project => project.trends.monthly,
  quarterly: project => project.trends.quarterly,
  quality: project => project.quality,
  score: project => project.score,
  yearly: project => project.trends.yearly
}

// a sub-selector used by both `getProjectsSortedBy` and `getProjectsByTag`
const getRawProjectsSortedBy = ({ criteria, start = 0, limit = 10 }) => {
  return createSelector(
    [allProjects],
    projects => {
      const sliced = sortProjects(sortFn[criteria])(projects).slice(
        start,
        start + limit
      )
      return sliced
    }
  )
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
  createSelector(
    [allProjects],
    projects => projects.filter(project => project.tags.includes(tagId))
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
      search(projects, text)
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
  const fullProject = populateProject(tags)(project)
  const pending = project.slug === pendingProject
  const belongsToMyProjects =
    myProjects && myProjects.map(item => item.slug).includes(project.slug)
  return {
    ...fullProject,
    belongsToMyProjects,
    pending
  }
}

// Return true if fresh data is available from the API,
// that is to say if the `lastUpdate` date is older than 24 hours
// since new data is supposed to be generate every day at 21:00 GMT.
export const isFreshDataAvailable = date =>
  createSelector(
    [state => state.entities.meta.lastUpdate],
    lastUpdate => {
      const hours = (date - lastUpdate) / 1000 / 3600
      return hours > 24
    }
  )

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
