export default function createReducer(model) {
  return function(state = {}, action) {
    const { id, type } = action
    switch (type) {
      case `FETCH_${model.toUpperCase()}S_SUCCESS`:
        return addProjectItems({ id, state, items: action.payload })
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

function addProjectItems({ id, state: previousState, items }) {
  const state = { ...previousState }
  items.forEach(item => {
    state[item._id] = { ...item, project: id } // replace project GitHub full_name by its id (slug)
  })
  return state
}
