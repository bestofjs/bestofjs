import React from 'react'

const options = [
  {
    text: 'yesterday',
    value: 0
  },
  {
    text: 'last week',
    value: 1
  }
]

export default ({ currentValue, onToggle }) => (
  <select
    style={{
      fontSize: 'inherit',
      color: 'inherit',
      padding: 4,
      height: 'auto'
    }}
    value={currentValue}
    onChange={e => onToggle(parseInt(e.target.value, 10))}
  >
    {options.map(item => (
      <option
        value={item.value}
        key={item.value}
      >
        {item.text}
      </option>
    ))}
  </select>
)
