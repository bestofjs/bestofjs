import { createSelector } from 'reselect'
import populate from '../helpers/populate'
import { npmProjects } from './index'

// Return a full `project` object, including `tags`
// to be used by `/projects/:id` pages
export const findProject = slug =>
  createSelector(
    [state => state.entities.projects, state => state.entities.tags],
    (projects, tags) => {
      const project = projects[slug]
      // `project` can be not found if the entities have not been loaded yet,
      //  e.g. when `/projects/:id` URL is loaded directly in the browser.
      if (!project) return null
      return {
        ...populate(tags)(project),
        repository: 'https://github.com/' + project.full_name,
        slug
      }
    }
  )

export const findProjectByNpmName = packageName =>
  createSelector(
    [npmProjects],
    projects => {
      const foundProject = projects.find(
        project => project.packageName === packageName
      )
      return foundProject
    }
  )

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
