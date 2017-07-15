import { createSelector } from 'reselect'
import populate from '../helpers/populate'
import { linksByProject, reviewsByProject } from './userContent'

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
      if (!project) throw new Error(`No project with the key '${id}'`)
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
