var React = require('react');

var MainContent = React.createClass({

  render: function() {
    return (
      <div id="main-content" {...this.props}>
        { this.props.children }
      </div>
    );
  }

});

module.exports = MainContent;
