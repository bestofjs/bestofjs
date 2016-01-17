const API_BASE_URL = 'https://webtask.it.auth0.com/api/run/wt-mikeair-gmail_com-0/8df41e6c061eb057d6dfe22c85815057';

function apiRequest(url, token, options) {
  const defaultOptions = {
    method: 'GET',
    headers: {
      ['Accept']: 'application/json',
      ['Content-Type']: 'application/json'
    }
  };
  const requestOptions = Object.assign({}, defaultOptions, options);
  if (token) requestOptions.headers.token = token;
  return fetch(`${API_BASE_URL}/${url}`, requestOptions)
    .then(response => {
      if (response.status >= 400) {
        throw new Error('Bad response from server');
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
      return apiRequest(`${endPoint}/${body.id}`, token, options);
    }
  };
  return api;
}
export default createApi;
