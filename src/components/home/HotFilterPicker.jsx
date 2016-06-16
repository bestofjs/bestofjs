import React from 'react'

const defaultOptions = [
  {
    text: 'By stars (total)',
    value: 'total'
  },
  {
    text: 'Since yesterday',
    value: 'daily'
  },
  {
    text: 'Since last week',
    value: 'weekly'
  },
  {
    text: 'Since last month',
    value: 'monthly'
  },
  {
    text: 'Since last 3 months',
    value: 'quaterly'
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
