var React = require('react');

var MainContent = React.createClass({

  render: function() {
    return (
      <div className="main-content">{ this.props.children }</div>
    );
  }

});

module.exports = MainContent;
