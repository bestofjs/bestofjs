import { connect } from 'react-redux'

import getStaticContent from '../../staticContent'
import Footer from './Footer'
import { fetchProjects } from '../../actions/entitiesActions'
import { isFreshDataAvailable } from '../../selectors'

function mapStateToProps(state) {
  const staticContent = getStaticContent()
  const showRefreshButton = isFreshDataAvailable(new Date())(state)
  const {
    entities: {
      meta: { lastUpdate }
    }
  } = state
  return {
    lastUpdate,
    staticContent,
    showRefreshButton
  }
}

const mapDispatch = { fetchProjects }

export default connect(mapStateToProps, mapDispatch)(Footer)
