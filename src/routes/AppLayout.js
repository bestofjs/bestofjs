import React from 'react'

import Routes from './Routes'
import Sidebar from '../components/sidebar/Sidebar'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

const AppLayout = (props) => {
  const {
    allTags,
    popularTags,
    lastUpdate,
    staticContent,
    textFilter,
    currentTagId,
    auth,
    authActions,
    uiActions,
    hofCount,
    linkCount,
    requestCount,
    ui,
    location
  } = props
  return (
    <div id="layout">

      <Sidebar
        allTags={allTags}
        popularTags={popularTags}
        selectedTag={currentTagId}
        auth={auth}
        authActions={authActions}
        hofCount={hofCount}
        linkCount={linkCount}
        requestCount={requestCount}
        uiActions={uiActions}
        ui={ui}
      />

      <div id="panel" className="slideout-panel">

        <Header
          searchText={textFilter}
          uiActions={uiActions}
          ui={ui}
          location={location}
        />

        <main id="main">
          <Routes />
        </main>

        <Footer
          staticContent={staticContent}
          lastUpdate={lastUpdate}
        />

      </div>

    </div>
  )
}
export default AppLayout
