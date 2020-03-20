import { createSelector } from 'reselect'

import { populateProject, getProjectSelectorByKey } from './project'
import { sortProjectsByFunction } from './sort-utils'

export const allProjects = createSelector(
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

const sortProjects = fn => projects => sortProjectsByFunction(projects, fn)

// a sub-selector used by both `getProjectsSortedBy` and `getProjectsByTag`
const getRawProjectsSortedBy = ({
  filterFn,
  criteria,
  start = 0,
  limit = 10
}) => {
  return createSelector(
    [allProjects],
    projects => {
      const filteredProjects = filterFn ? projects.filter(filterFn) : projects
      const projectSelector = getProjectSelectorByKey(criteria)
      const sliced = sortProjects(projectSelector)(filteredProjects).slice(
        start,
        start + limit
      )
      return sliced
    }
  )
}

// Create a selector for a given criteria (`total`, `daily`)
export const getProjectsSortedBy = ({ filterFn, criteria, start, limit }) =>
  createSelector(
    [
      getRawProjectsSortedBy({ filterFn, criteria, start, limit }),
      state => state.entities.tags,
      state => state.auth
    ],
    (projects, tags, auth) => projects.map(getFullProject(tags, auth))
  )

const hotProjectsExcludedTags = ['meta', 'learning']
const isIncluded = project => {
  const hasExcludedTag = hotProjectsExcludedTags.some(tag =>
    project.tags.includes(tag)
  )
  return !hasExcludedTag
}

export const getHotProjects = count =>
  getProjectsSortedBy({
    filterFn: isIncluded,
    criteria: 'daily',
    limit: count
  })

export const getNewestProjects = count =>
  getProjectsSortedBy({
    criteria: 'newest',
    limit: count
  })

export const getAllProjectsByTag = tagId =>
  createSelector(
    [allProjects],
    projects => projects.filter(project => project.tags.includes(tagId))
  )

// Selector used to display the list of projects belonging to a given tag
export const getProjectsByTag = ({ criteria, tagId }) =>
  createSelector(
    [getAllProjectsByTag(tagId), state => state.entities.tags],
    (projects, tags) => {
      const projectSelector = getProjectSelectorByKey(criteria)
      return sortProjects(projectSelector)(projects)
    }
  )

export const getBookmarksSortedBy = criteria =>
  createSelector(
    [
      state => {
        return state.entities.projects
      },
      state => state.auth,
      state => state.entities.tags
    ],
    (projects, auth, tags) => {
      if (!auth.myProjects) return []
      const myProjectsSlugs = auth.myProjects.map(item => item.slug)
      const result = myProjectsSlugs
        .map(slug => projects[slug])
        .filter(project => !!project)
        .map(getFullProject(tags, auth))
      const projectSelector = getProjectSelectorByKey(criteria)
      return sortProjects(projectSelector)(result)
    }
  )

export const getBookmarkCount = createSelector(
  state => state.auth.myProjects,
  ids => {
    return ids.length
  }
)

export const getFeaturedProjects = createSelector(
  [allProjects, state => state.entities.tags, state => state.auth],
  (projects, tags, auth) =>
    projects.filter(project => !!project.icon).map(getFullProject(tags, auth))
)

export const getFullProject = (tags, auth) => project => {
  const { myProjects = [], pendingProject } = auth
  const fullProject = populateProject(tags)(project)
  const pending = project.slug === pendingProject
  const bookmark = myProjects.find(({ slug }) => slug === project.slug)
  const isBookmark = !!bookmark

  return {
    ...fullProject,
    ...(bookmark
      ? { isBookmark, bookmarked_at: bookmark.bookmarked_at }
      : undefined),
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

export const isUserLoggedIn = createSelector(
  state => state.auth.username,
  username => !!username
)
