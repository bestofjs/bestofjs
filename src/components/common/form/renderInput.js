import React from 'react'
import FieldRow from './FieldRow'

const renderInput = ({ input, label, type, meta: { touched, error } }) => {
  return (
    <FieldRow label={label} showError={touched && error} errorMessage={error}>
      <input {...input} type={type} />
    </FieldRow>
  )
}
export default renderInput
