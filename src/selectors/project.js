import { createSelector } from 'reselect'

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
