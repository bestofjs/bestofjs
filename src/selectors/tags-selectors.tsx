import { createSelector } from 'reselect'

import { State } from 'containers/project-data-container'
import { sortByString, sortByNumber } from './sort-utils'

// Number of projects under each tag:
//  {react: 200, vue: 60...}
const getTagCounters = createSelector<
  State,
  BestOfJS.Project[],
  Record<string, number>
>([state => Object.values(state.entities.projects)], projects => {
  const tagCounters = {}

  projects.forEach(({ tags }) => {
    tags.forEach(tag => {
      tagCounters[tag] = tagCounters[tag] ? tagCounters[tag] + 1 : 1
    })
  })

  return tagCounters
})

export const getTagsById = ids =>
  createSelector<State, any, BestOfJS.Tag[]>(
    [state => state.entities.tags],
    allTags => ids.map(id => allTags[id])
  )

// All tags including counter data:
// [{id, description, name, counter}]
export const getAllTags = createSelector(
  [
    state => state.entities.projects,
    state => state.entities.tags,
    getTagCounters
  ],
  (projectIds, tagIds, countsByTag) =>
    Object.values(tagIds).map(tag => {
      const counter = countsByTag[tag.code]
      return { ...tag, counter }
    })
)

const sortFunctions = {
  'project-count': tags => sortByNumber(tags, 'counter', 'DESC'),
  alpha: tags => sortByString(tags, 'name', 'ASC')
}

export const getAllTagsSortedBy = (criteria: string, count?: number) =>
  createSelector([getAllTags], tags => {
    const fn = sortFunctions[criteria]
    if (!fn) throw new Error(`Invalid criteria to sort tags "${criteria}"`)
    const sortedTags = fn(tags)
    return count ? sortedTags.slice(0, count) : sortedTags
  })

export const getPopularTags = count =>
  getAllTagsSortedBy('project-count', count)
