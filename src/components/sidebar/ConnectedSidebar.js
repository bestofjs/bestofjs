import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import Sidebar from './Sidebar'
import { getPopularTags, getAllTags } from '../../selectors'

import * as actions from '../../actions'
import * as uiActionCreators from '../../actions/uiActions'

function mapStateToProps(state) {
  const {
    entities: { heroes, links, projects },
    requests: { issues },
    auth,
    ui
  } = state
  const allTags = getAllTags(state)
  const popularTags = getPopularTags(state)
  return {
    allTags,
    popularTags,
    auth,
    projectCount: Object.keys(projects).length,
    hofCount: Object.keys(heroes).length,
    linkCount: Object.keys(links).length,
    requestCount: Object.keys(issues).length,
    ui
  }
}

function mapDispatchToProps(dispatch, props) {
  const { dependencies } = props
  const auth = dependencies.authApi
  return {
    actions: bindActionCreators(actions, dispatch),
    authActions: {
      login: auth.login,
      logout: auth.logout
    },
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  }
}

// withRouter is needed to handle `activeClassName` property correctly
const ConnectedSidebar = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Sidebar)
)

ConnectedSidebar.propTypes = {
  dependencies: PropTypes.object.isRequired
}

export default ConnectedSidebar
