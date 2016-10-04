import React, { PropTypes } from 'react'

import Tabs from '../Tabs'

const Reviews = React.createClass({
  propTypes: {
    project: PropTypes.object
  },
  render () {
    const { project, review, children, auth, authActions } = this.props
    return (
      <div>
        <Tabs project={project} activePath="reviews" />
        <div className="project-tabs-content">
          <div className="inner">
            {children && project && React.cloneElement(children, {
              project,
              review,
              auth,
              authActions
            })}
          </div>
        </div>
      </div>
    )
  }
})
export default Reviews
