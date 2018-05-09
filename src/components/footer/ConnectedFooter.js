import { connect } from 'react-redux'

import getStaticContent from '../../staticContent'
import Footer from './Footer'
import { fetchProjects } from '../../actions/entitiesActions'

function mapStateToProps(state) {
  const staticContent = getStaticContent()
  const {
    entities: {
      meta: { lastUpdate }
    }
  } = state
  return {
    lastUpdate,
    staticContent
  }
}

const mapDispatch = { fetchProjects }

export default connect(mapStateToProps, mapDispatch)(Footer)
