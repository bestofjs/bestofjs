import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import AllProjects from '../components/projects/AllProjects'
import populate from '../helpers/populate'
import log from '../helpers/log'
import * as uiActionCreators from '../actions/uiActions'


const Page = React.createClass({
  render() {
    log('Render the <AllProjects> container', this.props)
    const { projects, isLoggedin, uiActions, ui } = this.props
    return (
      <AllProjects
        projects={projects}
        isLoggedin = {isLoggedin}
        uiActions={uiActions}
        showMetrics={ui.showMetrics}
        ui={ui}
      />
    )
  }
})

function mapStateToProps(state) {
  const {
    entities: {
      projects,
      tags,
      links
    },
    githubProjects,
    auth: {
      username
    },
    ui
  } = state

  const allProjects = githubProjects[ui.starFilter]
    .map(id => projects[id])
    .map(populate(tags, links))

  return {
    projects: allProjects,
    isLoggedin: username !== '',
    ui
  }
}

function mapDispatchToProps(dispatch) {
  return {
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page)
