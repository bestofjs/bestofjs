export default function (state = {}, action) {
  switch (action.type) {
  case 'GET_LINKS_SUCCESS':
  case 'CREATE_LINK_SUCCESS':
    const newLinks = action.data;
    return Object.assign({}, state, newLinks);
  default:
    return state;
  }
}
