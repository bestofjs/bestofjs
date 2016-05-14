import React from 'react';
import IndexLink from 'react-router/lib/IndexLink';

import SearchForm from '../../containers/SearchFormContainer';
import ToggleMenuButton from './ToggleMenuButton';

export default ({ searchText, actions }) => (
  <div id="header">
    <ToggleMenuButton
      actions= { actions }
    />
    <div className="container">
      <div className="header-row">
        <div className="col-1">
          <IndexLink to={ '/' } className="link-logo" >
            <img src="images/logo.png" alt="bestof.js.org" width="200"/>
          </IndexLink>
        </div>
        <div className="col-2">
          <SearchForm
            searchText = { searchText }
          />
        </div>
      </div>
    </div>
  </div>
);
