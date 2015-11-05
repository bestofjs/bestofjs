import request from 'axios';
import * as projects from './reducers/projects';
//import Promise from 'bluebird';

// Called by `entry.jsx` to fetch initial data (project and tag lists)
// from a static JSON file served by a CDN
export function getInitialData() {
  return request.get(process.env.API + 'projects.json')
    //.then(response => response.json())
    .then(json => new Promise( (resolve) => resolve(getInitialState(json.data)) ));
}

const defaultState = {
  loading: true,
  allProjects: [],
  allTags: [],
  tagsById: null,
  popularProjects: [],
  hotProjects: [],
  lastUpdate: new Date(),
  tagFilter: {
    code: '*'
  },
  textFilter: '',
  project: null
};

export function getInitialState(data) {
  const tagsById = {};
  const allProjects = data.projects.map( item => Object.assign({}, item, {
    repository: 'https://github.com/' + item.full_name,
    _id: item.full_name.substr(item.full_name.indexOf('/') + 1)
  }) );
  const counters = getTagCounters(allProjects);

  let allTags = data.tags
    .filter( tag => counters[tag.code] )//remove unused tags
    .map( tag => Object.assign({}, tag, {counter: counters[tag.code]}));//add counter data

  allTags.forEach( (tag) => tagsById[tag.code] = tag);

  const populatedProjects = projects.populateTagData(allProjects, tagsById);
  const popularProjects = projects.sortBy(populatedProjects, (project) => project.stars );

  const updatedProps = {
    allProjects: populatedProjects,
    allTags,
    tagsById,
    lastUpdate: data.date,
    popularProjects,
    hotProjects: projects.sortBy(populatedProjects.slice(0), (project) => project.deltas[0]),
    maxStars: (popularProjects.length > 0) ? popularProjects[0].stars : 0
  };

  const state =  Object.assign( {}, defaultState, updatedProps);
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
