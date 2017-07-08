import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as uiActionCreators from '../actions/uiActions'
import * as myProjectsActionCreators from '../actions/myProjectsActions'

function mapDispatchToProps (dispatch) {
  return {
    uiActions: bindActionCreators(uiActionCreators, dispatch),
    myProjectsActions: bindActionCreators(myProjectsActionCreators, dispatch),
    onAddToMyProjects: slug => dispatch(myProjectsActionCreators.addToMyProjects(slug)),
    onRemoveFromMyProjects: slug => dispatch(myProjectsActionCreators.removeFromMyProjects(slug))
  }
}

function mapStateToProps (state, props) {
  const {
    auth
  } = state
  return {
    isLoggedin: auth.username !== '',
    auth
  }
}

// HoC used to inject user's data and actions to a given Component
const withUser = (Component) => {
  return connect(mapStateToProps, mapDispatchToProps)(Component)
}

export default withUser
