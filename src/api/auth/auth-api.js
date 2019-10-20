import { fetchJSON } from '../../helpers/fetch'
import { getUserRequests } from '../../actions/repoActions'
import { APP_URL } from './auth0'
import UrlManager from './urlManager'
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess
} from './auth-actions'

const LOCAL_KEYS = ['id', 'access'].map(key => `bestofjs_${key}_token`)

function createAuthApi({ dispatch }) {
  const urlManager = new UrlManager(window)
  return {
    start(history) {
      dispatch(loginRequest())
      const { id_token } = getToken()
      if (!id_token) {
        // No token found in the local storage => nothing to do
        return dispatch(loginFailure())
      }
      getProfile({ id_token })
        .then(({ profile, token }) => {
          const path = urlManager.get(true)
          if (path) {
            history.push(path)
          }
          const action = dispatch(loginSuccess({ profile, token }))
          const { username } = action.payload
          return dispatch(getUserRequests(username))
        })
        .catch(error => {
          resetToken()
          return dispatch(loginFailure(error))
        })
    },
    login() {
      // Save the current URL so that we can redirect the user when we are back
      urlManager.save()
      const client_id = 'dadmCoaRkXs0IhWwnDmyWaBOjLzJYf4s'
      const redirect_uri = `${window.location.origin}%2Fauth0.html`
      const url = `${APP_URL}/authorize?scope=openid&response_type=token&connection=github&sso=true&client_id=${client_id}&redirect_uri=${redirect_uri}`
      dispatch(loginRequest())
      // Go to auth0 authentication page
      window.location.href = url
    },
    logout() {
      dispatch(logoutRequest())
      // Do not call window.auth0.logout() that will redirect to GitHub sign out page
      resetToken()
      dispatch(logoutSuccess())
    }
  }
}

function getToken() {
  const [id_token, access_token] = LOCAL_KEYS.map(
    key => window.localStorage[key]
  )
  return id_token
    ? {
        id_token,
        access_token
      }
    : {}
}

// Return UserProfile for a given `id_token`
function getProfile({ id_token /*, access_token */ }) {
  // if (!token) return Promise.reject(new Error('Token is missing!'))
  const options = {
    body: `id_token=${id_token}`,
    method: 'POST',
    headers: {
      Accept: 'application/json',
      // do not use Content-Type: 'application/json' to avoid extra 'OPTIONS' requests (#9)
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  const url = `${APP_URL}/tokeninfo`
  return fetchJSON(url, options).then(profile => ({ token: id_token, profile }))
}

function resetToken() {
  LOCAL_KEYS.forEach(key => window.localStorage.removeItem(key))
}

export default createAuthApi
