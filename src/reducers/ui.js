const defaultState = {
  hotFilter: 0
}
export default (state = defaultState, action) => {
  switch (action.type) {
  case 'TOGGLE_HOT_FILTER':
    return Object.assign({}, state, {
      hotFilter: action.payload
    })
  default:
    return state
  }
}
