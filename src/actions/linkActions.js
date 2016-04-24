import { push } from 'react-router-redux';
import { hashHistory } from 'react-router';
const notie = typeof window === 'undefined' ? {} : require('notie');

import createApi from '../api/userContent';
import * as crud from './crudActions';

const api = createApi('links');

// Go to project list after successful update or creation
function goToList(project) {
  const path = `/projects/${project.id}/links/`;
  return hashHistory.push(path);
}

// ==========
// FETCH ALL
// ==========

export function fetchAllLinks() {
  return dispatch => {
    api.getAll()
      .then(json => dispatch(crud.fetchAllItemsSuccess('link', json)))
      .catch(err => {
        console.error('Error when calling Review API', err);
      });
  };
}

// ==========
// CREATE
// ==========

export function createLink(project, formData, auth) {
  const payload = Object.assign({}, formData, {
    createdBy: auth.username || 'Anonymous'
  });
  return dispatch => {
    // dispatch(createReviewRequest(payload));
    return api.create(payload, auth.token)
      .then(json => {
        const data = Object.assign({}, json);
        dispatch(crud.createItemSuccess('link', data));
        goToList(project);
        notie.alert(1, 'Thank you for the link!', 3);
      })
      .catch(err => {
        notie.alert(3, `Sorry, we were unable to create the link. ${err.message}`, 3);
        console.error('Impossible to create the link', err);
      });
  };
}

// ==========
// UPDATE
// ==========

export function updateLink(project, formData, auth) {
  const payload = Object.assign({}, formData, {
    updatedBy: auth.username || 'Anonymous'
  });
  return dispatch => {
    return api.update(payload, auth.token)
      .then(json => {
        const data = Object.assign({}, json);
        dispatch(crud.updateItemSuccess('link', data));
        goToList(project);
        notie.alert(1, 'Your link has been updated.', 3);
      })
      .catch(err => {
        console.error('Error when calling Review API', err.message);
        notie.alert(3, 'Sorry, we were unable to save the link.', 3);
      });
  };
}
