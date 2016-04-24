import { hashHistory } from 'react-router';
const notie = typeof window === 'undefined' ? {} : require('notie');

import createApi from '../api/userContent';
import * as crud from './crudActions';

const settings = {
  'link': {
    api: createApi('links'),
    label: 'link'
  },
  'review': {
    api: createApi('reviews'),
    label: 'review'
  }
};

// Go to project item list after successful update or creation
function goToList(project, key) {
  const path = `/projects/${project.id}/${key}s/`;
  return hashHistory.push(path);
}

// ==========
// FETCH ALL
// ==========
export function fetchAll(key) {
  return function () {
    return dispatch => {
      settings[key].api.getAll()
      .then(json => dispatch(crud.fetchAllItemsSuccess(key, json)))
      .catch(err => {
        console.error('Error when calling user content API', err);
      });
    };
  };
}

// ==========
// CREATE
// ==========

export function create(key) {
  return function (project, formData, auth) {
    const payload = Object.assign({}, formData, {
      createdBy: auth.username || 'Anonymous'
    });
    if (key === 'review') payload.project = project.id;
    return dispatch => {
      // dispatch(createReviewRequest(payload));
      return settings[key].api.create(payload, auth.token)
        .then(json => {
          const data = Object.assign({}, json);
          dispatch(crud.createItemSuccess(key, data));
          goToList(project, key);
          notie.alert(1, `Thank you for the ${settings[key].label}!`, 3);
        })
        .catch(err => {
          notie.alert(3, `Sorry, we were unable to create the ${settings[key].label}. ${err.message}`, 3);
          console.error('Impossible to create the link', err);
        });
    };
  };
}

// ==========
// UPDATE
// ==========
export function update(key) {
  return function (project, formData, auth) {
    const payload = Object.assign({}, formData, {
      updatedBy: auth.username || 'Anonymous'
    });
    return dispatch => {
      return settings[key].api.update(payload, auth.token)
      .then(json => {
        const data = Object.assign({}, json);
        dispatch(crud.updateItemSuccess(key, data));
        goToList(project, key);
        notie.alert(1, `Your ${settings[key].label} has been updated.`, 3);
      })
      .catch(err => {
        console.error('Error when calling User content API', err.message);
        notie.alert(3, `Sorry, we were unable to save the ${settings[key].label}.`, 3);
      });
    };
  };
}
