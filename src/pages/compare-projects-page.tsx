import React from 'react'
import { useParams } from 'react-router-dom'

import { CompareProjects } from 'components/compare/compare-projects'
import {
  ProjectDataContainer,
  useSelector
} from 'containers/project-data-container'
import { findProjectsByIds } from 'selectors'
import { Spinner } from 'components/core'

export const CompareProjectsPage = () => {
  const state = ProjectDataContainer.useContainer()
  const { ids: idsAsString } = useParams()
  const ids = idsAsString.split('+')
  console.log({ ids })
  // const ids = ['react', 'angular', 'vuejs']
  const projects = useSelector(findProjectsByIds(ids))
  if (state.isPending) return <Spinner />
  return <CompareProjects projects={projects} />
}
