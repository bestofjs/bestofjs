import * as helpers from './helpers/projectHelpers';

// Called by `entry.jsx` to get initial state from project data

const ACCESS_TOKEN = 'bestofjs_access_token';

const defaultState = {
  entities: {
    projects: {},
    tags: {}
  },
  githubProjects: {
    lastUpdate: new Date(),
    total: [],
    daily: [],
    weekly: [],
  },
  auth: {
    username: '',
    pending: false
  }
};

function processProject(item) {
  const daily = item.deltas[0]
  const reducer = (a, b) => a + b
  const weekly = Math.round(item.deltas.slice(0, 7).reduce(reducer, 0) / 7)
  return {
    repository: 'https://github.com/' + item.full_name,
    id: item._id, // getProjectId(item),
    slug: item.full_name.substr(item.full_name.indexOf('/') + 1),
    tags: item.tags,
    deltas: item.deltas,
    description: item.description,
    name: item.name,
    pushed_at: item.pushed_at,
    stars: item.stars,
    url: item.url,
    stats: {
      total: item.stars,
      daily,
      weekly
    }
  }
}

export function getInitialState(data, profile) {
  const state = defaultState;

  // Format id and repository fields
  const allProjects = data.projects.map(processProject);

  // Extra map added to lookup a project by database id
  const allById = {}

  // Create project entities
  allProjects.forEach(item => {
    state.entities.projects[item.slug] = item
    allById[item.id] = item.slug
  })

  // Create a hash map [tag code] => number of projects
  const counters = getTagCounters(data.projects);

  // Format tags array
  const allTags = data.tags
    .filter(tag => counters[tag.code])// remove unused tags
    .map(tag => ({
      id: tag.code,
      name: tag.name,
      counter: counters[tag.code] // add counter data
    }));

  // Create tags entities
  allTags.forEach(tag => {
    state.entities.tags[tag.id] = tag;
  });

  const sortProjects = fn => (
    helpers.sortBy(allProjects.slice(0), fn)
  )
  const sortedProjects = [
    sortProjects(project => project.stars),
    sortProjects(project => project.stats.daily),
    sortProjects(project => project.stats.weekly)
  ]
  const sortedProjectIds = sortedProjects.map(
    projects => projects.map(item => item.slug)
  )

  state.githubProjects = {
    total: sortedProjectIds[0],
    daily: sortedProjectIds[1],
    weekly: sortedProjectIds[2],
    tagIds: allTags.map(item => item.id),
    lastUpdate: data.date,
    allById
  };

  if (profile) {
    const token = window.localStorage[ACCESS_TOKEN];
    state.auth = {
      username: profile.nickname,
      token,
      pending: false
    };
  }

  return state;
}

// return a hash object
// key: tag code
// value: number of project for the tag
function getTagCounters(projects) {
  const counters = {};
  projects.forEach(function (project) {
    project.tags.forEach(function (id) {
      if (counters[id]) {
        counters[id]++;
      } else {
        counters[id] = 1;
      }
    });
  });
  return counters;
}
