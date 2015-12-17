import request from 'axios';

import api from '../../config/api';
import log from '../helpers/log';

// export const GET_ALL_PROJECTS_REQUEST = 'GET_ALL_PROJECTS_REQUEST';
// export const GET_ALL_PROJECTS_SUCCESS = 'GET_ALL_PROJECTS_SUCCESS';
// export const GET_ALL_PROJECTS_FAILURE = 'GET_ALL_PROJECTS_FAILURE';

export const GET_README_REQUEST = 'GET_README_REQUEST';
export const GET_README_SUCCESS = 'GET_README_SUCCESS';
export const GET_README_FAILURE = 'GET_README_FAILURE';

export const TOGGLE_MENU = 'TOGGLE_MENU';

function requestReadme(id) {
  return {
    type: GET_README_REQUEST,
    id
  };
}

function getReadmeSuccess(id, json) {
  return {
    type: GET_README_SUCCESS,
    id,
    data: json
  };
}
function getReadmeFailure(id, response) {
  console.log(response);
  return {
    type: GET_README_FAILURE,
    id,
    data: {readme: 'ERROR'}
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
    log('Fetching README.md...', project);
    dispatch(requestReadme(id));
    const webtaskUrl = api('GET_README');
    return request.get(`${webtaskUrl}&url=${project.repository}`)
      .then(json => dispatch(getReadmeSuccess(id, json.data)))
      .catch((response) => dispatch(getReadmeFailure(id, response)));
  };
}

function shouldFetchReadme(state, project) {
  const readme = state.entities.projects[project.id].readme;
  if (!readme) {
    return true;
  }
  // if (readme.isFetching) {
  //   return false;
  // }
  log('Readme already in the cache!');
  return false;
  //return posts.didInvalidate
}

export function fetchReadmeIfNeeded(project) {
  return (dispatch, getState) => {
    if (shouldFetchReadme(getState(), project)) {
      return dispatch(fetchReadme(project));
    }
  };
}
