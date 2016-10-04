/*
Textarea to enter comment in Markdown language, used in "Link" and "Review" forms
*/
import React from 'react'
import Field from './Field'
import Remaining from './RemainingChars'

const MD = ({ submitFailed, comment, max = 500 }) => (
  <Field
    label={
      <div style={{ display: 'flex' }}>
        <div>Your comment:</div>
        <div style={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}
        >
          <Remaining max={max} length={comment.value ? comment.value.length : 0} />
          <span className="mega-octicon octicon-markdown" style={{ marginLeft: 10 }} />
        </div>
      </div>
    }
    showError={submitFailed && comment.error}
    errorMessage={comment.error}
  >
    <textarea rows="8" {...comment} rows="10" maxLength={max} />
  </Field>
)
export default MD
