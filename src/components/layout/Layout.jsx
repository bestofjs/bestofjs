import React from 'react'

import Sidebar from '../sidebar/Sidebar'
import Header from './Header'
import Footer from './Footer'

const Layout = (props) => {
  const {
    children,
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
    ui
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
        uiActions={uiActions}
        ui={ui}
      />

      <div id="panel" className="slideout-panel">

        <Header
          searchText={textFilter}
          uiActions={uiActions}
          ui={ui}
        />

        <main id="main">
          {children}
        </main>

        <Footer
          staticContent={staticContent}
          lastUpdate={lastUpdate}
        />

      </div>

    </div>
  )
}

export default Layout
