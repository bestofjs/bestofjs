import log from './log'

const fetch = require('isomorphic-fetch')

export function fetchJSON(url, options) {
  log('Fetch', url)
  return fetch(url, options)
    .then(checkStatus)
    .then(r => r.json())
}

export function fetchHTML(url, options) {
  log('Fetch', url)
  return fetch(url, options)
    .then(checkStatus)
    .then(r => r.text())
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    const error = new Error(response.statusText)
    error.response = response
    throw error
  }
}
