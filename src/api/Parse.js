import request from 'axios';

export default class Parse {
  /**
   * ## Parse
   *
   * constructor sets the default keys required by Parse.com
   * if a user is logged in, we'll need the sessionToken
   *
   */
  constructor(sessionToken) {
    this._applicationId = 'PIOwYSa1c0roR2DzappwYcxxlcl9Hnem7tgRuEWd';
    this._restAPIKey = 'KGCGEl3PwmXSuSnR4I2RXzDd9dSqSXCEEE0L230l';
    this._masterKey = null;
    this._sessionToken = sessionToken;
    this.API_BASE_URL = 'https://api.parse.com/1';
  }

  getAllReviews() {
    return this._fetch({
      url: '/classes/Review'
    });
  }

  createReview(data) {
    return this._fetch({
      method: 'POST',
      url: '/classes/Review',
      body: data
    });
  }

  updateReview(data) {
    return this._fetch({
      method: 'PUT',
      url: `/classes/Review/${data.id}`,
      body: data
    });
  }


  /**
   * ### _fetch
   * A generic function that prepares the request to Parse.com
   */
  _fetch(settings) {
    const defaultOptions = {
      method: 'GET',
      url: null,
      body: null,
      callback: null
    };
    const opts = Object.assign({}, defaultOptions, settings);

    const reqOpts = {
      method: opts.method,
      headers: {
        'X-Parse-Application-Id': this._applicationId,
        'X-Parse-REST-API-Key': this._restAPIKey
      }
    };
    if (this._sessionToken) {
      reqOpts.headers['X-Parse-Session-Token'] = this._sessionToken;
    }

    if (this._masterKey) {
      reqOpts.headers['X-Parse-Master-Key'] = this.masterKey;
    }

    if (opts.method === 'POST' || opts.method === 'PUT') {
      reqOpts.headers['Accept'] = 'application/json';
      reqOpts.headers['Content-Type'] = 'application/json';
    }

    if (opts.body) {
      reqOpts.body = JSON.stringify(opts.body);
    }

    return fetch(this.API_BASE_URL + opts.url, reqOpts);
    // return request(this.API_BASE_URL + opts.url, reqOpts);
  }
}
