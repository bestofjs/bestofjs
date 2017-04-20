import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import List from '../components/user-requests/list/UserRequestList'
import * as repoActionCreators from '../actions/repoActions'

class SubmitRepoPage extends Component {
  render () {
    const { issues } = this.props
    return (
      <List
        requests={issues}
      />
    )
  }
}

function mapStateToProps (state) {
  const {
    auth,
    requests: { issues }
  } = state
  return {
    issues,
    auth
  }
}

function mapDispatchToProps (dispatch) {
  return {
    repoActions: bindActionCreators(repoActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SubmitRepoPage)
