import browserHistory from 'react-router/lib/browserHistory'

import { fetchJSON } from '../helpers/fetch'
import getApi from '../../config/api'
import { createGithubIssue } from '../api/userContent'
import msgbox from '../helpers/msgbox'

export function getUserRequests(username) {
  return dispatch => {
    const repo = getApi('ISSUES_REPO')
    return fetchUserIssues(repo, username)
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
    return createIssueAddProject(form.project, form.comment, auth.token)
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

// submit handler called by `SubmitHeroPage` container
export function addHero(form, auth) {
  return dispatch => {
    dispatch({
      type: 'ADD_HERO_REQUEST',
      payload: form
    })
    return createIssueAddHero(form.hero, form.comment, auth.github_access_token)
      .then(json => {
        dispatch({
          type: 'ADD_HERO_SUCCESS',
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

// Add a hall of famer request
export function createIssueAddHero(username, comment, token) {
  const repo = getApi('ISSUES_REPO')
  const url = `https://github.com/${username}`
  const content = {
    title: `Add \`${username}\` user to the Hall of Fame`,
    body: `${url}\n${comment}
    `,
    labels: ['user request', 'add hero', 'valid']
  }
  return createGithubIssue(repo, content, token)
}

// Get issues created by the user
function fetchUserIssues(repo, username) {
  const url = `https://api.github.com/repos/${repo}/issues?creator=${username}&state=all`
  const options = {
    method: 'GET',
  }
  return fetchJSON(url, options)
    .then(r => checkStatus(r))
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
