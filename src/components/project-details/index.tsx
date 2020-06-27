import React from 'react'

import { GitHubRepoInfo } from './github-repo-info'
import { NpmCard } from './npm-card'
import { TrendsCard } from './trends-card'
import { ReadmeCard } from './readme-card'

type Props = {
  project: BestOfJS.ProjectDetails
  isLoading: boolean
  error: Error
}
const ProjectDetailsMainTab = (props: Props) => {
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
