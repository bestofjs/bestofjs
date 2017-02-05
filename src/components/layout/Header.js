import React from 'react'
import IndexLink from 'react-router/lib/IndexLink'

import SearchForm from '../../containers/SearchFormContainer'
import ToggleMenuButton from './ToggleMenuButton'

export default ({ searchText, actions, uiActions, ui, location }) => (
  <div id="header">
    <ToggleMenuButton
      actions={actions}
    />
    <div className="container">
      <div className="header-row">
        <div className="col-1">
          <IndexLink to={'/'} className="link-logo" >
            bestof.js.org
          </IndexLink>
        </div>
        <div className="col-2">
          <SearchForm
            searchText={searchText}
            location={location}
          />
        </div>
      </div>
    </div>
  </div>
)
