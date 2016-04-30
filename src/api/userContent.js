require('isomorphic-fetch');
import getApi from '../../config/api';

const debug = false;
const API_BASE_URL = debug ? 'http://localhost:3000' : getApi('USER_CONTENT');

// Call user-content API to read/write "links" and "reviews"
function apiRequest(url, token, options) {
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      // no 'Content-Type' header for GET requests to avoid `OPTIONS` requests (#14)
    }
  };
  const requestOptions = Object.assign({}, defaultOptions, options);
  if (requestOptions.method !== 'GET') {
    requestOptions.headers['Content-Type'] = 'application/json';
  }
  if (token) requestOptions.headers.token = token;
  return fetch(`${API_BASE_URL}/${url}`, requestOptions)
    .then(response => {
      if (response.status >= 400) {
        return response.json()
          .then(json => {
            throw new Error(json.message);
          });
      }
      return response.json();
    });
}

// From a given URL end point (`reviews` or `links` for example)
// Return an API object with the following methods
// - getAll()
// - create()
// - update()
function createApi(endPoint) {
  const api = {
    getAll() {
      return apiRequest(endPoint);
    },
    create(body, token) {
      const options = {
        method: 'POST',
        body: JSON.stringify(body)
      };
      return apiRequest(endPoint, token, options);
    },
    update(body, token) {
      const options = {
        method: 'PUT',
        body: JSON.stringify(body)
      };
      return apiRequest(`${endPoint}/${body._id}`, token, options);
    }
  };
  return api;
}
export default createApi;
