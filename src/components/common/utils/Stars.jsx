import React from 'react';
import numeral from 'numeral';

const Stars = React.createClass({

  render() {
    const value = this.props.value;
    const digits = (value > 1000 && value < 10000) ? '0.0' : '0';
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
