import request from 'axios';

import * as projects from './reducers/projects';
import getProjectId from './helpers/getProjectId';

// Called by `entry.jsx` to fetch initial data (project and tag lists)
// from a static JSON file served by a CDN
export function getInitialData() {
  return request.get(process.env.API + 'projects.json')
    //.then(response => response.json())
    .then(json => new Promise( (resolve) => resolve(getInitialState(json.data)) ));
}

const defaultState = {
  loading: true,
  entities: {
    projects: {},
    tags: {}
  },
  lastUpdate: new Date(),
  tagFilter: '*',
  textFilter: '',
  currentProjectId: null,
  popularProjectIds: [],
  hotProjectIds: []
};

export function getInitialState(data) {
  let state = defaultState;

  state.lastUpdate = data.date;

  // Format id and repository fields
  const allProjects = data.projects.map( item => Object.assign({}, item, {
    repository: 'https://github.com/' + item.full_name,
    id: getProjectId(item),
    tagIds: item.tags
  }) );

  // Create project entities
  allProjects.forEach( item => {
    state.entities.projects[item.id] = item;
  });

  // Create a hash map [tag code] => number of projects
  const counters = getTagCounters(data.projects);

  // Format tags array
  let allTags = data.tags
    .filter( tag => counters[tag.code] )//remove unused tags
    .map( tag => Object.assign({}, tag, {
      counter: counters[tag.code], //add counter data
      id: tag.code
    }));

  // Create tags entities
  allTags.forEach( tag => {
      state.entities.tags[tag.id] = tag;
  });

  let popularProjects = projects.sortBy(allProjects, (project) => project.stars );
  let hotProjects = projects.sortBy(allProjects.slice(0), (project) => project.deltas[0]);

  state.popularProjectIds = popularProjects.map( item => item.id );
  state.hotProjectIds = hotProjects.map( item => item.id );
  state.tagIds = allTags.map( item => item.id );

  return state;
}

//return a hash object
//key: tag code
//value: number of project for the tag
function getTagCounters(projects) {
  let counters = {};
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
