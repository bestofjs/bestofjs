import React from 'react'
import styled from 'styled-components'

import Label from './Label'
import FieldValidationError from './FieldValidationError'

const Div = styled.div`
  margin: 0 0 1em;
`

const FieldRow = ({ label, children, showError, errorMessage }) => (
  <Div className={`field ${showError ? ' error' : ''}`}>
    <Label className="field-label">{label}</Label>
    {children}
    {showError && (
      <FieldValidationError>
        <span className="octicon octicon-alert" /> {errorMessage}
      </FieldValidationError>
    )}
  </Div>
)
export default FieldRow
