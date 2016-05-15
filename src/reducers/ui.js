const defaultState = {
  hotFilter: 'daily',
  starFilter: 'total'
}
export default (state = defaultState, action) => {
  switch (action.type) {
  case 'TOGGLE_HOT_FILTER':
    return Object.assign({}, state, {
      hotFilter: action.payload
    })
  case 'TOGGLE_STAR_FILTER':
    return Object.assign({}, state, {
      starFilter: action.payload
    })
  default:
    return state
  }
}
