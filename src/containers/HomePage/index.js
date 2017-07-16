import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Home from '../../components/home/Home'
import mapStateToProps from './mapStateToProps'
import log from '../../helpers/log'
import * as uiActionCreators from '../../actions/uiActions'
import * as authActionCreators from '../../actions/authActions'

class HomePage extends Component {
  render() {
    log('Render the <HomePage> container', this.props)
    const {
      hotProjects,
      auth,
      uiActions,
      ui,
      authActions,
      popularTags
    } = this.props
    return (
      <Home
        hotProjects={hotProjects}
        isLoggedin={auth.username !== ''}
        pending={auth.pending}
        uiActions={uiActions}
        authActions={authActions}
        hotFilter={ui.hotFilter}
        showMetrics={ui.showMetrics}
        viewOptions={ui.viewOptions}
        popularTags={popularTags}
      />
    )
  }
}

function finalMapStateToProps(count) {
  return function(state) {
    return mapStateToProps(state, count)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    uiActions: bindActionCreators(uiActionCreators, dispatch),
    authActions: bindActionCreators(authActionCreators, dispatch)
  }
}

export default function(count = 10) {
  return connect(finalMapStateToProps(count), mapDispatchToProps)(HomePage)
}
