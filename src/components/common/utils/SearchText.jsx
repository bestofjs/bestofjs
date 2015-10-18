var React = require('react');

var SearchText = React.createClass({

  render: function() {
    var style={
      color: '#bbb'
    };
    return (
      <span>
      <i className="fa fa-quote-left" style={ style } />
      <span style={{ padding: '0 4px 0 2px', fontStyle: 'italic' }}>{ this.props.children }</span>
      <i className="fa fa-quote-right" style={ style } />
      </span>
    );
  }

});

module.exports = SearchText;
