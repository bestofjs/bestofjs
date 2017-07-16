const defaultState = {
  lastFetch: null,
  issues: []
}
export default function(state = defaultState, action) {
  switch (action.type) {
    case 'FETCH_ISSUES_SUCCESS':
      return {
        lastFetch: new Date(),
        issues: action.payload
      }
    case 'ADD_PROJECT_SUCCESS':
    case 'ADD_HERO_SUCCESS':
      return {
        issues: [action.payload, ...state.issues]
      }
    default:
      return state
  }
}
