import { createSelector } from 'reselect'
import populate from '../helpers/populate'
import { linksByProject, reviewsByProject } from './userContent'

// Return a full `project` object, including `tags`, `links` and `reviews`
// to be used by `/projects/:id` pages
export const findProject = (id) => createSelector(
  [
    state => state.entities.projects,
    state => state.entities.tags,
    state => linksByProject(state),
    state => state.entities.links,
    state => reviewsByProject(state),
    state => state.entities.reviews
  ],
  (projects, tags, linksByProject, allLinks, reviewsByProject, allReviews) => {
    const project = projects[id]
    if (!project) throw new Error(`No project with the key '${id}'`)
    const linkIds = linksByProject[project.slug] || []
    const links = linkIds.map(linkId => allLinks[linkId])
    const reviewIds = reviewsByProject[project.slug] || []
    const reviews = reviewIds.map(reviewId => allReviews[reviewId])
    return { ...populate(tags)(project), links, reviews }
  }
)
