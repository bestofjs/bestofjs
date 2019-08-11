import { fetchJSON } from '../helpers/fetch'
import getApi from '../api/config'

const API_BASE_URL = getApi('USER_CONTENT')

// Call user-content API to read/write "links" and "reviews"
function apiRequest(url, token, options) {
  const defaultOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json'
      // no 'Content-Type' header for GET requests to avoid `OPTIONS` requests (#14)
    }
  }
  const requestOptions = Object.assign({}, defaultOptions, options)
  if (requestOptions.method !== 'GET') {
    requestOptions.headers['Content-Type'] = 'application/json'
  }
  if (token) requestOptions.headers.token = token
  return fetchJSON(`${API_BASE_URL}/${url}`, requestOptions)
}

// From a given URL end point (`reviews` or `links` for example)
// Return an API object with the following methods
// - getAll()
// - create()
// - update()
export function createUserContentApi(endPoint) {
  const api = {
    getAll() {
      return apiRequest(endPoint)
    },
    create(body, token) {
      const options = {
        method: 'POST',
        body: JSON.stringify(body)
      }
      return apiRequest(endPoint, token, options)
    },
    update(body, token) {
      const options = {
        method: 'PUT',
        body: JSON.stringify(body)
      }
      return apiRequest(`${endPoint}/${body._id}`, token, options)
    }
  }
  return api
}

// Create an issue in the given repository
// content: { title, body, tags}
export function createGithubIssue(repo, content, token) {
  const body = {
    repo,
    content
  }
  const options = {
    method: 'POST',
    body: JSON.stringify(body)
  }
  return apiRequest('create-issue', token, options)
}
