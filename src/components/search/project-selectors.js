const TIME_RANGES = {
  daily: {
    days: 1
  },
  weekly: {
    days: 7
  },
  monthly: {
    days: 30
  },
  yearly: {
    days: 365
  }
}

export const getStarTotal = project => project.stars

export const getStarsAddedYesterday = ({ trends }) => trends.daily

export const getStarsAddedThisWeek = ({ trends }) => trends.weekly

export const getStarsAddedThisMonth = ({ trends }) => trends.monthly

export const getStarsAddedThisYear = ({ trends }) => trends.yearly

export const getLastCommitDate = project => new Date(project.pushed_at)

export const getRelativeGrowthRate = timeRangeKey => ({ stars, trends }) => {
  const timeRange = TIME_RANGES[timeRangeKey]
  if (!timeRange) throw new Error(`Invalid time range key "${timeRangeKey}"`)
  const delta = trends[timeRangeKey]
  return delta ? delta / (stars - delta) : undefined
}

const getYearSinceLastCommit = project =>
  (today - getLastCommitDate(project)) / 1000 / 3600 / 24 / 365

const today = new Date()

export const isInactiveProject = project => {
  return (
    Math.floor(getYearSinceLastCommit(project)) > 0 &&
    getStarsAddedThisYear(project) < 100
  )
}
