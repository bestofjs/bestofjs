import React from 'react'

const Title = ({ title, count, icon }) => (
  <h3
    className="no-card-container"
    style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}
  >
    <span
      className={`icon mega-octicon octicon-${icon}`}
      style={{ marginRight: '.25rem' }}
    />{' '}
    <span style={{ fontSize: '1.5rem' }}>{title}</span>
    <span
      className="counter"
      style={{ color: '#999', fontSize: '1rem', marginLeft: '.25rem' }}
    >
      {count === 1 ? ' (one project)' : ` (${count} projects)`}
    </span>
  </h3>
)

export default Title
