import React, { PropTypes } from 'react';
const Field = React.createClass({
  propTypes: {
    label: PropTypes.string.isRequired
  },
  render() {
    const { label, children, showError, errorMessage } = this.props;
    return (
      <div className={`field ${showError ? ' error' : ''}`}>
        <label className="field-label">
          { label }
        </label>
        { children }
        { showError &&
          <div className="field-validation-error">
            <span className="octicon octicon-alert"></span>
            {' '}
            { errorMessage }
          </div>
        }
      </div>
    );
  }
});
export default Field;
