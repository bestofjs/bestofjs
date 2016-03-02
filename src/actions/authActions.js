import Auth from '../api/Auth';
let auth = null;

// LOGIN
export function loginRequest() {
  return {
    type: 'LOGIN_REQUEST'
  };
}
export function loginSuccess(username) {
  return {
    type: 'LOGIN_SUCCESS',
    username
  };
}

export function fakeLogin() {
  return dispatch => {
    dispatch(loginRequest());
    const p = new Promise(function (resolve) {
      setTimeout(function () {
        resolve({ username: 'mike' });
      }, 1000);
    });
    return p
      .then(json => dispatch(loginSuccess(json.username)));
  };
}

// LOGOUT
export function logoutRequest() {
  return {
    type: 'LOGOUT_REQUEST'
  };
}
export function logoutSuccess() {
  return {
    type: 'LOGOUT_SUCCESS'
  };
}

export function logout() {
  return dispatch => {
    dispatch(logoutRequest());
    const p = new Promise(function (resolve) {
      // Do not call window.auth0.logout() that will redirect to Github signout page
      ['id', 'access']
        .map(key => `bestofjs_${key}_token`)
        .forEach(key => window.localStorage.removeItem(key));
      resolve();
    });
    return p
      .then(() => dispatch(logoutSuccess()));
  };
}

export function init() {
  auth = new Auth();
  return dispatch => {
    auth.checkLocalToken()
      .then(json => dispatch(loginSuccess(json.nickname)))
      .catch(err => console.error('ERROR auth init', err.message));
  };
}

export function login() {
  if (!auth) init();
  return dispatch => {
    dispatch(loginRequest());
    return auth.login()
      .then(json => dispatch(loginSuccess(json.nickname)))
      .catch(err => console.error('ERROR login', err.message));
  };
}
