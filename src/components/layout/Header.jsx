import React from 'react';
import { IndexLink } from 'react-router';
import SearchForm from '../home/SearchForm';
import ToggleMenuButton from './ToggleMenuButton';

const Header = React.createClass({
  render() {
    return (
      <div id="header">
        <div className="container">
          { /* Desktop header */}
          <div id="big-header" className="header-row">
            <div className="col-1">
              <ToggleMenuButton
                actions= { this.props.actions }
              />
              <IndexLink to={ '/' } className="link-logo" >
                <img src="images/logo.png" alt="bestof.js.org" width="150"/>
              </IndexLink>
            </div>
            <div className="col-2">
              <SearchForm
                searchText = { this.props.searchText }
              />
            </div>
          </div>

          { /* Mobile header */}
          <div id="small-header">
            <ToggleMenuButton
              actions= { this.props.actions }
            />
            <SearchForm
              searchText = { this.props.searchText }
            />
          </div>
        </div>
      </div>
    );
  }
});
module.exports = Header;
