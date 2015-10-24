import request from 'axios';

export const GET_ALL_PROJECTS_REQUEST = 'GET_ALL_PROJECTS_REQUEST';
export const GET_ALL_PROJECTS_SUCCESS = 'GET_ALL_PROJECTS_SUCCESS';
export const GET_ALL_PROJECTS_FAILURE = 'GET_ALL_PROJECTS_FAILURE';

export const GET_README_REQUEST = 'GET_README_REQUEST';
export const GET_README_SUCCESS = 'GET_README_SUCCESS';
export const GET_README_FAILURE = 'GET_README_FAILURE';

function requestProjects() {
  return {
    type: GET_ALL_PROJECTS_REQUEST
  };
}
function requestReadme() {
  return {
    type: GET_README_REQUEST
  };
}

function receiveProjects(json) {
  return {
    type: GET_ALL_PROJECTS_SUCCESS,
    data: json
  };
}
function receiveReadme(json) {
  return {
    type: GET_README_SUCCESS,
    data: json
  };
}

export function fetchProjectsOLD() {
  return dispatch => {
    console.log('Fetching projects...');
    dispatch(requestProjects());
    return request.get(`https://bestofjs-api-v1.divshot.io/projects.json`)
      .then(response => response.json())
      .then(json => dispatch(receiveProjects(json)));
  };
}

export function fetchReadme(project) {
  return dispatch => {
    console.log('Fetching README.md...', project);
    dispatch(requestReadme());
    const webtaskUrl = process.env.GET_README; //set up in webpack.*.config.js file
    return request.get(`${webtaskUrl}&url=${project.repository}`)
      //.then(response => response.json())
      .then(json => dispatch(receiveReadme(json.data)));
  };
}
