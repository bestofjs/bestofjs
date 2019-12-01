const baseSetup = {
  GET_PROJECTS: 'https://bestofjs-api-v3.firebaseapp.com/',
  GET_README: 'https://get-github-readme-v2.now.sh',
  GET_PROJECT_DETAILS: 'https://bestofjs-api-v3.now.sh',
  ISSUES_REPO: 'michaelrambeau/bestofjs',
  FETCH_LICENSE: 'https://fetch-license.now.sh'
}

const setup = {
  development: {
    ...baseSetup,
    GET_PROJECTS: 'http://localhost:5000/',
    ISSUES_REPO: 'michaelrambeau/bestofjs-sandbox',
    GET_PROJECT_DETAILS: 'https://bestofjs-api-v3.now.sh'
  },
  production: {
    ...baseSetup
  }
}

export default function getApiRootURL(key) {
  const { NODE_ENV } = process.env
  const isLocalEnv = NODE_ENV === 'development'
  const api = isLocalEnv ? setup.development : setup.production
  if (!api[key]) throw new Error(`No API end point defined for ${key}`)
  return api[key]
}
