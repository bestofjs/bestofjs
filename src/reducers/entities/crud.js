export default function createReducer(model) {
  return function(state = {}, action) {
    switch (action.type) {
      case `FETCH_${model.toUpperCase()}S_SUCCESS`:
        return addProjectItems(state, action.payload)
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

function addProjectItems(state, items) {
  return items.reduce(
    (acc, item) => ({
      ...acc,
      [item._id]: { ...item, _id: item._id }
    }),
    {}
  )
}
