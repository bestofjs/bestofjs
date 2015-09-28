var React = require('react');
var Router = require('react-router');
var {Link} = Router;
var SearchForm = require('../home/SearchForm');
var ToggleMenuButton = require('./ToggleMenuButton');

require('./header.styl');

var Header = React.createClass({

  render: function() {
    return (
      <div id="header" style={{ }}>
        <div className="header-row" style={{ maxWidth: 800, margin: '0 auto', paddingTop: 10 }}>
          <div className="col-1" style={{ width: '50%' }}>
            <ToggleMenuButton />
            <Link to={ 'home' }>
              <img id="logo" src="images/logo.png" alt="bestof.js.org" width="150"/>
            </Link>
          </div>
          <div className="col-2" style={{ width: '50%' }}>
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
