import request from 'axios';

export const GET_ALL_PROJECTS_REQUEST = 'GET_ALL_PROJECTS_REQUEST';
export const GET_ALL_PROJECTS_SUCCESS = 'GET_ALL_PROJECTS_SUCCESS';
export const GET_ALL_PROJECTS_FAILURE = 'GET_ALL_PROJECTS_FAILURE';

export const GET_README_REQUEST = 'GET_README_REQUEST';
export const GET_README_SUCCESS = 'GET_README_SUCCESS';
export const GET_README_FAILURE = 'GET_README_FAILURE';

export const TOGGLE_MENU = 'TOGGLE_MENU';

function requestProjects() {
  return {
    type: GET_ALL_PROJECTS_REQUEST
  };
}
function requestReadme(id) {
  return {
    type: GET_README_REQUEST,
    id
  };
}

function receiveReadme(id, json) {
  return {
    type: GET_README_SUCCESS,
    id,
    data: json
  };
}

export function toggleMenu() {
  return {
    type: TOGGLE_MENU
  };
}


export function fetchReadme(project) {
  const id = project.id;
  return dispatch => {
    if (process.env.NODE_ENV === 'development') console.log('Fetching README.md...', project);
    dispatch(requestReadme(id));
    const webtaskUrl = process.env.GET_README; //set up in webpack.*.config.js file
    return request.get(`${webtaskUrl}&url=${project.repository}`)
      //.then(response => response.json())
      .then(json => dispatch(receiveReadme(id, json.data)));
  };
}
