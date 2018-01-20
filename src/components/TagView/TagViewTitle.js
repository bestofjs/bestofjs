import React from 'react'

const Title = ({ title, count, icon, description }) => (
  <div className="no-card-container" style={{ marginBottom: '1rem' }}>
    <h3 style={{ marginBottom: '0', display: 'flex', alignItems: 'center' }}>
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
    {description && (
      <div
        style={{
          marginTop: '.5rem',
          borderLeft: '2px solid #fa9e59',
          paddingLeft: '1rem'
        }}
      >
        {description}
      </div>
    )}
  </div>
)

export default Title
