import React from 'react'
import { connect } from 'react-redux'

import Home from '../components/home/Home'
import { getNewestProjects } from '../selectors'
import { getPopularTags } from '../selectors/tag-selectors'

const HomePage = ({ auth, ui, pending, ...otherProps }) => {
  return <Home pending={auth.pending || pending} {...otherProps} />
}

function mapStateToProps(state) {
  const { auth, ui } = state

  const tagCount = 10
  const popularTags = getPopularTags(tagCount)(state)

  const newestProjectCount = 5
  const newestProjects = getNewestProjects(newestProjectCount)(state)

  const { pending, error } = state.entities.meta
  return { newestProjects, popularTags, auth, ui, pending, error }
}

function mapDispatchToProps(dispatch) {
  return {
    authActions: {}
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage)
