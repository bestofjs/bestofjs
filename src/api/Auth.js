export default class Auth {
  constructor() {
    this.lock = new window.Auth0Lock('MJjUkmsoTaPHvp7sQOUjyFYOm2iI3chx', 'bestofjs.auth0.com');
    console.info('Init auth0', this.lock);
    window.lock = this.lock;
  }

  checkLocalToken() {
    const token = window.localStorage['auth-token'];
    return this.getProfile(token);
  }

  login() {
    return new Promise((resolve, reject) => {
      this.lock.show(function onLogin(err, profile, token) {
        console.log('SUCCESS', profile, token);
        window.localStorage.setItem('auth-profile', JSON.stringify(profile));
        window.localStorage.setItem('auth-token', token);
        if (err) return reject(err);
        return resolve(profile);
      });
    });
  }

  getProfile(token) {
    return new Promise((resolve, reject) => {
      if (!token) return reject(new Error('NO_TOKEN'));
      this.lock.getProfile(token, function (err, profile) {
        if (err) return reject(err);
        return resolve(profile);
      });
    });
  }

}
