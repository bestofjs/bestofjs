import React from 'react'
const FieldRow = ({ label, children, showError, errorMessage }) => (
  <div className={`field ${showError ? ' error' : ''}`}>
    <label className="field-label">
      {label}
    </label>
    {children}
    {showError &&
      <div className="field-validation-error">
        <span className="octicon octicon-alert" />
        {' '}
        {errorMessage}
      </div>
    }
  </div>
)
export default FieldRow
