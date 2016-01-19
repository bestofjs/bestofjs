import { pushPath } from 'redux-simple-router';

import createApi from '../api/userContent';
import * as crud from './crudActions';

const api = createApi('links');

// ==========
// FETCH ALL
// ==========

export function fetchAllLinks() {
  console.info('FETCH links');
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
        const data = Object.assign({}, payload, {
          id: json.objectId, // POST request return only `objectId` and `createdAt` fields
          createdAt: json.createdAt
        });
        dispatch(crud.createItemSuccess('link', data));
        const path = `/projects/${project.id}/links/`;
        dispatch(pushPath(path));
        window.notie.alert(1, 'Thank you for the link!', 3);
      })
      .catch(err => {
        console.error('Error when calling API', err);
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
    // dispatch(updateReviewRequest(payload));
    return api.update(payload, auth.token)
      .then(json => {
        const data = Object.assign({}, payload, {
          updatedAt: json.updatedAt // PUT requests return only `updatedAt` field
        });
        dispatch(crud.updateItemSuccess('link', data));
        const path = `/projects/${project.id}/links/`;
        dispatch(pushPath(path));
        window.notie.alert(1, 'Your link has been updated.', 3);
      })
      .catch(err => {
        console.error('Error when calling Review API', err.message);
        window.notie.alert(3, 'Sorry, we were unable to save the link.', 3);
      });
  };
}
