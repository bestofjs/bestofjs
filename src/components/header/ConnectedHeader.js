import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import Header from './Header'

import * as actions from '../../actions'
import * as authActionCreators from '../../actions/authActions'
import * as uiActionCreators from '../../actions/uiActions'

function mapStateToProps(state, props) {
  const { location } = props
  const { ui } = state
  return {
    ui,
    location
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    authActions: bindActionCreators(authActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header))
