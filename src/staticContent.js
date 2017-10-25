/*
Some "static content" used in several places in the application: Homepage, About...
*/
/* globals PACKAGEJSON_VERSION */
export default function() {
  return {
    projectName: 'Best of JavaScript',
    repo: 'https://github.com/michaelrambeau/bestofjs-webui',
    version: process.env.VERSION // see Webpack config
  }
}
