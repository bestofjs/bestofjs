import { pushPath } from 'redux-simple-router';

function createLinkRequest(link) {
  return {
    type: 'CREATE_LINK_REQUEST',
    link
  };
}
function createLinkSuccess(link) {
  return {
    type: 'CREATE_LINK_SUCCESS',
    data: {
      [link.id]: link
    }
  };
}

// Called by `LinkReduxForm`, when adding a link from the project tab
export function addLink(project, linkData, username) {
  const payload = Object.assign({}, linkData, {
    projects: [project.id],
    date: new Date().toISOString(),
    createdBy: username || 'Anonymous'
  });
  return dispatch => {
    dispatch(createLinkRequest(payload));
    const p = new Promise(function (resolve) {
      setTimeout(function () {
        const id = (new Date()).getTime();
        const data = Object.assign({}, payload, {
          id
        });
        resolve(data);
      }, 1000);
    });
    return p
      .then(json => {
        dispatch(createLinkSuccess(json));
        const path = `/projects/${project.id}/links/`;
        dispatch(pushPath(path));
      });
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
    data: {
      [review.id]: review
    }
  };
}

// Called by `ReviewReduxForm`, when adding a link from the project tab
export function addReview(project, reviewData, username) {
  const payload = Object.assign({}, reviewData, {
    project: project.id,
    createdAt: new Date().toISOString(),
    createdBy: username || 'Anonymous'
  });
  return dispatch => {
    dispatch(createReviewRequest(payload));
    const p = new Promise(function (resolve) {
      setTimeout(function () {
        const id = (new Date()).getTime();
        const data = Object.assign({}, payload, {
          id
        });
        resolve(data);
      }, 1000);
    });
    return p
      .then(json => {
        dispatch(createReviewSuccess(json));
        const path = `/projects/${project.id}/reviews/`;
        dispatch(pushPath(path));
      });
  };
}

function editReviewRequest(review) {
  return {
    type: 'EDIT_REVIEW_REQUEST',
    review
  };
}
function editReviewSuccess(review) {
  return {
    type: 'EDIT_REVIEW_SUCCESS',
    review
  };
}

export function editReview(reviewData) {
  const payload = Object.assign({}, reviewData, {
    updatedAt: new Date().toISOString(),
  });
  return dispatch => {
    dispatch(editReviewRequest(payload));
    const p = new Promise(function (resolve) {
      setTimeout(function () {
        resolve(payload);
      }, 1000);
    });
    return p
      .then(json => {
        dispatch(editReviewSuccess(json));
        const path = `/projects/${json.project}/reviews/`;
        dispatch(pushPath(path));
      });
  };
}
