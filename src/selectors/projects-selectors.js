import { createSelector } from 'reselect'

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

export const getFeaturedProjects = criteria =>
  createSelector(
    [allProjects, state => state.entities.tags, state => state.auth],
    (projects, tags, auth) => {
      const featured = projects
        .filter(project => !!project.icon)
        .map(getFullProject(tags, auth))
      const projectSelector = getProjectSelectorByKey(criteria)
      return sortProjects(projectSelector)(featured)
    }
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

export const getTotalNumberOfStars = project => project.stars

export const getStarsAddedDaily = ({ trends }) => trends.daily

export const getStarsAddedWeekly = ({ trends }) => trends.weekly

export const getStarsAddedMonthly = ({ trends }) => trends.monthly

export const getStarsAddedYearly = ({ trends }) => trends.yearly

export const getLastCommitDate = project => new Date(project.pushed_at)

export const getContributorCount = project => project.contributor_count

export const getBookmarkDate = project => new Date(project.bookmarked_at)

export const getProjectSelectorByKey = key => {
  const sortFn = {
    total: getTotalNumberOfStars,
    daily: getStarsAddedDaily,
    weekly: getStarsAddedWeekly,
    monthly: getStarsAddedMonthly,
    yearly: getStarsAddedYearly,
    bookmark: getBookmarkDate,
    'last-commit': getLastCommitDate,
    contributors: getContributorCount,
    match: ({ rank }) => rank, // only used when a `query` is used to search, a ranking score is assigned to projects
    'monthly-downloads': ({ downloads }) => downloads,
    newest: project => project.addedPosition
  }

  if (!sortFn[key]) throw new Error(`No selector for the key "${key}"`)
  return sortFn[key]
}

// Return a full `project` object, including `tags`
// to be used by `/projects/:id` pages
export const findProjectById = slug =>
  createSelector(
    [state => state.entities.projects, state => state.entities.tags],
    (projects, tags) => {
      const project = projects[slug]
      // `project` can be not found if the entities have not been loaded yet,
      //  e.g. when `/projects/:id` URL is loaded directly in the browser.
      if (!project) return null
      return {
        ...populateProject(tags)(project),
        slug
      }
    }
  )

export const findProjectsByIds = ids =>
  createSelector(
    [state => state.entities.projects, state => state.entities.tags],
    (projects, tags) => {
      return ids.map(slug => {
        const project = projects[slug]
        return project
          ? {
              ...populateProject(tags)(project),
              slug
            }
          : null
      })
    }
  )

// Update `tags` populated objects to a `project` object that contains only an array of tag ids
export function populateProject(tags) {
  return function(project) {
    if (!project) throw new Error('populate() called with NO PROJECT!')
    const populated = {
      ...project,
      repository: 'https://github.com/' + project.full_name,
      tags: project.tags.map(id => tags[id]).filter(tag => !!tag)
    }
    return populated
  }
}

export const getDeltaByDay = period => ({ trends }) => {
  const periods = {
    daily: 1,
    weekly: 7,
    monthly: 30,
    quarterly: 90,
    yearly: 365
  }

  const delta = trends[period]
  const numberOfDays = periods[period]
  return average(delta, numberOfDays)
}

function average(delta, numberOfDays) {
  if (delta === undefined) return undefined // handle recently added projects, without `yearly`, `monthly` data available
  return round(delta / numberOfDays)
}

function round(number, decimals = 1) {
  const i = Math.pow(10, decimals)
  return Math.round(number * i) / i
}
