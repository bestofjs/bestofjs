import React, { PropTypes } from 'react'

import Tabs from '../Tabs'
import Readme from './Readme'
import Header from './Header'

const Github = React.createClass({
  propTypes: {
    project: PropTypes.object
  },
  render () {
    const { project } = this.props
    return (
      <div>
        <Tabs project={project} activePath="readme" />
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
