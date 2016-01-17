//
// Generic action creators for CRUD actions
//

export function fetchAllItemsSuccess(model, items) {
  return {
    type: `FETCH_${model.toUpperCase()}S_SUCCESS`,
    meta: {
      model
    },
    payload: items
  };
}
export function createItemSuccess(model, item) {
  return {
    type: `CREATE_${model.toUpperCase()}_SUCCESS`,
    meta: {
      model
    },
    payload: item
  };
}
export function updateItemSuccess(model, item) {
  return {
    type: `UPDATE_${model.toUpperCase()}_SUCCESS`,
    meta: {
      model
    },
    payload: item
  };
}
