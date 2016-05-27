const defaultState = {
  hotFilter: 'daily',
  starFilter: 'total',
  showMetrics: true
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
  case 'TOGGLE_METRICS':
    return Object.assign({}, state, {
      showMetrics: action.payload
    })
  default:
    return state
  }
}
