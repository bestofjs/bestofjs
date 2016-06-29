import React from 'react'

const defaultOptions = [
  {
    value: 'total',
    text: 'Total',
    comment: 'total number of star',
    category: 'top'
  },
  {
    value: 'daily',
    text: '1 day',
    comment: 'star added yesterday',
    category: 'trend'
  },
  {
    value: 'weekly',
    text: '1 week',
    comment: 'star added last week',
    category: 'trend'
  },
  {
    value: 'monthly',
    text: '1 month',
    comment: 'star added last month',
    category: 'trend'
  },
  {
    value: 'quaterly',
    text: '3 months',
    comment: 'star added the last 3 months',
    category: 'trend',
  },
  {
    text: 'Quality',
    value: 'quality',
    comment: 'packagequality.com score',
    category: 'quality'
  }
]

export default ({ currentValue, onToggle, items = defaultOptions, category = '*' }) => (
  <div
    className="hot-filter-menu"
  >
    {items
      .filter(item => category === '*' || item.category === category)
      .map(item => (
        <div
          key={item.value}
          data-balloon={`Sort by ${item.comment}`}
          className={`hot-filter-menu-item ${currentValue === item.value ? 'on' : 'off'}`}
          onClick={() => onToggle(item.value)}
        >
          {item.text}
        </div>
    ))}
  </div>
)
