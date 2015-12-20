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

export function login() {
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
      setTimeout(function () {
        resolve({});
      }, 1000);
    });
    return p
      .then(() => dispatch(logoutSuccess()));
  };
}
