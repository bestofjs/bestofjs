require('isomorphic-fetch')
import browserHistory from 'react-router/lib/browserHistory'

import getApi from '../../config/api'
import msgbox from '../helpers/msgbox'

export function getUserRequests(username, token) {
  return dispatch => {
    const repo = getApi('ISSUES_REPO')
    return fetchUserIssues(repo, username, token)
      .then(json => {
        dispatch({
          type: 'FETCH_ISSUES_SUCCESS',
          payload: json
        })
      })
  }
}

// submit handler called by `SubmitRepoPage` container
export function addProject(form, auth) {
  return dispatch => {
    dispatch({
      type: 'ADD_PROJECT_REQUEST',
      payload: form
    })
    return createIssueAddProject(form.project, form.comment, auth.github_access_token)
      .then(json => {
        dispatch({
          type: 'ADD_PROJECT_SUCCESS',
          payload: json
        })
        msgbox('Thank you! An issue has been created in the repo.')
        browserHistory.push('/requests')
      })
      .catch(err => {
        msgbox(
          `Sorry, we were unable to create the issue. ${err}`,
          { type: 'ERROR' }
        )
      })
  }
}

export function createIssueAddProject(project, comment, token) {
  const repo = getApi('ISSUES_REPO')
  const url = `https://github.com/${project}`
  const content = {
    title: `Add \`${project}\` project`,
    body: `${url}\n${comment}
    `,
    labels: ['user request', 'add project', 'valid']
  }
  return createGithubIssue(repo, content, token)
}

// Generic function to create an issue in a given Github repo
function createGithubIssue(repo, content, token) {
  const url = `https://api.github.com/repos/${repo}/issues`
  const options = {
    body: JSON.stringify(content),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `token ${token}`
    }
  }
  return fetch(url, options)
    .then(r => checkStatus(r))
    .then(r => r.json())
}

// Get issues created by the user
function fetchUserIssues(repo, username, token) {
  const url = `https://api.github.com/repos/${repo}/issues?creator=${username}&state=all`
  const options = {
    method: 'GET',
    headers: {
      'Authorization': `token ${token}` // use the github token to avoid "API rate limited problem"
    }
  }
  return fetch(url, options)
    .then(r => checkStatus(r))
    .then(r => r.json())
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
