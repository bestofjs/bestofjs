import React from 'react'

import Tabs from '../Tabs'
import Readme from './Readme'
import Header from './Header'
import ProjectHeader from '../ProjectHeader'
import Trends from './Trends'

const GitHub = props => {
  const { project } = props
  return (
    <div>
      <ProjectHeader project={project} />
      <Tabs project={project} activePath="" />
      <div className="project-tabs-content">
        <Header {...props} />
      </div>
      <Trends {...props} />
      <Readme {...props} />
    </div>
  )
}

export default GitHub
