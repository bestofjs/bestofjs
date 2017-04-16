import React from 'react'
import PropTypes from 'prop-types'

import ProjectHeader from '../ProjectHeader'
import Tabs from '../Tabs'

const Links = React.createClass({
  propTypes: {
    project: PropTypes.object
  },
  render () {
    const { project, link, auth, authActions, children } = this.props
    return (
      <div>
        <ProjectHeader project={project} />
        <Tabs project={project} activePath="links" />
        {children && project && React.cloneElement(children, {
          project,
          link,
          auth,
          authActions
        })}
      </div>
    )
  }
})
export default Links
