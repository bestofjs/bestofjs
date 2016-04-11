import React from 'react';
const Field = ({ label, children, showError, errorMessage }) => (
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
export default Field;
