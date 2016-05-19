import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import ProjectView from '../components/ProjectView'
import populate from '../helpers/populate'
import log from '../helpers/log'
import track from '../helpers/track'

// import { fetchReadmeIfNeeded } from '../actions'
import * as actionCreators from '../actions'
import * as authActionCreators from '../actions/authActions'

function loadData(props) {
  const project = props.project
  props.actions.fetchReadmeIfNeeded(project)
  track('View project', project.name)
}

const ProjectPage = React.createClass({

  componentWillMount() {
    loadData(this.props)
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      loadData(nextProps)
    }
  },

  render() {
    log('Render the <ProjectPage> container', this.props)
    const { project, review, link, auth, children, authActions } = this.props
    return (
      <ProjectView
        project={project}
        review={review}
        link={link}
        auth ={auth}
        authActions={authActions}
      >
      { children && project && React.cloneElement(children, {
        project,
        auth
      }) }
    </ProjectView>
    )
  }

})

function mapStateToProps(state, props) {
  const {
    entities: { projects, tags, links, reviews },
    auth
  } = state

  const id = props.params.id


  let project = projects[id]
  project = populate(tags, links, reviews)(project)

  // Review and Link in edit mode
  const reviewId = props.params.reviewId
  const linkId = props.params.linkId
  const review = reviews && reviewId ? reviews[reviewId] : null
  const link = links && linkId ? links[linkId] : null

  return {
    project,
    review,
    link,
    auth
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actionCreators, dispatch),
    authActions: bindActionCreators(authActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPage)
// export default connect(mapStateToProps, {
//   fetchReadme: fetchReadmeIfNeeded
// })(ProjectPage)
