//
// Generic action creators for CRUD actions
//

export function fetchAllItemsSuccess(model, items) {
  return {
    type: `FETCH_${model.toUpperCase()}S_SUCCESS`,
    meta: {
      model,
      convertProjectIds: true // tell the middleware to convert ids => slugs
    },
    payload: items
  };
}
export function createItemRequest(model, item) {
  return {
    type: `CREATE_${model.toUpperCase()}_SUCCESS`,
    meta: {
      model,
      convertProjectSlugs: true // tell the middleware to convert slugs => ids
    },
    payload: item
  };
}
export function createItemSuccess(model, item) {
  return {
    type: `CREATE_${model.toUpperCase()}_SUCCESS`,
    meta: {
      model,
      convertProjectIds: true // tell the middleware to convert ids => slugs
    },
    payload: item
  };
}
export function updateItemRequest(model, item) {
  return {
    type: `UPDATE_${model.toUpperCase()}_REQUEST`,
    meta: {
      model,
      convertProjectSlugs: true // tell the middleware to convert slugs => ids
    },
    payload: item
  };
}
export function updateItemSuccess(model, item) {
  return {
    type: `UPDATE_${model.toUpperCase()}_SUCCESS`,
    meta: {
      model,
      convertProjectIds: true // tell the middleware to convert ids => slugs
    },
    payload: item
  };
}
