var React = require('react');
var Router = require('react-router');
var { IndexLink } = Router;
var SearchForm = require('../home/SearchForm');
var ToggleMenuButton = require('./ToggleMenuButton');

require('./header.styl');

var Header = React.createClass({

  render: function() {
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

          { /* Desktop header */}
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
