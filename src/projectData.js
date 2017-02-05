import * as helpers from './helpers/projectHelpers'
import slugify from './helpers/slugify'
import randomColor from 'randomcolor'

// Called by `entry.jsx` to get initial state from project data

const ACCESS_TOKEN = 'bestofjs_access_token'

const defaultState = {
  entities: {
    projects: {},
    tags: {}
  },
  githubProjects: {
    lastUpdate: new Date(),
    total: [],
    daily: [],
    weekly: []
  },
  auth: {
    username: '',
    pending: false
  }
}
// Get a random color for projecs whose color is not specified
function getRandomColor () {
  return randomColor({
    luminosity: 'dark'
  })
}

// Round the average number of stars used in "trending this year" graphs
function roundAverage (number, decimals = 0) {
  const i = Math.pow(10, decimals)
  return Math.round(number * i) / i
}

function nthElement (arr, i) {
  if (arr.length === 0) return 0
  return arr[Math.min(i, arr.length - 1)]
}

function processProject (item) {
  // const days = [1, 7, 30, 90]
  // const trends = days.map(
  //   (t, i) => item.trends.length > i ? Math.round(item.trends[i] / t) : null
  // )
  const monthlyStars = item.monthly.slice(0)
  monthlyStars.reverse() // caution, reverse() mutates the array!
  if (item.name === 'Calypso') console.info(monthlyStars);

  const weeklyTotal = item.deltas.reduce((result, delta) => result + delta, 0)

  const addedAverage = (total, period) => {
    const delta = item.stars - total
    return roundAverage(delta / period)
  }

  // const oneYearDelta = item.monthly.length > 0 ? item.stars - item.monthly[0] : null
  // const oneYearTrend = oneYearDelta === null ? null : roundAverage(oneYearDelta / 365)
  const result = {
    full_name: item.full_name,
    repository: 'https://github.com/' + item.full_name,
    id: item._id,
    slug: slugify(item.name),
    tags: item.tags,
    deltas: item.deltas,
    description: item.description,
    name: item.name,
    pushed_at: item.pushed_at,
    stars: item.stars,
    url: item.url,
    npm: item.npm,
    version: item.version,
    quality: item.quality,
    score: item.score,
    owner_id: item.owner_id,
    stats: {
      total: item.stars,
      daily: item.deltas[0],
      weekly: roundAverage(weeklyTotal / 7),
      monthly: monthlyStars.length > 1 ? addedAverage(monthlyStars[1], 30) : null,
      quaterly: monthlyStars.length > 3 ? addedAverage(nthElement(monthlyStars, 3), 90) : null,
      yearly: item.monthly.length > 6 ? addedAverage(nthElement(monthlyStars, 6), 365) : null
    },
    monthly: item.monthly,
    svglogo: item.svglogo,
    branch: item.branch,
    color: item.color ? `#${item.color}` : getRandomColor()
  }
  if (result.slug === 'calypso') console.info(result);
  return result
}

export function getInitialState (data, profile) {
  const state = defaultState

  // Format id and repository fields
  const allProjects = data.projects.map(processProject)

  // Extra map added to lookup a project by database id
  const allById = {}

  // Create project entities
  allProjects.forEach(item => {
    state.entities.projects[item.slug] = item
    allById[item.id] = item.slug
  })

  // Create a hash map [tag code] => number of projects
  const counters = getTagCounters(data.projects)

  // Format tags array
  const allTags = data.tags
    .filter(tag => counters[tag.code])// remove unused tags
    .map(tag => ({
      id: tag.code,
      name: tag.name,
      counter: counters[tag.code] // add counter data
    }))

  // Create tags entities
  allTags.forEach(tag => {
    state.entities.tags[tag.id] = tag
  })

  const sortAllProjects = fn => (
    helpers.sortBy(allProjects.slice(0), fn)
  )
  const npmProjects = allProjects.filter(project => !!project.npm)
  const sortNpmProjects = fn => (
    helpers.sortBy(npmProjects.slice(0), fn)
  )

  const sortedProjects = [
    sortAllProjects(project => project.stars),
    sortAllProjects(project => project.stats.daily),
    sortAllProjects(project => project.stats.weekly),
    sortAllProjects(project => project.stats.monthly),
    sortAllProjects(project => project.stats.quaterly),
    sortNpmProjects(project => 0 || project.quality),
    sortNpmProjects(project => 0 || project.score),
    sortAllProjects(project => project.stats.yearly)
  ]
  const sortedProjectIds = sortedProjects.map(
    projects => projects.map(item => item.slug)
  )

  state.githubProjects = {
    total: sortedProjectIds[0],
    daily: sortedProjectIds[1],
    weekly: sortedProjectIds[2],
    monthly: sortedProjectIds[3],
    quaterly: sortedProjectIds[4],
    packagequality: sortedProjectIds[5], // packagequality.com
    npms: sortedProjectIds[6], // npms.io score
    yearly: sortedProjectIds[7],
    tagIds: allTags.map(item => item.id),
    lastUpdate: data.date,
    allById
  }

  if (profile) {
    const token = window.localStorage[ACCESS_TOKEN]
    state.auth = {
      username: profile.nickname,
      token,
      pending: false
    }
  }

  return state
}

// return a hash object
// key: tag code
// value: number of project for the tag
function getTagCounters (projects) {
  const counters = {}
  projects.forEach(function (project) {
    project.tags.forEach(function (id) {
      if (counters[id]) {
        counters[id]++
      } else {
        counters[id] = 1
      }
    })
  })
  return counters
}
