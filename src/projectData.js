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
    popularProjectIds: [],
    hotProjects: {
      daily: [],
      weekly: []
    }
  },
  auth: {
    username: '',
    pending: true
  }
};

function processProject(item) {
  const dailyVariation = item.deltas[0]
  const reducer = (a, b) => a + b
  const weeklyVariation = parseInt(item.deltas.slice(0, 7).reduce(reducer, 0) / 7, 10)
  return {
    repository: 'https://github.com/' + item.full_name,
    id: item._id, // getProjectId(item),
    tags: item.tags,
    deltas: item.deltas,
    description: item.description,
    name: item.name,
    pushed_at: item.pushed_at,
    stars: item.stars,
    url: item.url,
    stats: [dailyVariation, weeklyVariation]
  }
}

export function getInitialState(data, profile) {
  const state = defaultState;

  // Format id and repository fields
  const allProjects = data.projects.map(processProject);

  // Create project entities
  allProjects.forEach(item => {
    state.entities.projects[item.id] = item;
  });

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

  const popularProjects = helpers.sortBy(allProjects, (project) => project.stars);
  const hotProjects = {
    daily: helpers.sortBy(allProjects.slice(0), project => project.stats[0]),
    weekly: helpers.sortBy(allProjects.slice(0), project => project.stats[1])
  }

  state.githubProjects = {
    popularProjectIds: popularProjects.map(item => item.id),
    hotProjects: {
      daily: hotProjects.daily.map(item => item.id),
      weekly: hotProjects.weekly.map(item => item.id),
    },
    tagIds: allTags.map(item => item.id),
    lastUpdate: data.date
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
