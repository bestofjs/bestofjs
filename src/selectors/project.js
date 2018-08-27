import { createSelector } from 'reselect'
import populate from '../helpers/populate'
import { linksByProject, reviewsByProject } from './userContent'
import { npmProjects } from './index'

// Return a full `project` object, including `tags`, `links` and `reviews`
// to be used by `/projects/:id` pages
export const findProject = id =>
  createSelector(
    [
      state => state.entities.projects,
      state => state.entities.tags,
      state => linksByProject(state),
      state => state.entities.links,
      state => reviewsByProject(state),
      state => state.entities.reviews
    ],
    (
      projects,
      tags,
      linksByProject,
      allLinks,
      reviewsByProject,
      allReviews
    ) => {
      const project = projects[id]
      // `project` can be not found if the entities have not been loaded yet,
      //  e.g. when `/projects/:id` URL is loaded directly in the browser.
      if (!project) return null
      const linkIds = linksByProject[project.slug] || []
      const links = linkIds.map(linkId => allLinks[linkId])
      const reviewIds = reviewsByProject[project.slug] || []
      const reviews = reviewIds.map(reviewId => allReviews[reviewId])
      const averageRating = calculateAverageRating(reviews)
      return { ...populate(tags)(project), links, reviews, averageRating }
    }
  )

function calculateAverageRating(reviews) {
  if (!reviews) return 0
  const sum = reviews
    .map(review => review.rating)
    .reduce((item0, item1) => item0 + item1, 0)
  return sum / reviews.length
}

export const findProjectByNpmName = packageName =>
  createSelector([npmProjects], projects => {
    const foundProject = projects.find(
      project => project.packageName === packageName
    )
    return foundProject
  })
