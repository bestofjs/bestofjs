import React from 'react'

import Tabs from '../Tabs'
import Readme from './Readme'
import Header from './Header'
import ProjectHeader from '../ProjectHeader'

const GitHub = (props) => {
  const { project } = props
  return (
    <div>
      <ProjectHeader project={project} />
      <Tabs project={project} activePath="" />
      <div className="project-tabs-content">
        <Header {...props} />
      </div>
      <br />
      <Readme {...props} />
    </div>
  )
}

export default GitHub
