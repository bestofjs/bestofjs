export default function createReducer(model) {
  return function(state = {}, action) {
    switch (action.type) {
      case `FETCH_${model.toUpperCase()}S_SUCCESS`:
        return action.payload.results.reduce(
          (acc, result) => ({
            ...acc,
            [result._id]: { ...result, _id: result._id }
          }),
          {}
        )
      case `CREATE_${model.toUpperCase()}_SUCCESS`:
        return { ...state, [action.payload._id]: action.payload }
      case `UPDATE_${model.toUpperCase()}_SUCCESS`:
        return {
          ...state,
          [action.payload._id]: {
            ...state[action.payload._id],
            ...action.payload
          }
        }
      default:
        return state
    }
  }
}
