const baseSetup = {
  GET_PROJECTS:
    readEnvironmentVariable('STATIC_API') ||
    'https://bestofjs-static-api.vercel.app',
  GET_README: 'https://bestofjs-serverless.now.sh',
  GET_PROJECT_DETAILS: 'https://bestofjs-serverless.now.sh',
  GET_PACKAGE_DATA: 'https://bestofjs-serverless.now.sh',
  GET_RANKINGS: 'https://bestofjs-rankings.vercel.app',
  ISSUES_REPO: 'michaelrambeau/bestofjs'
}

const setup = {
  development: {
    ...baseSetup
    // GET_RANKINGS: 'http://localhost:3000'
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
