import { useAsync } from 'react-async'

import getApi from './config'
import { fetchHTML, fetchJSON } from '../helpers/fetch'

const API_BASE_URL = getApi('USER_CONTENT')

export function useFetchProjectReadMe({ full_name, branch }) {
  return useAsync({
    promiseFn: fetchProjectReadMe,
    watch: full_name,
    full_name,
    branch
  })
}

function fetchProjectReadMe({ full_name, branch = 'master' }) {
  const url = `https://get-github-readme-v2.now.sh/${full_name}?branch=${branch}`
  return fetchHTML(url)
}

export function useFetchProjectDetails({ full_name }) {
  return useAsync({
    promiseFn: fetchProjectDetails,
    watch: full_name,
    full_name
  })
}

function fetchProjectDetails({ full_name }) {
  const url = `https://bestofjs-api-v2.now.sh/projects/${full_name}`
  return fetchJSON(url)
}

export function useFetchProjectUserContent({ full_name }) {
  return useAsync({
    promiseFn: fetchProjectUserContent,
    watch: full_name,
    full_name
  })
}

function fetchProjectUserContent({ full_name }) {
  const url = `https://bestofjs-api-v2.now.sh/projects/${full_name}/user-content`
  return fetchJSON(url)
}

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
  return fetchJSON({ url: `${API_BASE_URL}/${url}` }, requestOptions)
}

export function updateReview(body, token) {
  const options = {
    method: 'PUT',
    body: JSON.stringify(body)
  }
  return apiRequest(`reviews/${body._id}`, token, options)
}
