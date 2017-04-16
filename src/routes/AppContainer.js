import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as actions from '../actions'
import * as authActionCreators from '../actions/authActions'
import * as uiActionCreators from '../actions/uiActions'

import AppLayout from './AppLayout'
import getStaticContent from '../staticContent'
import log from '../helpers/log'

class App extends React.Component {
  componentDidMount () {
    this.props.authActions.start()
    log('App did mount!')
  }
  componentDidUpdate (prevProps) {
    const { location, onRouterUpdate } = this.props
    if (location !== prevProps.location) {
      onRouterUpdate && onRouterUpdate(location)
    }
  }
  render () {
    log('Render the <App> container', this.props)
    return (
      <AppLayout {...this.props} />
    )
  }
}

function mapStateToProps (state) {
  const {
    entities: { tags, heroes, links },
    githubProjects: {
      tagIds,
      lastUpdate
    },
    requests: {
      issues
    },
    auth,
    ui
  } = state

  const allTags = tagIds.map(id => tags[id])
  const popularTags = allTags
    .slice()
    .sort((a, b) => b.counter > a.counter ? 1 : -1)
    .slice(0, 10)

  return {
    allTags,
    popularTags,
    lastUpdate,
    staticContent: getStaticContent(),
    auth,
    hofCount: Object.keys(heroes).length,
    linkCount: Object.keys(links).length,
    requestCount: Object.keys(issues).length,
    ui
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    authActions: bindActionCreators(authActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(App)
)
