import { createSelector } from 'reselect'
import populate from '../helpers/populate'

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
      .slice() // required because `sort()` mutates the array
      .sort((a, b) => b.counter > a.counter ? 1 : -1)
      .slice(0, 10)
  }
)

export const getHotProjects = createSelector(
  [
    state => state.githubProjects['daily'],
    state => state.entities.projects,
    state => state.entities.tags
  ],
  (projectIdList, projectHash, tags) => {
    return projectIdList
      .map(id => projectHash[id])
      .slice(0, 10)
      .map(populate(tags))
  }
)
