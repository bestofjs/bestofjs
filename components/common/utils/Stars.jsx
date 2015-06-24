var React = require('react');

var Stars = React.createClass({

  render: function() {
    var value = this.props.value;
    var digits = (value > 1000 && value < 10000) ? '0.0' : '0';
    return (
      <span>{ window.numeral(value).format(digits + ' a') }</span>
    );
  }

});

module.exports = Stars;
