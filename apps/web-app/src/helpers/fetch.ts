import fetch from "unfetch";

export function fetchJSON(url: string, options?: any): Promise<any> {
  return fetch(url, options)
    .then(checkStatus)
    .then((r) => r.json());
}

export function fetchHTML(url: string, options?: any): Promise<string> {
  return fetch(url, options).then((r) => r.text());
}

function checkStatus(response) {
  if (response.ok) {
    return response;
  } else {
    const error: any = new Error(response.statusText);
    error.response = response;
    return Promise.reject(error);
  }
}
