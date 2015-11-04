var React = require('react');

var ToggleMenuButton = React.createClass({

  handleClick: function (e) {
    e.preventDefault();
    this.props.actions.toggleMenu();
  },

  render: function() {
    return (
      <a href="#menu" className="menu-link" onClick={ this.handleClick }>
        <span className="mega-octicon octicon-three-bars"></span>
      </a>
    );
  }

});

module.exports = ToggleMenuButton;
