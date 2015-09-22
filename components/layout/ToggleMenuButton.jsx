var React = require('react');
var actions = require('../../scripts/actions');

var ToggleMenuButton = React.createClass({

  handleClick: function (e) {
    e.preventDefault();
    actions.toggleMenu();
  },

  render: function() {
    return (
      <a href="#menu" id="menuLink" className="menu-link" onClick={ this.handleClick }>
        <i className="fa fa-bars"></i>
      </a>
    );
  }

});

module.exports = ToggleMenuButton;
