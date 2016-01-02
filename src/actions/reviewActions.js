import Parse from '../api/Parse';

import { pushPath } from 'redux-simple-router';

// ==========
// FETCH ALL
// ==========

export function fetchAllReviews() {
  return dispatch => {
    const parse = new Parse();
    parse.getAllReviews()
      .then(response => response.json())
      // .then(response => response.data)
      .then(json => dispatch(getReviewsSuccess(json)))
      .catch(err => {
        console.error('Error when calling Review API', err);
      });
  };
}

// ==========
// CREATE
// ==========

export function createReview(project, formData, username) {
  const payload = Object.assign({}, formData, {
    project: project.id,
    createdBy: username || 'Anonymous'
  });
  return dispatch => {
    dispatch(createReviewRequest(payload));
    const parse = new Parse();
    return parse.createReview(payload)
      .then(response => response.json())
      // .then(response => response.data)
      .then(json => {
        const data = Object.assign({}, payload, {
          id: json.objectId, // POST request return only `objectId` and `createdAt` fields
          createdAt: json.createdAt
        });
        dispatch(createReviewSuccess(data));
        const path = `/projects/${project.id}/reviews/`;
        dispatch(pushPath(path));
        window.notie.alert(1, 'Thank you for the review!', 1.5);
      });
      // .catch(err => {
      //   console.error('Error when calling Review API', err);
      // });
  };
}

function createReviewRequest(review) {
  return {
    type: 'CREATE_REVIEW_REQUEST',
    review
  };
}
function createReviewSuccess(review) {
  return {
    type: 'CREATE_REVIEW_SUCCESS',
    data: review
  };
}

export function getReviewsSuccess(json) {
  return {
    type: 'GET_REVIEWS_SUCCESS',
    data: json
  };
}

// ==========
// UPDATE
// ==========

export function updateReview(formData, username) {
  const payload = Object.assign({}, formData, {
    updatedBy: username || 'Anonymous'
  });
  return dispatch => {
    dispatch(updateReviewRequest(payload));
    const parse = new Parse();
    return parse.updateReview(payload)
      .then(response => response.json())
      .then(json => {
        const data = Object.assign({}, payload, {
          updatedAt: json.updatedAt // PUT requests return only `updatedAt` field
        });
        dispatch(updateReviewSuccess(data));
        const path = `/projects/${formData.project}/reviews/`;
        dispatch(pushPath(path));
        window.notie.alert(1, 'Your review has been updated.', 1.5);
      });
      // .catch(err => {
      //   console.error('Error when calling Review API', err);
      // });
  };
}

function updateReviewRequest(review) {
  return {
    type: 'UPDATE_REVIEW_REQUEST',
    review
  };
}
function updateReviewSuccess(review) {
  return {
    type: 'UPDATE_REVIEW_SUCCESS',
    review
  };
}
