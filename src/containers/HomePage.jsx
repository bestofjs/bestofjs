import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Home from '../components/home/Home'
import populate from '../helpers/populate'
import log from '../helpers/log'
import * as uiActionCreators from '../actions/uiActions'


const HomePage = React.createClass({
  render() {
    log('Render the <HomePage> container', this.props)
    const { hotProjects, popularProjects, isLoggedin, uiActions, ui } = this.props
    return (
      <Home
        hotProjects = { hotProjects }
        popularProjects = { popularProjects }
        maxStars = { popularProjects.length > 0 ? popularProjects[0].stars : 0 }
        isLoggedin = { isLoggedin }
        uiActions={uiActions}
        hotFilter={ui.hotFilter}
      />
    )
  }
})

function finalMapStateToProps(count) {
  return function (state) {
    return mapStateToProps(state, count)
  }
}
function mapStateToProps(state, count) {
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

  const key = ui.hotFilter // 'daily' or 'weekly'
  const hot = githubProjects[key]
    .map(id => projects[id])
    .slice(0, count) // display only the 20 hottest projects
    .map(populate(tags, links))
  const popularProjects = githubProjects.total
    .map(id => projects[id])
    .slice(0, count) // display the "TOP20"
    .map(populate(tags, links))

  return {
    hotProjects: hot,
    popularProjects,
    isLoggedin: username !== '',
    ui
  }
}

function mapDispatchToProps(dispatch) {
  return {
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  }
}

export default function (count = 10) {
  return connect(finalMapStateToProps(count), mapDispatchToProps)(HomePage)
}
