import React from 'react'

import MainContent from '../common/MainContent'
import log from '../../helpers/log'

export default React.createClass({
  render () {
    log('Render <Project>', this.props)
    const { project, review, link, auth, authActions, children } = this.props
    return (
      <MainContent className="container project-page">
          {project.id && (
            <div>

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
            </div>
          )}
      </MainContent>
    )
  }
})
