// 'auth0-js' uses the `window` object that does not exist we do server-side endering
const Auth0 = typeof window === 'undefined' ? {} : require('auth0-js');

let auth0 = null;

export function start() {
  initAuth0();
  return dispatch => {
    loginRequest();
    return getToken()
      .then(token => {
        getProfile(token.id_token)
          .then(profile => {
            // console.info('profile', profile);
            if (profile) {
              return dispatch(loginSuccess(profile, token.access_token));
            } else {
              return dispatch(loginFailure());
            }
          });
      })
      .catch(() => {
        // console.error('Login failure', err);
        return dispatch(loginFailure());
      });
  };
}

function initAuth0() {
  const loc = window.location;
  // console.log('initAuth0', `${loc.protocol}//${loc.host}/`);
  auth0 = new Auth0({
    domain: 'bestofjs.auth0.com',
    clientID: 'MJjUkmsoTaPHvp7sQOUjyFYOm2iI3chx',
    callbackURL: `${loc.protocol}//${loc.host}/auth0.html`,
    callbackOnLocationHash: true
  });
}

// Return user's `id_token` (JWT) checking:
// - first the URL hash (when coming from Gittub authentication page)
// - then the local storage
// Return null if no token is found
function getToken() {
  const key = 'bestofjs_id_token';
  const result = auth0.parseHash(window.location.hash);
  // console.info('> Hash URL =>', result);
  let id_token = '';
  let access_token = '';
  if (result && result.id_token) {
    id_token = result.id_token;
    access_token = result.access_token;
    window.localStorage.setItem(key, id_token);
    window.localStorage.setItem('bestofjs_access_token', access_token);
    return Promise.resolve(id_token);
  }
  id_token = localStorage[key];
  access_token = localStorage.bestofjs_access_token;
  if (id_token) {
    return Promise.resolve({
      id_token,
      access_token
    });
  }
  return Promise.resolve('');
}

// Return UserProfile for a given `access_token`
export function getProfile(token) {
  return new Promise((resolve) => {
    if (!token) return resolve(null);
    // console.info('Checking the token...', token);
    auth0.getProfile(token, function (err, profile) {
      if (err) return resolve(null);
      return resolve(profile.nickname);
    });
  });
}

// LOGIN
export function loginRequest() {
  return {
    type: 'LOGIN_REQUEST'
  };
}
export function loginSuccess(username, token) {
  return {
    type: 'LOGIN_SUCCESS',
    username,
    token
  };
}
export function loginFailure(username) {
  return {
    type: 'LOGIN_FAILURE',
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

export function login() {
  return dispatch => {
    dispatch(loginRequest());
    return auth0.login({
      connection: 'github'
    })
      .then(json => dispatch(loginSuccess(json.nickname)))
      .catch(err => console.error('ERROR login', err.message));
  };
}
