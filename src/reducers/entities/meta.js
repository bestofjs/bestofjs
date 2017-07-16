export default function(state = {}, action) {
  switch (action.type) {
    case 'FETCH_PROJECTS_SUCCESS':
      return { ...state, lastUpdate: action.payload.date }
    default:
      return state
  }
}
