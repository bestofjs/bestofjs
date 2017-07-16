import get from 'lodash.get'

export const APP_URL = 'https://bestofjs.auth0.com'

export const readUserProjects = profile =>
  get(profile, 'user_metadata.projects') || []
