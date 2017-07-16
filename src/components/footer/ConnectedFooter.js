import { connect } from 'react-redux'

import getStaticContent from '../../staticContent'
import Footer from './Footer'

function mapStateToProps(state) {
  const staticContent = getStaticContent()
  const { entities: { meta: { lastUpdate } } } = state
  return {
    lastUpdate,
    staticContent
  }
}

export default connect(mapStateToProps)(Footer)
