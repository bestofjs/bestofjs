const setup = {
  development: {

    GET_PROJECTS: 'https://bestofjs-api-dev.firebaseapp.com/',

    // GET_README: 'https://webtask.it.auth0.com/api/run/wt-mikeair-gmail_com-0/d4bf0bb7021ce02e77d5e2dceac010c7?webtask_no_cache=1',
    // GET_README: 'http://localhost:3000',
    GET_README: 'https://get-github-readme-v1.now.sh',

    USER_CONTENT: 'https://webtask.it.auth0.com/api/run/wt-mikeair-gmail_com-0/user-content-api-dev',
    // USER_CONTENT: 'http://localhost:3000',

    ISSUES_REPO: 'michaelrambeau/bestofjs-sandbox'
  },

  production: {

    GET_PROJECTS: 'https://bestofjs-api-v1.firebaseapp.com/',

    // Link to `master` branch code
    GET_README: 'https://get-github-readme-v1.now.sh',

    USER_CONTENT: 'https://webtask.it.auth0.com/api/run/wt-mikeair-gmail_com-0/user-content-api-v2',

    ISSUES_REPO: 'michaelrambeau/bestofjs'
  },
};

export default function getApi(key) {
  const api = process.env.NODE_ENV === 'development' ? setup.development : setup.production;
  if (!api[key]) throw new Error(`No API end point defined for ${key}`);
  return api[key];
}
