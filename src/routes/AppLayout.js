import React from 'react'
import PropTypes from 'prop-types'

import Routes from './Routes'
import Sidebar from '../components/sidebar/ConnectedSidebar'
import Header from '../components/header/ConnectedHeader'
import Footer from '../components/footer/ConnectedFooter'

const AppLayout = props => {
  return (
    <div id="layout">
      <Sidebar {...props} />
      <div id="panel" className="slideout-panel">
        <Header />
        <main id="main">
          <Routes {...props} />
        </main>
        <Footer />
      </div>
    </div>
  )
}

AppLayout.propTypes = {
  dependencies: PropTypes.object.isRequired
}

export default AppLayout
