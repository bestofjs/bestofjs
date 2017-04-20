import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import populate from '../helpers/populate'
import log from '../helpers/log'
import track from '../helpers/track'

import * as actionCreators from '../actions'
import * as authActionCreators from '../actions/authActions'

function loadData (props) {
  const project = props.project
  props.actions.fetchReadmeIfNeeded(project)
  track('View project', project.name)
}

function createProjectPage (ProjectView) {
  return class ProjectPage extends Component {
    componentWillMount () {
      loadData(this.props)
    }
    componentWillReceiveProps (nextProps) {
      if (nextProps.id !== this.props.id) {
        loadData(nextProps)
      }
    }
    render () {
      log('Render the <ProjectPage> container', this.props)
      const { project, review, link, auth, authActions } = this.props
      return (
        <ProjectView
          project={project}
          review={review}
          link={link}
          auth={auth}
          authActions={authActions}
        />
      )
    }
  }
}

function mapStateToProps (state, props) {
  const {
    entities: { projects, tags, links, reviews },
    auth
  } = state

  // `Route` components get a `match` prop. from react-router
  const params = props.match.params
  const { id, linkId, reviewId } = params

  let project = projects[id]
  project = populate(tags, links, reviews)(project)

  const review = reviews && reviewId ? reviews[reviewId] : null
  const link = links && linkId ? links[linkId] : null

  return {
    project,
    review,
    link,
    auth
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actionCreators, dispatch),
    authActions: bindActionCreators(authActionCreators, dispatch)
  }
}

export default ProjectView => connect(mapStateToProps, mapDispatchToProps)(createProjectPage(ProjectView))
