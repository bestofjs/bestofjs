/* globals window, self */

// auth0 actions
// 3 exported functions:
// - start()
// - login()
// - logout()

import browserHistory from 'react-router/lib/browserHistory'

import msgbox from '../helpers/msgbox'
import log from '../helpers/log'
import UrlManager from './urlManager'
import { fetchJSON } from '../helpers/fetch'

import { getUserRequests } from './repoActions'

// object used to save the current location in the local storage
// when the user pushes the login button.
const urlManager = typeof window !== 'undefined' && new UrlManager(window)

const APP_URL = 'https://bestofjs.auth0.com'

const LOCAL_KEYS = ['id', 'access']
  .map(key => `bestofjs_${key}_token`)

// Check if the user is logged in when the application starts
// called from <App> componentDidMount()
export function start () {
  return dispatch => {
    loginRequest()
    return getToken()
      .then(token => {
        getProfile(token.id_token)
          .then(profile => {
            if (profile) {
              const action = dispatch(loginSuccess(profile, token.id_token))
              const { username } = action.payload
              return dispatch(getUserRequests(username))
            } else {
              return dispatch(loginFailure())
            }
          })
          // .catch((e) => {
          //   console.error('getProfile error', e)
          //   return dispatch(loginFailure())
          // })
      })
      .catch((e) => {
        return dispatch(loginFailure())
      })
  }
}

// `login` action called from the login button
export function login () {
  // Save the current URL so that we can redirect the user when we are back
  if (urlManager) urlManager.save()
  const client_id = 'dadmCoaRkXs0IhWwnDmyWaBOjLzJYf4s'
  const redirect_uri = `${self.location.origin}%2Fauth0.html`
  const url = `${APP_URL}/authorize?scope=openid&response_type=token&connection=github&sso=true&client_id=${client_id}&redirect_uri=${redirect_uri}`
  return dispatch => {
    dispatch(loginRequest())
    // Go to auth0 authenication page
    self.location.href = url
  }
}

// Return user's `id_token` (JWT) checking from localStorage:
function getToken () {
  const [id_token, access_token] = LOCAL_KEYS.map(
    key => window.localStorage[key]
  )
  if (id_token) {
    return Promise.resolve({
      id_token,
      access_token
    })
  }
  return Promise.reject('')
}

// Return UserProfile for a given `id_token`
function getProfile (token) {
  if (!token) return Promise.reject(new Error('Token is missing!'))
  const options = {
    body: `id_token=${token}`,
    method: 'POST',
    headers: {
      Accept: 'application/json',
      // do not use Content-Type: 'application/json' to avoid extra 'OPTIONS' requests (#9)
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  const url = `${APP_URL}/tokeninfo`
  return fetchJSON(url, options)
}

export function loginRequest () {
  return {
    type: 'LOGIN_REQUEST'
  }
}
function loginSuccess (profile, token) {
  const path = urlManager && urlManager.get(true)
  if (path) {
    log('POST lOGIN REDIRECT', path)
    browserHistory.push(path)
    msgbox(`Hello ${profile.name}!`)
  }
  return {
    type: 'LOGIN_SUCCESS',
    payload: {
      username: profile.nickname,
      github_access_token: profile.identities[0].access_token,
      name: profile.name,
      avatar: profile.picture,
      followers: profile.followers,
      token
    }
  }
}
function loginFailure () {
  resetToken()
  return {
    type: 'LOGIN_FAILURE'
  }
}

// LOGOUT
function logoutRequest () {
  return {
    type: 'LOGOUT_REQUEST'
  }
}
function logoutSuccess () {
  msgbox('Disconnected. Come back at any time!', { type: 'INFO' })
  return {
    type: 'LOGOUT_SUCCESS'
  }
}

// logout button
export function logout () {
  return dispatch => {
    dispatch(logoutRequest())
    const p = new Promise(resolve => {
      // Do not call window.auth0.logout() that will redirect to Github signout page
      resetToken()
      resolve()
    })
    return p
      .then(() => dispatch(logoutSuccess()))
  }
}

function resetToken () {
  LOCAL_KEYS.forEach(key => window.localStorage.removeItem(key))
}
