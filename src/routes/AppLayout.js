import React from 'react'

import Routes from './Routes'
import Sidebar from '../components/sidebar/ConnectedSidebar'
import Header from '../components/header/ConnectedHeader'
import Footer from '../components/footer/ConnectedFooter'

const AppLayout = () => {
  return (
    <div id="layout">
      <Sidebar />
      <div id="panel" className="slideout-panel">
        <Header />
        <main id="main">
          <Routes />
        </main>
        <Footer />
      </div>
    </div>
  )
}
export default AppLayout
