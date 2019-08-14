import { createSelector } from 'reselect'
import populate from '../helpers/populate'
import { npmProjects } from './index'

// Return a full `project` object, including `tags`, `links` and `reviews`
// to be used by `/projects/:id` pages
export const findProject = id =>
  createSelector(
    [
      state => state.entities.projects,
      state => state.entities.tags,
      state => state.entities.links,
      state => state.entities.reviews
    ],
    (projects, tags, allLinks, allReviews) => {
      const project = projects[id]
      // `project` can be not found if the entities have not been loaded yet,
      //  e.g. when `/projects/:id` URL is loaded directly in the browser.
      if (!project) return null
      return { ...populate(tags)(project) }
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
