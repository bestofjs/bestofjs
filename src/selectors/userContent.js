import { createSelector } from 'reselect'
import flatten from 'lodash.flatten'

export const linksByProject = createSelector(
  [state => state.entities.links],
  links => {
    const flatList = flatten(
      Object.values(links).map(link =>
        link.projects.map(project => ({ project, link: link._id }))
      )
    )
    return flatList.reduce((acc, item) => {
      return {
        ...acc,
        [item.project]: addUniqueLink(acc[item.project], item.link)
      }
    }, {})
  }
)

export const reviewsByProject = createSelector(
  [state => state.entities.reviews],
  reviews => {
    return Object.values(reviews)
      .map(review => ({ project: review.project, review: review._id }))
      .reduce((acc, item) => {
        return {
          ...acc,
          [item.project]: addUniqueLink(acc[item.project], item.review)
        }
      }, {})
  }
)

function addUniqueLink(ids, id) {
  if (!ids) return [id]
  return ids.includes(id) ? ids : [id, ...ids]
}
