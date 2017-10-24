import { fetchJSON } from '../helpers/fetch'
import log from '../helpers/log'
import api from '../../config/api'
import msgbox from '../helpers/msgbox'

import { createUserContentApi } from '../api/userContent'

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
// FETCH
// ==========

export function fetchProjectUserContent(project) {
  const id = project.slug
  return dispatch => {
    log('Fetching project user content', project)
    dispatch(fetchItemsRequest('link', id))
    const baseUrl = api('GET_USER_CONTENT')
    return fetchJSON(`${baseUrl}/projects/${project.full_name}/user-content`)
      .then(json => {
        const { reviews, links } = json
        dispatch(fetchItemsSuccess('link', links))
        dispatch(fetchItemsSuccess('review', reviews))
      })
      .catch(err => dispatch(fetchItemsFailure('link', err.message)))
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
      const action = dispatch(createItemRequest(key, payload))
      return settings[key].api
        .create(action.payload, auth.token)
        .then(json => {
          const data = Object.assign({}, json)
          dispatch(createItemSuccess(key, data))
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
      const action = dispatch(updateItemRequest(key, payload))
      return settings[key].api
        .update(action.payload, auth.token)
        .then(json => {
          const data = Object.assign({}, json)
          dispatch(updateItemSuccess(key, data))
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

export function fetchItemsRequest(model) {
  return {
    type: `FETCH_${model.toUpperCase()}S_REQUEST`,
    meta: {
      model
    }
  }
}

export function fetchItemsSuccess(model, items) {
  return {
    type: `FETCH_${model.toUpperCase()}S_SUCCESS`,
    meta: {
      model,
      convertProjectIds: true // tell the middleware to convert ids => slugs
    },
    payload: items
  }
}

export function fetchItemsFailure(model, error) {
  return {
    type: `FETCH_${model.toUpperCase()}S_FAILURE`,
    meta: {
      model
    },
    error
  }
}

export function createItemRequest(model, item) {
  return {
    type: `CREATE_${model.toUpperCase()}_SUCCESS`,
    meta: {
      model,
      convertProjectSlugs: true // tell the middleware to convert slugs => ids
    },
    payload: item
  }
}
export function createItemSuccess(model, item) {
  return {
    type: `CREATE_${model.toUpperCase()}_SUCCESS`,
    meta: {
      model,
      convertProjectIds: true // tell the middleware to convert ids => slugs
    },
    payload: item
  }
}
export function updateItemRequest(model, item) {
  return {
    type: `UPDATE_${model.toUpperCase()}_REQUEST`,
    meta: {
      model,
      convertProjectSlugs: true // tell the middleware to convert slugs => ids
    },
    payload: item
  }
}
export function updateItemSuccess(model, item) {
  return {
    type: `UPDATE_${model.toUpperCase()}_SUCCESS`,
    meta: {
      model,
      convertProjectIds: true // tell the middleware to convert ids => slugs
    },
    payload: item
  }
}
