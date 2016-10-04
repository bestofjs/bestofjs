export default function createReducer (model) {
  return function (state = {}, action) {
    switch (action.type) {
      case `FETCH_${model.toUpperCase()}S_SUCCESS`:
        const state1 = Object.assign({}, state)
        action.payload.results.forEach(result => {
          const key = result._id
          const item = Object.assign({}, result, {
            _id: key
          })
          state1[key] = item
        })
        return state1
      case `CREATE_${model.toUpperCase()}_SUCCESS`:
        const item = action.payload
        return Object.assign({}, state, {
          [item._id]: item
        })
      case `UPDATE_${model.toUpperCase()}_SUCCESS`:
        const id = action.payload._id
        return Object.assign({}, state, {
          [id]: Object.assign({}, state[id], action.payload)
        })
      default:
        return state
    }
  }
}
