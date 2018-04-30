import React from 'react'

import Tabs from '../Tabs'
import Readme from './Readme'
import Header from './Header'
import ProjectHeader from '../ProjectHeader'
import Trends from './Trends'
import ProjectTabsContent from '../ProjectTabsContent'

const GitHub = props => {
  const { project } = props
  return (
    <div>
      <ProjectHeader project={project} />
      <Tabs project={project} activePath="" />
      <ProjectTabsContent>
        <Header {...props} />
      </ProjectTabsContent>
      <Trends {...props} />
      <Readme {...props} />
    </div>
  )
}

export default GitHub
