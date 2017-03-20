import React from 'react'

import MainContent from '../common/MainContent'
import log from '../../helpers/log'

export default React.createClass({
  render () {
    log('Render <Project>', this.props)
    const { project, review, link, auth, authActions, children } = this.props
    return (
      <MainContent className="container project-page">
        <h1 style={{ margin: '0 0 1rem' }} className="no-card-container">
          {project.name}
        </h1>
        {children && project && React.cloneElement(children, {
          project,
          review,
          link,
          auth,
          authActions
        })}
      </MainContent>
    )
  }
})
