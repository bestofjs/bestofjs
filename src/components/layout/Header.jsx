import React from 'react';
import IndexLink from 'react-router/lib/IndexLink';

import SearchForm from '../../containers/SearchFormContainer';
import ToggleMenuButton from './ToggleMenuButton';

export default ({ searchText, actions, showMetrics, uiActions, ui }) => (
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
          {false && <button
            className={`btn button-outline ${ui.showMetrics ? 'on' : 'off'}`}
            data-balloon-pos="left"
            data-balloon={`${ui.showMetrics ? 'Hide metrics' : 'Show metrics'}`}
            onClick={() => uiActions.toggleMetrics(!ui.showMetrics)}
            style={{ marginRight: '1rem', padding: '0 .5rem' }}
          >
            <span className="mega-octicon octicon-graph"></span>
          </button>}
          <SearchForm
            searchText = { searchText }
          />
        </div>
      </div>
    </div>
  </div>
);
