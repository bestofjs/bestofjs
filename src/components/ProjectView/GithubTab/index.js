import React from 'react'
import PropTypes from 'prop-types'

import Tabs from '../Tabs'
import Readme from './Readme'
import Header from './Header'
import ProjectHeader from '../ProjectHeader'

const Github = React.createClass({
  propTypes: {
    project: PropTypes.object
  },
  render () {
    const { project } = this.props
    return (
      <div>
        <ProjectHeader project={project} />
        <Tabs project={project} activePath="" />
        <div className="project-tabs-content">
          <Header {...this.props} />
        </div>
        <br />
        <Readme {...this.props} />
      </div>
    )
  }
})
export default Github
