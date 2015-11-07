var React = require('react');

var ToggleMenuButton = React.createClass({

  //No `handleClick` event here, no action `ToggleMenu` action is dispatched

  render: function() {
    return (
      <a className="menu-link">
        <span className="mega-octicon octicon-three-bars"></span>
      </a>
    );
  }

});

module.exports = ToggleMenuButton;
