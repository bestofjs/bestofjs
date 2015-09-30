var React = require('react');

var Stars = React.createClass({

  render: function() {
    var value = this.props.value;
    var digits = (value > 1000 && value < 10000) ? '0.0' : '0';
    return (
      <span>
        { window.numeral(value).format(digits + ' a') }
        { this.props.icon && (
          <i className="fa fa-star-o" style={{ fontSize: 18, marginLeft: 2 }}></i>
        ) }
      </span>
    );
  }

});

module.exports = Stars;
