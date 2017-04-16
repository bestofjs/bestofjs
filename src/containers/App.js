import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as actions from '../actions'
import * as authActionCreators from '../actions/authActions'
import * as uiActionCreators from '../actions/uiActions'

import Wrapper from '../components/layout/Layout'
import getStaticContent from '../staticContent'
import log from '../helpers/log'

// Return the current tag id (if current path is /tags/:id) or '*'
function getCurrentTagId () {
  // const router = state.routing
  // const route = router.routes[1].path
  // return route === 'tags/:id' ? router.params.id : '*'
  return '*'
}

const App = React.createClass({
  componentDidMount () {
    this.props.authActions.start()
    log('App did mount!!!')
  },
  render () {
    log('Render the <App> container', this.props)
    const { children } = this.props
    return (
      <Wrapper {...this.props}>
        {children}
      </Wrapper>
    )
  }
})

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
    currentTagId: getCurrentTagId(state),
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

export default connect(mapStateToProps, mapDispatchToProps)(App)
