export const APP_URL = 'https://bestofjs.auth0.com'

export const readUserProjects = profile => {
  return (
    (profile && profile.user_metadata && profile.user_metadata.projects) || []
  )
}
