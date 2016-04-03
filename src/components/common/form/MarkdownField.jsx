import React from 'react';
import Field from './Field';

const MD = ({ submitFailed, comment }) => (
  <Field
    label={
      <span>
        Your comment:
        <span className="mega-octicon octicon-markdown" style={{ float: 'right' }}></span>
      </span>
    }
    showError={ submitFailed && comment.error }
    errorMessage={ comment.error }
  >
    <textarea rows="8" {...comment} rows="10" />
  </Field>
);
export default MD;
