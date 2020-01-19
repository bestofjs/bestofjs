const baseSetup = {
  GET_PROJECTS:
    readEnvironmentVariable('STATIC_API') ||
    'https://bestofjs-api-v3.firebaseapp.com',
  GET_README: 'https://get-github-readme-v2.now.sh',
  GET_PROJECT_DETAILS: 'https://bestofjs-api-v3.now.sh',
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

export default function getApiRootURL(key) {
  const { NODE_ENV } = process.env
  const isLocalEnv = NODE_ENV === 'development'
  const api = isLocalEnv ? setup.development : setup.production
  if (!api[key]) throw new Error(`No API end point defined for ${key}`)
  return api[key]
}

function readEnvironmentVariable(key) {
  // See https://create-react-app.dev/docs/adding-custom-environment-variables/#docsNav
  return process.env[`REACT_APP_${key}`]
}
