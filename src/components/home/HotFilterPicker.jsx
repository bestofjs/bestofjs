import React from 'react'

const defaultOptions = [
  {
    text: 'By stars (total)',
    value: 'total'
  },
  {
    text: 'Trending yesterday',
    value: 'daily'
  },
  {
    text: 'Trending last week',
    value: 'weekly'
  },
  {
    text: 'Trending last month',
    value: 'monthly'
  },
  {
    text: 'Trending last 3 months',
    value: 'quaterly'
  },
  {
    text: 'By quality score',
    value: 'quality'
  }
]

export default ({ currentValue, onToggle, items = defaultOptions }) => (
  <select
    style={{
      fontSize: 'inherit',
      color: 'inherit',
      padding: 4,
      height: 'auto'
    }}
    value={currentValue}
    onChange={e => onToggle(e.target.value)}
  >
    {items.map(item => (
      <option
        value={item.value}
        key={item.value}
      >
        {item.text}
      </option>
    ))}
  </select>
)
