import request from 'axios';

import api from '../config/api';
import * as helpers from './helpers/projectHelpers';
import getProjectId from './helpers/getProjectId';

// Called by `entry.jsx` to fetch initial data (project and tag lists)
// from a static JSON file served by a CDN
export function getInitialData() {
  const url = api('GET_PROJECTS') + 'projects.json';
  return request.get(url)
    .then(json => new Promise(resolve => resolve(getInitialState(json.data))));
}

const defaultState = {
  entities: {
    projects: {},
    tags: {}
  },
  githubProjects: {
    lastUpdate: new Date(),
    popularProjectIds: [],
    hotProjectIds: []
  }
};

export function getInitialState(data) {
  const state = defaultState;

  // Format id and repository fields
  const allProjects = data.projects.map(item => ({
    repository: 'https://github.com/' + item.full_name,
    id: getProjectId(item),
    tags: item.tags,
    deltas: item.deltas,
    description: item.description,
    name: item.name,
    pushed_at: item.pushed_at,
    stars: item.stars,
    url: item.url
  }));

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
  const hotProjects = helpers.sortBy(allProjects.slice(0), (project) => project.deltas[0]);

  state.githubProjects = {
    popularProjectIds: popularProjects.map(item => item.id),
    hotProjectIds: hotProjects.map(item => item.id),
    tagIds: allTags.map(item => item.id),
    lastUpdate: data.date
  };

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
