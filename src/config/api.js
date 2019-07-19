const baseSetup = {
  GET_PROJECTS: 'https://bestofjs-api-v3.firebaseapp.com/',
  GET_README: 'https://get-github-readme-v2.now.sh',
  GET_USER_CONTENT: 'https://bestofjs-api-v2.now.sh',
  USER_CONTENT:
    'https://webtask.it.auth0.com/api/run/wt-mikeair-gmail_com-0/user-content-api-v3',
  GET_PROJECT_DATA: 'https://bestofjs-api-v2.now.sh',
  ISSUES_REPO: 'michaelrambeau/bestofjs',
  FETCH_LICENSE: 'https://fetch-license.now.sh'
}

const setup = {
  development: {
    ...baseSetup,
    ISSUES_REPO: 'michaelrambeau/bestofjs-sandbox'
  },
  production: {
    ...baseSetup
  }
}

export default function getApi(key) {
  const { NODE_ENV } = process.env
  const isLocalEnv = NODE_ENV === 'development'
  const api = isLocalEnv ? setup.development : setup.production
  if (!api[key]) throw new Error(`No API end point defined for ${key}`)
  return api[key]
}
