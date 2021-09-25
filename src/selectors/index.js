import { createSelector } from 'reselect'

export * from './projects-selectors'
export * from './tags-selectors'
export * from './sort-utils'

// Return true if fresh data is available from the API,
// that is to say if the `lastUpdate` date is older than 24 hours
// since new data is supposed to be generate every day at 21:00 GMT.
export const isFreshDataAvailable = (date) =>
  createSelector([(state) => state.entities.meta.lastUpdate], (lastUpdate) => {
    const hours = (date - lastUpdate) / 1000 / 3600
    return hours > 24
  })
