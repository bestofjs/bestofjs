import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import Routes from './Routes'
import Sidebar from '../components/sidebar/ConnectedSidebar'
import Header from '../components/header/ConnectedHeader'
import Footer from '../components/footer/ConnectedFooter'
import { SearchBox, SearchProvider } from '../components/search'
// import { SearchContext, useSearch } from '../components/search/SearchContext'
import { getAllTags, allProjects } from '../selectors'

const AppLayout = ({ ...props }) => {
  return (
    <SearchProvider {...props}>
      <div id="layout">
        <Sidebar {...props} />
        <div id="panel" className="slideout-panel">
          <Header {...props} />
          <SearchBox />
          <main id="main">
            <Routes {...props} />
          </main>
          <Footer />
        </div>
      </div>
    </SearchProvider>
  )
}

AppLayout.propTypes = {
  dependencies: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  const tags = getAllTags(state)
  return {
    projects: allProjects(state),
    tags
  }
}

export default withRouter(connect(mapStateToProps)(AppLayout))
