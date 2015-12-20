var React = require('react');
var numeral = require('numeral');

var Stars = React.createClass({

  render() {
    var value = this.props.value;
    var digits = (value > 1000 && value < 10000) ? '0.0' : '0';
    return (
      <span>
        { numeral(value).format(digits + ' a') }
        { this.props.icon && (
          <span className="octicon octicon-star" style={{ marginLeft: 2 }}></span>
        ) }
      </span>
    );
  }

});

module.exports = Stars;
