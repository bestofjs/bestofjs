import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import MyProjects from '../../components/MyProjects'
import withUser from '../../containers/withUser'
import { getMyProjects } from '../../selectors'
import log from '../../helpers/log'
import * as uiActionCreators from '../../actions/uiActions'

class MyProjectPage extends Component {
  render() {
    log('Render the <MyProjectsPage> container', this.props)
    const { myProjects, ui, isLoggedin } = this.props
    return <MyProjects projects={myProjects} ui={ui} isLoggedin={isLoggedin} />
  }
}

function mapStateToProps(state) {
  const { ui } = state

  const myProjects = getMyProjects(state)
  return {
    myProjects,
    ui
  }
}

function mapDispatchToProps(dispatch) {
  return {
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withUser(MyProjectPage))
