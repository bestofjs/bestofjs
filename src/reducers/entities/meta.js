export default function(state = { pending: true }, action) {
  switch (action.type) {
    case 'FETCH_PROJECTS':
      // We don't simply return `{ ...state, pending: true }`
      // to avoid an extra rendering when the application starts
      return state.pending ? state : { ...state, pending: true }
    case 'FETCH_PROJECTS_SUCCESS':
      return {
        ...state,
        pending: false,
        lastUpdate: new Date(action.payload.date)
      }
    default:
      return state
  }
}
