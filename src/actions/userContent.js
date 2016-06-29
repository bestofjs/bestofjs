import browserHistory from 'react-router/lib/browserHistory'
import msgbox from '../helpers/msgbox'

import createApi from '../api/userContent'
import * as crud from './crudActions'

const settings = {
  'link': {
    api: createApi('links'),
    label: 'link'
  },
  'review': {
    api: createApi('reviews'),
    label: 'review'
  }
}

// Go to project item list after successful update or creation
function goToList(project, key) {
  const path = `/projects/${project.slug}/${key}s/`
  return browserHistory.push(path)
}

// ==========
// FETCH ALL
// ==========
export function fetchAll(key) {
  return function () {
    return dispatch => {
      settings[key].api.getAll()
      .then(json => dispatch(crud.fetchAllItemsSuccess(key, json)))
      .catch(err => {
        msgbox(
          `Error when calling user content API. ${err.message}`,
          { type: 'ERROR' }
        )
      })
    }
  }
}

// ==========
// CREATE
// ==========

export function create(key) {
  return function (project, formData, auth) {
    const payload = Object.assign({}, formData, {
      createdBy: auth.username || 'Anonymous'
    })
    if (key === 'review') payload.project = project.slug
    return dispatch => {
      const action = dispatch(crud.createItemRequest(key, payload))
      return settings[key].api.create(action.payload, auth.token)
        .then(json => {
          const data = Object.assign({}, json)
          dispatch(crud.createItemSuccess(key, data))
          goToList(project, key)
          msgbox(`Thank you for the ${settings[key].label}!`)
        })
        .catch(err => {
          msgbox(
            `Sorry, we were unable to create the ${settings[key].label}. ${err.message}`,
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
  return function (project, formData, auth) {
    const payload = Object.assign({}, formData, {
      updatedBy: auth.username || 'Anonymous'
    })
    return dispatch => {
      // First dispaych a `...REQUEST` action
      // that will return an action updated by the middleware
      // (to convert project `slugs` to db `_id` )
      const action = dispatch(crud.updateItemRequest(key, payload))
      return settings[key].api.update(action.payload, auth.token)
      .then(json => {
        const data = Object.assign({}, json)
        dispatch(crud.updateItemSuccess(key, data))
        goToList(project, key)
        msgbox(`Your ${settings[key].label} has been updated.`)
      })
      .catch(err => {
        msgbox(
          `Sorry, we were unable to save the ${settings[key].label}. ${err.message}`,
          { type: 'ERROR' }
        )
      })
    }
  }
}
