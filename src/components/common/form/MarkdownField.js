/*
Textarea to enter comment in Markdown language, used in "Link" and "Review" forms
*/
import React from 'react'
import FieldRow from './FieldRow'
import Remaining from './RemainingChars'
import Textarea from './Textarea'

const MD = ({ submitFailed, field, max = 500 }) => (
  <FieldRow
    label={
      <div style={{ display: 'flex' }}>
        <div>Your comment:</div>
        <div
          style={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center'
          }}
        >
          <Remaining
            max={max}
            length={field && field.value ? field.value.length : 0}
          />
          <span
            className="mega-octicon octicon-markdown"
            style={{ marginLeft: 10 }}
          />
        </div>
      </div>
    }
    showError={submitFailed && field.error}
    errorMessage={field.error}
  >
    <Textarea {...field} rows="10" maxLength={max} />
  </FieldRow>
)
export default MD
