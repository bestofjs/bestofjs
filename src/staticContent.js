// Some "static content" used in several places in the application (Homepage, About...)

import pkg from '../package.json'

export default function () {
  return {
    projectName: 'bestof.js.org',
    repo: 'https://github.com/michaelrambeau/bestofjs-webui',
    version: pkg.version
  }
}
