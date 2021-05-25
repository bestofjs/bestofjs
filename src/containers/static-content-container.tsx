import { createContainer } from 'unstated-next'

function useStaticContent() {
  return {
    projectName: 'Best of JS',
    repoURL: 'https://github.com/bestofjs/bestofjs-webui',
    risingStarsURL: 'https://risingstars.js.org',
    sponsorURL: `https://github.com/sponsors/michaelrambeau`,
    stateOfJSURL: `https://stateofjs.com`,
    version: process.env.REACT_APP_VERSION || '0.0.0'
  }
}

export const StaticContentContainer = createContainer(useStaticContent)
