/*
Action Creators used by both auth APIs (the real one and the mock)
*/
import { readUserProjects } from './auth0'

export function loginRequest() {
  return {
    type: 'LOGIN_REQUEST'
  }
}

export function loginSuccess({ profile, token }) {
  return {
    type: 'LOGIN_SUCCESS',
    payload: {
      username: profile.nickname,
      github_access_token: profile.identities[0].access_token,
      name: profile.name,
      avatar: profile.picture,
      followers: profile.followers,
      token,
      user_id: profile.user_id,
      myProjects: readUserProjects(profile)
    }
  }
}

export function loginFailure(error) {
  return {
    type: 'LOGIN_FAILURE',
    error
  }
}

export function logoutRequest() {
  return {
    type: 'LOGOUT_REQUEST'
  }
}

export function logoutSuccess() {
  return {
    type: 'LOGOUT_SUCCESS'
  }
}
