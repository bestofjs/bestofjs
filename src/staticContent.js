/*
Some "static content" used in several places in the application: Homepage, About...
We don't import package.json to get the version number to save bytes!
*/

export default function() {
  return {
    projectName: 'Best of JavaScript',
    repo: 'https://github.com/bestofjs/bestofjs-webui',
    version: '0.19.0'
  }
}
