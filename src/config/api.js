const setup = {
  development: {
    GET_PROJECTS: 'https://bestofjs-api-dev.firebaseapp.com/',
    GET_README: 'https://get-github-readme-v2.now.sh',
    GET_USER_CONTENT: 'https://bestofjs-api-v1.now.sh',
    GET_PROJECT_DATA: 'https://bestofjs-api-v2.now.sh',
    ISSUES_REPO: 'michaelrambeau/bestofjs-sandbox'
  },
  production: {
    GET_PROJECTS: 'https://bestofjs-api-dev.firebaseapp.com/',
    // For Bundlephobia demo, TO BE REVERTED LATER, when the production API is updated
    // GET_PROJECTS: 'https://bestofjs-api-v2.firebaseapp.com/',
    GET_README: 'https://get-github-readme-v2.now.sh',
    GET_USER_CONTENT: 'https://bestofjs-api-v1.now.sh',
    GET_PROJECT_DATA: 'https://bestofjs-api-v2.now.sh',
    ISSUES_REPO: 'michaelrambeau/bestofjs'
  }
}

function getApi(key) {
  const { NODE_ENV } = process.env
  const isLocalEnv = NODE_ENV === 'development'
  const api = isLocalEnv ? setup.development : setup.production
  if (!api[key]) throw new Error(`No API end point defined for ${key}`)
  return api[key]
}

module.exports = getApi
