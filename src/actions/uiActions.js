export function toggleHotFilter(value) {
  return {
    type: 'TOGGLE_HOT_FILTER',
    payload: value
  }
}
export function toggleStarFilter(value) {
  return {
    type: 'TOGGLE_STAR_FILTER',
    payload: value
  }
}
export function toggleMetrics(value) {
  return {
    type: 'TOGGLE_METRICS',
    payload: value
  }
}
export function toggleShowViewOptions(value) {
  return {
    type: 'TOGGLE_SHOW_VIEW_OPTIONS',
    payload: value
  }
}
export function toggleViewOption(key, checked) {
  return {
    type: 'TOGGLE_VIEW_OPTIONS',
    payload: {
      key,
      checked
    }
  }
}
