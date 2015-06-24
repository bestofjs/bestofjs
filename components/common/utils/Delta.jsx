var React = require('react');

var Delta = React.createClass({

  render: function() {
    var style = {};
    var value = this.props.value;
    if (value < 0) {
      style.color = '#cc0000';
    }
    var formatDelta = function (value) {
      if (value === 0) return '=';
      if (value < 0) return  value;
      return '+ ' + value;
    };
    return (
      <span style={ style }>{ formatDelta(this.props.value) }</span>
    );
  }

});

module.exports = Delta;
