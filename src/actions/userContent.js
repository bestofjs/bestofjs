import msgbox from '../helpers/msgbox'

import { createUserContentApi } from '../api/userContent'
import * as crud from './crudActions'

const settings = {
  link: {
    api: createUserContentApi('links'),
    label: 'link'
  },
  review: {
    api: createUserContentApi('reviews'),
    label: 'review'
  }
}

// Go to project item list after successful update or creation
function goToList(project, key, history) {
  const path = `/projects/${project.slug}/${key}s/`
  return history.push(path)
}

// ==========
// FETCH ALL
// ==========
export function fetchAll(key) {
  return function() {
    return dispatch => {
      settings[key].api
        .getAll()
        .then(json => dispatch(crud.fetchAllItemsSuccess(key, json)))
        .catch(err => {
          console.error(
            // eslint-disable-line no-console
            `Error when calling user content API. ${err.message}`
          )
        })
    }
  }
}

// ==========
// CREATE
// ==========

export function create(key) {
  return function(project, formData, auth, history) {
    const payload = Object.assign({}, formData, {
      createdBy: auth.username || 'Anonymous'
    })
    if (key === 'review') payload.project = project.slug
    return dispatch => {
      const action = dispatch(crud.createItemRequest(key, payload))
      return settings[key].api
        .create(action.payload, auth.token)
        .then(json => {
          const data = Object.assign({}, json)
          dispatch(crud.createItemSuccess(key, data))
          goToList(project, key, history)
          msgbox(`Thank you for the ${settings[key].label}!`)
        })
        .catch(err => {
          msgbox(
            `Sorry, we were unable to create the ${settings[key]
              .label}. ${err.message}`,
            { type: 'ERROR' }
          )
        })
    }
  }
}

// ==========
// UPDATE
// ==========
export function update(key) {
  return function(project, formData, auth, history) {
    const payload = Object.assign({}, formData, {
      updatedBy: auth.username || 'Anonymous'
    })
    return dispatch => {
      // First dispaych a `...REQUEST` action
      // that will return an action updated by the middleware
      // (to convert project `slugs` to db `_id` )
      const action = dispatch(crud.updateItemRequest(key, payload))
      return settings[key].api
        .update(action.payload, auth.token)
        .then(json => {
          const data = Object.assign({}, json)
          dispatch(crud.updateItemSuccess(key, data))
          goToList(project, key, history)
          msgbox(`Your ${settings[key].label} has been updated.`)
        })
        .catch(err => {
          msgbox(
            `Sorry, we were unable to save the ${settings[key]
              .label}. ${err.message}`,
            { type: 'ERROR' }
          )
        })
    }
  }
}
