const setup = {
  development: {
    GET_PROJECTS: 'https://bestofjs-api-dev.firebaseapp.com/',
    GET_README: 'https://get-github-readme-v2.now.sh',
    USER_CONTENT: 'http://localhost:3000',
    // USER_CONTENT: 'https://webtask.it.auth0.com/api/run/wt-mikeair-gmail_com-0/user-content-api-dev',
    ISSUES_REPO: 'michaelrambeau/bestofjs-sandbox'
  },
  production: {
    GET_PROJECTS: 'https://bestofjs-api-v2.firebaseapp.com/',
    GET_README: 'https://get-github-readme-v2.now.sh',
    USER_CONTENT: 'https://webtask.it.auth0.com/api/run/wt-mikeair-gmail_com-0/user-content-api-v3',
    ISSUES_REPO: 'michaelrambeau/bestofjs'
  }
}

module.exports = function getApi (key) {
  const api = process.env.NODE_ENV === 'development' ? setup.development : setup.production
  if (!api[key]) throw new Error(`No API end point defined for ${key}`)
  return api[key]
}
