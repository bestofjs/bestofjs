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
        const item = action.payload
        return { ...state, [item._id]: item }
      case `UPDATE_${model.toUpperCase()}_SUCCESS`:
        const id = action.payload._id
        return { ...state, [id]: { ...state[id], ...action.payload } }
      default:
        return state
    }
  }
}
