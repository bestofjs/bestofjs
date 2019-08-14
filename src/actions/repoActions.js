import { fetchJSON } from '../helpers/fetch'
import getApi from '../api/config'

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
      .catch(error => {
        dispatch({
          type: 'FETCH_ISSUES_FAILURE',
          payload: error
        })
      })
  }
}

// Get issues created by the user
function fetchUserIssues(repo, username) {
  const url = `https://api.github.com/repos/${repo}/issues?creator=${username}&state=all`
  const options = {
    method: 'GET'
  }
  return fetchJSON(url, options)
}
