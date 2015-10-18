export const GET_ALL_PROJECTS_REQUEST = 'GET_ALL_PROJECTS_REQUEST';
export const GET_ALL_PROJECTS_SUCCESS = 'GET_ALL_PROJECTS_SUCCESS';
export const GET_ALL_PROJECTS_FAILURE = 'GET_ALL_PROJECTS_FAILURE';

export const GET_PROJECT_REQUEST = 'GET_PROJECT_REQUEST';
export const GET_PROJECT_SUCCESS = 'GET_PROJECT_SUCCESS';
export const GET_PROJECT_FAILURE = 'GET_PROJECT_FAILURE';

function requestProjects() {
  return {
    type: GET_ALL_PROJECTS_REQUEST
  };
}
function requestReadme() {
  return {
    type: GET_PROJECT_REQUEST
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
    type: GET_PROJECT_SUCCESS,
    data: json
  };
}

export function fetchProjects() {
  return dispatch => {
    console.log('Fetching projects...');
    dispatch(requestProjects());
    return window.fetch(`https://bestofjs-api-v1.divshot.io/projects.json`)
      .then(response => response.json())
      .then(json => dispatch(receiveProjects(json)));
  };
}

export function fetchReadme(project) {
  return dispatch => {
    console.log('Fetching README.md...', project);
    dispatch(requestReadme());
    const webtaskUrl = process.env.GET_README; //set up in webpack.*.config.js file
    return window.fetch(`${webtaskUrl}&url=${project.repository}`)
      .then(response => response.json())
      .then(json => dispatch(receiveReadme(json)));
  };
}
