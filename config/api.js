const setup = {
  development: {

    GET_PROJECTS: 'https://bestofjs-api-dev.firebaseapp.com/',

    // URL of the "get-readme" micro-service raw code on the `DEV` branch
    GET_README: 'https://webtask.it.auth0.com/api/run/wt-mikeair-gmail_com-0/d4bf0bb7021ce02e77d5e2dceac010c7?webtask_no_cache=1',

    USER_CONTENT: 'https://webtask.it.auth0.com/api/run/wt-mikeair-gmail_com-0/user-content-api-dev'
  },

  production: {

    GET_PROJECTS: 'https://bestofjs-api-v1.firebaseapp.com/',

    // Link to `master` branch code
    GET_README: 'https://webtask.it.auth0.com/api/run/wt-mikeair-gmail_com-0/85801138b3a9d89112d0a04eef536d1f?webtask_no_cache=1',

    USER_CONTENT: 'https://webtask.it.auth0.com/api/run/wt-mikeair-gmail_com-0/user-content-api-v1'
  },
};

export default function getApi(key) {
  const api = process.env.NODE_ENV === 'development' ? setup.development : setup.production;
  if (!api[key]) throw new Error(`No API end point defined for ${key}`);
  return api[key];
}
