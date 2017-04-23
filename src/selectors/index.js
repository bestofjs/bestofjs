import { createSelector } from 'reselect'

export const getAllTags = createSelector(
  [
    state => state.githubProjects.tagIds,
    state => state.entities.tags
  ],
  (tagIds, tags) => tagIds.map(id => tags[id])
)

export const getPopularTags = createSelector(
  [getAllTags],
  (allTags) => {
    return allTags
      .sort((a, b) => b.counter > a.counter ? 1 : -1)
      .slice(0, 10)
  }
)
