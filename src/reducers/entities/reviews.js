export default function (state = {}, action) {
  switch (action.type) {
  case 'GET_REVIEWS_SUCCESS':
    const state1 = Object.assign({}, state);
    action.data.results.forEach(result => {
      const key = result.objectId;
      const item = Object.assign({}, result, {
        id: key
      });
      state1[key] = item;
    });
    return state1;
  case 'CREATE_REVIEW_SUCCESS':
    const review = action.data;
    return Object.assign({}, state, {
      [review.id]: review
    });
  case 'UPDATE_REVIEW_SUCCESS':
    const id = action.review.id;
    return Object.assign({}, state, {
      [id]: Object.assign({}, state[id], action.review)
    });
  default:
    return state;
  }
}
