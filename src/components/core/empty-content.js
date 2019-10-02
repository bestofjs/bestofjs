import React from 'react'

export const EmptyContent = ({ children }) => {
  return (
    <div style={{ border: '2px dashed #fa9e59', padding: '2rem' }}>
      {children}
    </div>
  )
}
