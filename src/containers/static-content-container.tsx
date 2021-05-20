import { createContainer } from 'unstated-next'

function useStaticContent() {
  return {
    projectName: 'Best of JS',
    repoURL: 'https://github.com/bestofjs/bestofjs-webui',
    sponsorURL: `https://github.com/sponsors/michaelrambeau`,
    version: process.env.REACT_APP_VERSION || '0.0.0'
  }
}

export const StaticContentContainer = createContainer(useStaticContent)
