import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Home from '../components/home/Home'
import * as uiActionCreators from '../actions/uiActions'
import { getHotProjects, getNewestProjects } from '../selectors'
import { getPopularTags } from '../selectors/tag-selectors'

const HomePage = ({ auth, ui, pending, ...otherProps }) => {
  return <Home pending={auth.pending || pending} {...otherProps} />
}

function mapStateToProps(state) {
  const { auth, ui } = state

  const projectCount = 5
  const hotProjects = getHotProjects(projectCount)(state)

  const tagCount = 10
  const popularTags = getPopularTags(tagCount)(state)

  const newestProjectCount = 5
  const newestProjects = getNewestProjects(newestProjectCount)(state)

  const { pending, error } = state.entities.meta
  return { hotProjects, newestProjects, popularTags, auth, ui, pending, error }
}

function mapDispatchToProps(dispatch) {
  return {
    uiActions: bindActionCreators(uiActionCreators, dispatch),
    authActions: {}
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage)
