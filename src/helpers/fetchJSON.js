require('isomorphic-fetch');
import log from './log';

export default function (url, options) {
  log('Fetch', url);
  return fetch(url, options)
    .then(checkStatus)
    .then(r => r.json());
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}
