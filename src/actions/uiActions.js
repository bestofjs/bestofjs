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
