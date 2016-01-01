export default function (state = {}, action) {
  switch (action.type) {
  case 'GET_REVIEWS_SUCCESS':
  case 'CREATE_REVIEW_SUCCESS':
    const reviews = action.data;
    return Object.assign({}, state, reviews);
  case 'EDIT_REVIEW_SUCCESS':
    const id = action.review.id;
    return Object.assign({}, state, {
      [id]: Object.assign({}, state[id], action.review)
    });
  default:
    return state;
  }
}
