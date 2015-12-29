import React, { PropTypes } from 'react';
const Field = React.createClass({
  propTypes: {
    label: PropTypes.string.isRequired
  },
  render() {
    const { label, children } = this.props;
    return (
      <div className="field">
        <label>{ label }</label>
        { children }
      </div>
    );
  }
});
export default Field;
