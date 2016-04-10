import React from 'react';
export default ({ max, length }) => (
  <span style={{ fontSize: 14 }}>
    {length === 0 ? (
      `${max} characters max`
    ) : (
      `${max - length} characters left`
    )}
  </span>
);
