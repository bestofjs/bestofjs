var React = require('react');

var ToggleMenuButton = React.createClass({

  handleClick: function (e) {
    e.preventDefault();
    this.props.actions.toggleMenu();
  },

  render: function() {
    return (
      <a href="#menu" className="menu-link" onClick={ this.handleClick }>
        <i className="fa fa-bars"></i>
      </a>
    );
  }

});

module.exports = ToggleMenuButton;
