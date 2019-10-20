import React from 'react'

import GitHubRepoInfo from './GitHubRepoInfo'
import NpmCard from './NpmCard'
import TrendsCard from './TrendsCard'
import ReadmeCard from './ReadmeCard'

const ProjectDetailsMainTab = props => {
  const { project, isLoading, error } = props

  return (
    <>
      <GitHubRepoInfo {...props} />
      {project.packageName && (
        <NpmCard {...props} isLoading={isLoading} error={error} />
      )}
      <TrendsCard {...props} />
      <ReadmeCard {...props} />
    </>
  )
}

export default ProjectDetailsMainTab
