/*
Some "static content" used in several places in the application: Homepage, About...
*/

export default function() {
  return {
    projectName: 'Best of JavaScript',
    repo: process.env.GITHUB_URL, // see Webpack config
    version: process.env.VERSION // see Webpack config
  }
}
