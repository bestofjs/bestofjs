const defaultState = {
  hotFilter: 'daily',
  starFilter: 'total',
  showMetrics: true,
  showViewOptions: false,
  viewOptions: {
    description: true,
    npms: true,
    packagequality: false,
    commit: true
  }
}

const toggleStarFilter = (state, filter) => {
  const viewOptions =
    filter === 'packagequality' || filter === 'npms'
      ? Object.assign({}, state.viewOptions, {
          [filter]: true
        })
      : state.viewOptions
  return Object.assign({}, state, {
    starFilter: filter,
    viewOptions
  })
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'TOGGLE_HOT_FILTER':
      return Object.assign({}, state, {
        hotFilter: action.payload
      })
    case 'TOGGLE_STAR_FILTER':
      return toggleStarFilter(state, action.payload)
    case 'TOGGLE_METRICS':
      return Object.assign({}, state, {
        showMetrics: action.payload
      })
    case 'TOGGLE_SHOW_VIEW_OPTIONS':
      return Object.assign({}, state, {
        showViewOptions: action.payload
      })
    case 'TOGGLE_VIEW_OPTIONS':
      return Object.assign({}, state, {
        ...state.viewOptions,
        [action.payload.key]: action.payload.checked
      })
    default:
      return state
  }
}
