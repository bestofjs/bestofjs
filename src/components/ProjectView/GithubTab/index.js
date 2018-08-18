import React from 'react'

import Tabs from '../Tabs'
import Header from './Header'
import ProjectHeader from '../ProjectHeader'
import ProjectTabsContent from '../ProjectTabsContent'
import NpmCard from './NpmCard'
import TrendsCard from './TrendsCard'
import ReadmeCard from './ReadmeCard'

const GitHub = props => {
  const { project } = props
  return (
    <div>
      <ProjectHeader project={project} />
      <Tabs project={project} activePath="" />
      <ProjectTabsContent>
        <Header {...props} />
      </ProjectTabsContent>
      {project.packageName && <NpmCard {...props} />}
      <TrendsCard {...props} />
      <ReadmeCard {...props} />
    </div>
  )
}

export default GitHub
