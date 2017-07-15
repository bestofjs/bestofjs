import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Sidebar from './Sidebar'
import { getPopularTags, getAllTags } from '../../selectors'

import * as actions from '../../actions'
import * as authActionCreators from '../../actions/authActions'
import * as uiActionCreators from '../../actions/uiActions'

function mapStateToProps(state) {
  const { entities: { heroes, links }, requests: { issues }, auth, ui } = state
  const allTags = getAllTags(state)
  const popularTags = getPopularTags(state)
  return {
    allTags,
    popularTags,
    auth,
    hofCount: Object.keys(heroes).length,
    linkCount: Object.keys(links).length,
    requestCount: Object.keys(issues).length,
    ui
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    authActions: bindActionCreators(authActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
